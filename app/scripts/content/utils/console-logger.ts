import * as loglevel from 'loglevel';

export class ConsoleLogger {
  public static levels = loglevel.levels;
  private label: string;
  private logger: loglevel.Logger;

  constructor(label: string, logLevel: loglevel.LogLevelDesc) {
    this.label = label;
    this.logger = loglevel.getLogger(label);
    this.logger.setLevel(logLevel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labeledLog(...values: any[]): void {
    this.logger.debug('%c' + this.label, 'background: #67b083; color: #000; padding: 0.2em 0.5em', ...values);
  }
}
