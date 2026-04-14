import { Queue, Worker, QueueEvents } from "bullmq";
import { getOptimizedConfig } from "./queue.optimizer.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";

const queueLogger = logger.namespaceLogger("QUEUE");

const queues = new Map();
const workers = new Map();
const queueEvents = new Map();

export const getQueue = (queueName) => {
  if (!queues.has(queueName)) {
    const queue = new Queue(queueName, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          count: 100,
          age: 86400,
        },
        removeOnFail: {
          count: 50,
          age: 604800,
        },
      },
    });

    queues.set(queueName, queue);
    queueLogger.info(`Queue created: ${queueName}`);
  }

  return queues.get(queueName);
};

export const registerWorker = (queueName, processor) => {
  if (workers.has(queueName)) {
    queueLogger.warn(`Worker already registered for: ${queueName}`);
    return;
  }

  const config = getOptimizedConfig();

  const worker = new Worker(queueName, processor, {
    connection: redisClient,
    concurrency: config.concurrency,
    limiter: {
      max: config.rateLimit,
      duration: 1000,
    },
  });

  const events = new QueueEvents(queueName, {
    connection: redisClient,
  });

  worker.on("completed", (job) => {
    queueLogger.info(`Job completed in ${queueName}`, {
      jobId: job.id,
    });
  });

  worker.on("failed", (job, err) => {
    queueLogger.error(`Job failed in ${queueName}`, {
      jobId: job?.id,
      error: err.message,
    });
  });

  events.on("stalled", ({ jobId }) => {
    queueLogger.warn(`Job stalled in ${queueName}`, { jobId });
  });

  workers.set(queueName, worker);
  queueEvents.set(queueName, events);

  queueLogger.success(`Worker registered: ${queueName}`);
};

export const addJob = async (queueName, data, options = {}) => {
  const queue = getQueue(queueName);

  const job = await queue.add(queueName, data, {
    jobId: options.jobId,
    delay: options.delay,
    priority: options.priority,
    repeat: options.repeat,
    attempts: options.attempts,
    backoff: options.backoff,
    ...options,
  });

  queueLogger.info(`Job added to ${queueName}`, { jobId: job.id });
  return job;
};

export const scheduleJob = async (queueName, data, schedule, options = {}) => {
  let delay = 0;

  if (schedule.afterMs) delay = schedule.afterMs;
  else if (schedule.afterSeconds) delay = schedule.afterSeconds * 1000;
  else if (schedule.afterMinutes) delay = schedule.afterMinutes * 60 * 1000;
  else if (schedule.afterHours) delay = schedule.afterHours * 3600 * 1000;
  else if (schedule.afterDays) delay = schedule.afterDays * 86400 * 1000;
  else if (schedule.at) delay = schedule.at.getTime() - Date.now();

  if (delay <= 0) {
    throw new Error("Schedule time must be in the future");
  }

  return await addJob(queueName, data, {
    ...options,
    delay,
  });
};

export const repeatJob = async (queueName, data, repeat, options = {}) => {
  let repeatOptions = {};

  if (repeat.everyMs) repeatOptions.every = repeat.everyMs;
  else if (repeat.everySeconds)
    repeatOptions.every = repeat.everySeconds * 1000;
  else if (repeat.everyMinutes)
    repeatOptions.every = repeat.everyMinutes * 60 * 1000;
  else if (repeat.everyHours)
    repeatOptions.every = repeat.everyHours * 3600 * 1000;
  else if (repeat.everyDays)
    repeatOptions.every = repeat.everyDays * 86400 * 1000;
  else if (repeat.cron) repeatOptions.pattern = repeat.cron;

  return await addJob(queueName, data, {
    ...options,
    repeat: repeatOptions,
    jobId: options.jobId || `repeat:${queueName}`,
  });
};

export const removeJob = async (queueName, jobId) => {
  const queue = getQueue(queueName);
  const job = await queue.getJob(jobId);

  if (job) {
    await job.remove();
    queueLogger.info(`Job removed from ${queueName}`, { jobId });
    return true;
  }

  return false;
};

export const removeRepeatJob = async (queueName, jobId) => {
  const queue = getQueue(queueName);
  const repeatJobKey = jobId || `repeat:${queueName}`;

  await queue.removeRepeatableByKey(repeatJobKey);
  queueLogger.info(`Repeat job removed from ${queueName}`, {
    jobId: repeatJobKey,
  });
};

export const pauseQueue = async (queueName) => {
  const queue = getQueue(queueName);
  await queue.pause();
  queueLogger.warn(`Queue paused: ${queueName}`);
};

export const resumeQueue = async (queueName) => {
  const queue = getQueue(queueName);
  await queue.resume();
  queueLogger.info(`Queue resumed: ${queueName}`);
};

export const getQueueStats = async (queueName) => {
  const queue = getQueue(queueName);

  const [waiting, active, delayed, failed, completed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getDelayedCount(),
    queue.getFailedCount(),
    queue.getCompletedCount(),
  ]);

  return { waiting, active, delayed, failed, completed };
};

export const getJob = async (queueName, jobId) => {
  const queue = getQueue(queueName);
  return await queue.getJob(jobId);
};

export const getJobs = async (queueName, types = ["waiting", "active"]) => {
  const queue = getQueue(queueName);
  return await queue.getJobs(types);
};

export const cleanQueue = async (queueName, grace = 1000) => {
  const queue = getQueue(queueName);
  await queue.clean(grace, 100, "completed");
  await queue.clean(grace, 100, "failed");
  queueLogger.info(`Queue cleaned: ${queueName}`);
};

export const obliterateQueue = async (queueName) => {
  const queue = getQueue(queueName);
  await queue.obliterate({ force: true });
  queueLogger.warn(`Queue obliterated: ${queueName}`);
};

export const closeQueue = async (queueName) => {
  const worker = workers.get(queueName);
  const events = queueEvents.get(queueName);
  const queue = queues.get(queueName);

  if (worker) {
    await worker.close();
    workers.delete(queueName);
  }

  if (events) {
    await events.close();
    queueEvents.delete(queueName);
  }

  if (queue) {
    await queue.close();
    queues.delete(queueName);
  }

  queueLogger.info(`Queue closed: ${queueName}`);
};

export const closeAll = async () => {
  queueLogger.info("Closing all queues and workers...");

  for (const worker of workers.values()) {
    await worker.close();
  }

  for (const events of queueEvents.values()) {
    await events.close();
  }

  for (const queue of queues.values()) {
    await queue.close();
  }

  queues.clear();
  workers.clear();
  queueEvents.clear();

  queueLogger.success("All queues and workers closed");
};

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM", "SIGQUIT"];

SHUTDOWN_SIGNALS.forEach((signal) => {
  process.on(signal, async () => {
    await closeAll();
    process.exit(0);
  });
});
