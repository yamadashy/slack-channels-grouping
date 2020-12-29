import * as loglevel from 'loglevel';

declare let IS_PRODUCTION_BUILD: boolean;

const LOG_LABEL = 'slack-ch-group';

// Set loglevel
loglevel.setLevel(IS_PRODUCTION_BUILD ? 'warn' : 'trace');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function labeledLog(...values: any[]): void {
  loglevel.debug('%c' + LOG_LABEL, 'background: #67b083; color: #000; padding: 0.2em 0.5em', ...values);
}
