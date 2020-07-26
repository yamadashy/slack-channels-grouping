// modules
import * as EventEmitter from 'eventemitter3';
import * as domConstants from './dom-constants';

const WAIT_RENDER_CHANNEL_LIST_INTERVAL = 50;
const WAIT_RENDER_CHANNEL_LIST_TIMEOUT = 1000 * 30;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 50;

/**
 * Channel Observing Class
 * @extends EventEmitter
 */
export default class ChannelObserver extends EventEmitter<'update'> {
  private observer: MutationObserver;
  private isObserving: boolean;
  private lastUpdatedTime: number;
  private updateTimeoutId: number;

  constructor() {
    super();
    this.observer = null;
    this.isObserving = false;
    this.lastUpdatedTime = 0;
    this.updateTimeoutId = null;
  }

  async start(): Promise<void> {
    await this.waitRenderChannelList()
      .then(() => {
        this.emit('update');
        this.enableObserver();

        document.addEventListener('visibilitychange', () => {
          switch (document.visibilityState) {
            case 'visible':
              this.emit('update');
              this.enableObserver();
              break;
            case 'hidden':
              this.disableObserver();
              break;
          }
        });
      })
      .catch(() => {
        // Nothing to do
      });
  }

  protected waitRenderChannelList(): Promise<null> {
    return new Promise((resolve, reject): void => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = (): void => {
        // Found element
        if (document.querySelectorAll(domConstants.SELECTOR_CHANNEL_LIST_ITEMS).length > 0) {
          return resolve();
        }

        // Timeout 30 seconds
        if (Date.now() - loopStartTime > WAIT_RENDER_CHANNEL_LIST_TIMEOUT) {
          return reject();
        }

        window.setTimeout(checkChannelListLoop, WAIT_RENDER_CHANNEL_LIST_INTERVAL);
      };

      checkChannelListLoop();
    });
  }

  enableObserver(): void {
    const observeTarget = document.querySelector(domConstants.SELECTOR_CHANNEL_LIST_CONTAINER);

    if (this.isObserving) {
      return;
    }

    if (!observeTarget) {
      return;
    }

    // Initialize observeer
    if (!this.observer) {
      this.observer = new MutationObserver((): void => {
        const nextUpdateInterval = Math.max(UPDATE_CHANNEL_LIST_MIN_INTERVAL, this.lastUpdatedTime - Date.now());

        if (this.updateTimeoutId !== null) {
          window.clearTimeout(this.updateTimeoutId);
        }

        // Reduce infinity loop impact
        this.updateTimeoutId = window.setTimeout(() => {
          this.emit('update');
          this.lastUpdatedTime = Date.now();
        }, nextUpdateInterval);
      });
    }

    this.observer.observe(observeTarget, {
      childList: true,
      // If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
    });

    this.isObserving = true;
  }

  disableObserver(): void {
    if (!this.isObserving) {
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.isObserving = false;
    }
  }
}
