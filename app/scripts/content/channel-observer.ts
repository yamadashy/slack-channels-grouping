// modules
import * as EventEmitter from 'eventemitter3';
import * as domConstants from './dom-constants';
import { logger } from './logger';

const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 200;

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
          logger.labeledLog('Changed visibility to [visible] state');
          this.debounceEmitUpdate();
          this.enableObserver();
          break;
        case 'hidden':
          logger.labeledLog('Changed visibility to [hidden] state');
          this.disableObserver();
          break;
        default:
          logger.labeledLog('Changed visibility to [unknown] state');
          this.disableObserver();
          break;
      }
    });

    // Force re-observe on workspace tab changed
    const workspace = document.querySelector(domConstants.SELECTOR_WORKSPACE);
    const observer = new MutationObserver((): void => {
      logger.labeledLog('Workspace tab changed');

      this.debounceEmitUpdate();

      // re-observe
      this.disableObserver();
      this.enableObserver();
    });
    observer.observe(workspace, {
      attributes: true,
      attributeFilter: ['aria-label'],
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
        logger.labeledLog('Observed channel dom change');

        // Observe added channel list item
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((addedNode: Element) => {
            const channelListItemNameElem = addedNode.querySelector(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
            if (channelListItemNameElem !== null) {
              this.observeChannelListItemName(channelListItemNameElem);
            }
          });
        });

        // Emit update
        this.debounceEmitUpdate();
      });
    }

    // Observe elements
    this.observeChannelListContainer(channelListContainer);
    document.querySelectorAll(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR).forEach((channelListItemElem) => {
      this.observeChannelListItemName(channelListItemElem);
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

  protected observeChannelListContainer(channelListContainerElem: Node): void {
    logger.labeledLog('Observe channel list container');

    this.observer.observe(channelListContainerElem, {
      childList: true,
      // NOTE: If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
    });
  }

  protected observeChannelListItemName(channelListItemNameElem: Node): void {
    logger.labeledLog('Observe channel list item name');

    this.observer.observe(channelListItemNameElem, {
      attributes: true,
      attributeFilter: ['data-qa'],
    });
  }

  protected debounceEmitUpdate(): void {
    if (this.debounceEmitUpdateTimeoutId !== null) {
      window.clearTimeout(this.debounceEmitUpdateTimeoutId);
    }

    // Reduce infinity loop impact
    this.debounceEmitUpdateTimeoutId = window.setTimeout(() => {
      this.emit('update');
      logger.labeledLog('Emitted [update] event');
      this.lastUpdatedTime = Date.now();
    }, UPDATE_CHANNEL_LIST_MIN_INTERVAL);
  }
}
