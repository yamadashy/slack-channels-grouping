import { ConsoleLogger } from './utils/console-logger';

declare let IS_PRODUCTION_BUILD: boolean;

export const logger = new ConsoleLogger(
  'slack-ch-group',
  IS_PRODUCTION_BUILD ? ConsoleLogger.levels.WARN : ConsoleLogger.levels.TRACE,
);
