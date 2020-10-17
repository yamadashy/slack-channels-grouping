// modules
import * as EventEmitter from 'eventemitter3';
import * as domConstants from './dom-constants';

const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 50;

/**
 * Channel Observing Class
 * @extends EventEmitter
 */
export default class ChannelObserver extends EventEmitter<'update'> {
  private observer: MutationObserver;
  private isObserving: boolean;
  private lastUpdatedTime: number;
  private debounceEmitUpdateTimeoutId: number;

  constructor() {
    super();
    this.observer = null;
    this.isObserving = false;
    this.lastUpdatedTime = 0;
    this.debounceEmitUpdateTimeoutId = null;
  }

  async startObserve(): Promise<void> {
    this.enableObserver();

    // Switch observer on visibility changed
    document.addEventListener('visibilitychange', () => {
      switch (document.visibilityState) {
        case 'visible':
          this.debounceEmitUpdate();
          this.enableObserver();
          break;
        case 'hidden':
        default:
          this.disableObserver();
          break;
      }
    });
  }

  protected enableObserver(): void {
    const channelListContainer = document.querySelector(domConstants.SELECTOR_CHANNEL_LIST_CONTAINER);

    if (this.isObserving) {
      return;
    }

    if (!channelListContainer) {
      return;
    }

    // Initialize observer
    if (!this.observer) {
      this.observer = new MutationObserver((mutations): void => {
        // Observe added channel list item
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((addedNode: Element) => {
            const channelListItem = addedNode.querySelector(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
            if (channelListItem !== null) {
              this.observeChannelListItem(channelListItem);
            }
          });
        });

        // Emit update
        this.debounceEmitUpdate();
      });
    }

    // Observe elements
    this.observeChannelListContainer(channelListContainer);
    document.querySelectorAll(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR).forEach((channelListItem) => {
      this.observeChannelListItem(channelListItem);
    });

    this.isObserving = true;
  }

  protected disableObserver(): void {
    if (!this.isObserving) {
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.isObserving = false;
    }
  }

  protected observeChannelListContainer(channelListContainer: Node): void {
    this.observer.observe(channelListContainer, {
      childList: true,
      // NOTE: If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
    });
  }

  protected observeChannelListItem(channelListItem: Node): void {
    this.observer.observe(channelListItem, {
      attributes: true,
      attributeFilter: ['data-qa'],
    });
  }

  protected debounceEmitUpdate(): void {
    const nextUpdateInterval = Math.max(UPDATE_CHANNEL_LIST_MIN_INTERVAL, this.lastUpdatedTime - Date.now());

    if (this.debounceEmitUpdateTimeoutId !== null) {
      window.clearTimeout(this.debounceEmitUpdateTimeoutId);
    }

    // Reduce infinity loop impact
    this.debounceEmitUpdateTimeoutId = window.setTimeout(() => {
      this.emit('update');
      this.lastUpdatedTime = Date.now();
    }, nextUpdateInterval);
  }
}
