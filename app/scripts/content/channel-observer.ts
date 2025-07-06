// modules
import { EventEmitter } from 'eventemitter3';
import * as domConstants from './dom-constants';
import { logger } from './logger';

// constants
const DEBOUNCE_UPDATE_DELAY_MS = 100;

/**
 * Channel Observing Class
 * @extends EventEmitter
 */
export default class ChannelObserver extends EventEmitter<'update'> {
  private isObserving: boolean;
  private channelListObserver: MutationObserver;
  private debounceTimeout: NodeJS.Timeout | null = null;

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
    // Debounce rapid updates
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      logger.labeledLog('Emit update event');
      this.emit('update');
      this.debounceTimeout = null;
    }, DEBOUNCE_UPDATE_DELAY_MS);
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

    this.setupWorkspaceObservers();
  }

  /**
   * Setup all workspace-related observers
   */
  protected setupWorkspaceObservers(): void {
    // Configuration for each observer
    const observerConfigs = [
      {
        selector: domConstants.SELECTOR_WORKSPACE,
        logMessage: 'Workspace tab changed',
        elementNotFoundMessage: 'Workspace element not found',
        observeMessage: 'Observe workspace',
        options: {
          attributes: true,
          attributeFilter: ['aria-label'],
        },
      },
      {
        selector: domConstants.SELECTOR_WORKSPACE_WRAPPER,
        logMessage: 'Workspace wrapper children changed',
        elementNotFoundMessage: 'Workspace wrapper element not found',
        observeMessage: 'Observe workspace wrapper children',
        options: {
          childList: true,
          subtree: false,
        },
      },
      {
        selector: domConstants.SELECTOR_WORKSPACE_LAYOUT,
        logMessage: 'Workspace layout children changed',
        elementNotFoundMessage: 'Workspace layout element not found',
        observeMessage: 'Observe workspace layout children',
        options: {
          childList: true,
          subtree: false,
        },
      },
    ];

    // Create observers for each configuration
    observerConfigs.forEach((config) => {
      const element = document.querySelector(config.selector);

      if (!element) {
        logger.labeledLog(config.elementNotFoundMessage);
        return;
      }

      const observer = new MutationObserver((): void => {
        logger.labeledLog(config.logMessage);

        this.emitUpdate();

        // re-observe
        this.disableObserver();
        this.enableObserver();
      });

      logger.labeledLog(config.observeMessage);
      observer.observe(element, config.options);
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
