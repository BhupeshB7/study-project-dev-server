 import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const levelPriority = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

class Logger {
  constructor(config) {
    this.level = config.level;
    this.namespace = config.namespace || "APP";
    this.showTimestamp =
      typeof config.showTimestamp === "boolean" ? config.showTimestamp : true;
  }

  shouldLog(required) {
    if (env !== "development") return false;
    return levelPriority[required] <= levelPriority[this.level];
  }

  formatMessage(message, context) {
    const formattedMessage =
      message instanceof Date
        ? `${colors.magenta}${message.toISOString()}${colors.reset}`
        : typeof message === "object"
          ? `\n${colors.gray}${JSON.stringify(message, null, 2)}${colors.reset}`
          : message;

    if (!context) return formattedMessage;

    const formattedContext = `\n${colors.gray}${JSON.stringify(
      context,
      null,
      2,
    )}${colors.reset}`;

    return `${formattedMessage}${formattedContext}`;
  }

  format(level, message, context) {
    const timestamp = this.showTimestamp
      ? `${colors.gray}${new Date().toISOString()}${colors.reset} `
      : "";

    return `${timestamp}${colors.blue}[${this.namespace}]${colors.reset} ${
      colors.cyan
    }${level}${colors.reset} → ${this.formatMessage(message, context)}`;
  }

  print(method, level, label, message, context) {
    if (!this.shouldLog(level)) return;

    const fn = console[method];
    fn(this.format(label, message, context));
  }

  log(message, context) {
    this.print("log", "info", "LOG", message, context);
  }

  info(message, context) {
    this.print("info", "info", "INFO", message, context);
  }

  warn(message, context) {
    this.print("warn", "warn", "WARN", message, context);
  }

  error(message, context) {
    this.print("error", "error", "ERROR", message, context);
  }

  debug(message, context) {
    this.print("debug", "debug", "DEBUG", message, context);
  }

  trace(message, context) {
    this.print("debug", "trace", "TRACE", message, context);
  }

  success(message, context) {
    this.print("log", "info", "SUCCESS", message, context);
  }

  namespaceLogger(namespace) {
    return new Logger({
      level: this.level,
      namespace,
      showTimestamp: this.showTimestamp,
    });
  }
}

const logger = new Logger({
  level: env === "development" ? "trace" : "silent",
  namespace: "CORE",
  showTimestamp: true,
});

export default logger;
