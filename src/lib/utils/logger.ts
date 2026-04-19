const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  },
  warn(message: string, ...args: unknown[]): void {
    if (isDev) console.warn(message, ...args);
  },
  info(message: string, ...args: unknown[]): void {
    if (isDev) console.info(message, ...args);
  },
};
