import os from "os";

const CPU_COUNT = os.cpus().length;

export const getOptimizedConfig = () => {
  const nodeEnv = process.env.NODE_ENV || "development";

  const configs = {
    development: {
      concurrency: Math.max(1, Math.floor(CPU_COUNT / 2)),
      rateLimit: 10,
    },
    production: {
      concurrency: Math.max(2, CPU_COUNT - 1),
      rateLimit: 50,
    },
    test: {
      concurrency: 1,
      rateLimit: 5,
    },
  };

  return configs[nodeEnv] || configs.development;
};
