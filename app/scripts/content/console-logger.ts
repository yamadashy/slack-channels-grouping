const LOG_LABEL = 'slack-ch-group';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function labeledLog(...values: any[]): void {
  console.log('%c' + LOG_LABEL, 'background: #67b083; color: #000; padding: 0.2em 0.5em', ...values);
}
