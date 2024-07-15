import { ConsoleLogger } from './utils/console-logger';

declare let __DEVELOPMENT__: boolean;

export const logger = new ConsoleLogger(
  'slack-ch-group',
  __DEVELOPMENT__ ? ConsoleLogger.levels.TRACE : ConsoleLogger.levels.WARN,
);
