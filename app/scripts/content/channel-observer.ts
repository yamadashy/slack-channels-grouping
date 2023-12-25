// modules
import { EventEmitter } from 'eventemitter3';
import * as domConstants from './dom-constants';
import { logger } from './logger';

/**
 * Channel Observing Class
 * @extends EventEmitter
 */
export default class ChannelObserver extends EventEmitter<'update'> {
  private isObserving: boolean;
  private channelListObserver: MutationObserver;

  constructor() {
    super();
    this.isObserving = false;
    this.channelListObserver = new MutationObserver((mutations): void => {
      logger.labeledLog('Observed channel dom change');

      // Observe added channel list item
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode instanceof HTMLElement) {
            const channelListItemNameElem = addedNode.querySelector(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
            if (channelListItemNameElem !== null) {
              this.observeChannelListItemName(channelListItemNameElem);
            }
          }
        });
      });

      // Emit update
      this.emitUpdate();
    });
  }

  protected emitUpdate(): void {
    this.emit('update');
  }

  async startObserve(): Promise<void> {
    this.enableObserver();

    // Switch observer on visibility changed
    document.addEventListener('visibilitychange', () => {
      switch (document.visibilityState) {
        case 'visible':
          logger.labeledLog('Changed visibility to [visible] state');
          this.emitUpdate();
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
    const workspaceObserver = new MutationObserver((): void => {
      logger.labeledLog('Workspace tab changed');

      this.emitUpdate();

      // re-observe
      this.disableObserver();
      this.enableObserver();
    });

    if (!workspace) {
      logger.labeledLog('Workspace element not found');
      return;
    }

    workspaceObserver.observe(workspace, {
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

    this.channelListObserver.disconnect();
    this.isObserving = false;
  }

  protected observeChannelListContainer(channelListContainerElem: Node): void {
    logger.labeledLog('Observe channel list container');

    this.channelListObserver.observe(channelListContainerElem, {
      childList: true,
      // NOTE: If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
    });
  }

  protected observeChannelListItemName(channelListItemNameElem: Node): void {
    logger.labeledLog('Observe channel list item name');

    this.channelListObserver.observe(channelListItemNameElem, {
      attributes: true,
      attributeFilter: ['data-qa'],
    });
  }
}
