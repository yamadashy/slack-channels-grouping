// modules
import * as EventEmitter from 'eventemitter3';
import * as domConstants from './dom-constants';

const WAIT_RENDER_CHANNEL_LIST_INTERVAL = 100;
const WAIT_RENDER_CHANNEL_LIST_TIMEOUT = 1000 * 30;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 100;

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
    this.lastUpdatedTime = Date.now();
    this.updateTimeoutId = null;
  }

  async start(): Promise<void> {
    await this.waitRenderChannelList();
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
  }

  protected waitRenderChannelList(): Promise<null> {
    return new Promise((resolve): void => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = (): void => {
        if (document.querySelectorAll(domConstants.CHANNEL_LIST_ITEMS_SELECTOR).length > 0) {
          resolve();
          return;
        }

        // timeout 30 seconds
        if (Date.now() - loopStartTime > WAIT_RENDER_CHANNEL_LIST_TIMEOUT) {
          resolve();
          return;
        }

        setTimeout(checkChannelListLoop, WAIT_RENDER_CHANNEL_LIST_INTERVAL);
      };

      checkChannelListLoop();
    });
  }

  enableObserver(): void {
    if (this.isObserving) {
      return;
    }
    if (!this.observer) {
      this.observer = new MutationObserver((): void => {
        const nextUpdateInterval = Math.max(0, this.lastUpdatedTime + UPDATE_CHANNEL_LIST_MIN_INTERVAL - Date.now());

        if (this.updateTimeoutId !== null) {
          window.clearTimeout(this.updateTimeoutId);
        }

        // Reduce infinity loop impact
        this.updateTimeoutId = setTimeout(() => {
          this.emit('update');
          this.lastUpdatedTime = Date.now();
        }, nextUpdateInterval);
      });
    }

    const observeTarget = document.querySelector(domConstants.CHANNEL_LIST_CONTAINER_SELECTOR);
    if (!observeTarget) {
      return;
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
