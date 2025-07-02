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
  private urlObserver: MutationObserver | null = null;
  private navObserver: MutationObserver | null = null;
  private periodicCheckInterval: NodeJS.Timeout | null = null;
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
    }, 100);
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

    this.observeWorkspace();
    this.observeWorkspaceWrapperChildren();
    this.observeNavigationChanges();
  }

  /**
   * Force re-observe on workspace tab changed
   * This is backward compatibility
   */
  protected observeWorkspace(): void {
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

    logger.labeledLog('Observe workspace');
    workspaceObserver.observe(workspace, {
      attributes: true,
      attributeFilter: ['aria-label'],
    });
  }

  /**
   * Force re-observe on workspace wrapper children changed
   */
  protected observeWorkspaceWrapperChildren(): void {
    const workspaceWrapper = document.querySelector(domConstants.SELECTOR_WORKSPACE_WRAPPER);
    const workspaceWrapperObserver = new MutationObserver((): void => {
      logger.labeledLog('Workspace wrapper children changed');

      this.emitUpdate();

      // re-observe
      this.disableObserver();
      this.enableObserver();
    });

    if (!workspaceWrapper) {
      logger.labeledLog('Workspace wrapper element not found');
      return;
    }

    logger.labeledLog('Observe workspace wrapper children');
    workspaceWrapperObserver.observe(workspaceWrapper, {
      childList: true,
      // NOTE: If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
    });
  }

  /**
   * Observe navigation changes to detect tab switches (Home/DMs/etc)
   */
  protected observeNavigationChanges(): void {
    // Clean up existing observers
    this.cleanupNavigationObservers();

    // Observe URL changes for SPA navigation
    let currentUrl = window.location.href;
    this.urlObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        logger.labeledLog('URL changed, re-applying grouping');
        setTimeout(() => {
          this.emitUpdate();
          this.disableObserver();
          this.enableObserver();
        }, 100);
      }
    });

    this.urlObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Observe sidebar navigation changes
    const sidebarNav = document.querySelector(domConstants.SELECTOR_SIDEBAR);
    if (sidebarNav) {
      this.navObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          // Check for changes in navigation state
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'class' || mutation.attributeName === 'aria-selected')) {
            shouldUpdate = true;
          }
          // Check for structural changes that might indicate tab switch
          if (mutation.type === 'childList') {
            // Check if channel list structure changed (workspace switch)
            const hasChannelListChanges = Array.from(mutation.addedNodes).some(node => 
              node instanceof HTMLElement && 
              (node.matches('[role="listitem"]') || node.matches('[role="treeitem"]') || 
               node.querySelector('[role="listitem"], [role="treeitem"]'))
            );
            if (hasChannelListChanges || mutation.removedNodes.length > 0) {
              shouldUpdate = true;
            }
          }
        });
        
        if (shouldUpdate) {
          logger.labeledLog('Navigation state changed, re-applying grouping');
          setTimeout(() => {
            this.emitUpdate();
            this.disableObserver();
            this.enableObserver();
          }, 300);
        }
      });

      this.navObserver.observe(sidebarNav, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class', 'aria-selected', 'data-qa', 'aria-label']
      });
    }

    // Periodic check as fallback
    this.periodicCheckInterval = setInterval(() => {
      const channelListItems = document.querySelectorAll(domConstants.SELECTOR_CHANNEL_LIST_ITEMS);
      const hasGroupedItems = Array.from(channelListItems).some(item => 
        item.querySelector('.scg-ch-separator')
      );
      const shouldHaveGrouping = Array.from(channelListItems).some(item => {
        const nameElement = item.querySelector(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
        return nameElement && nameElement.textContent && nameElement.textContent.includes('-');
      });
      
      if (shouldHaveGrouping && !hasGroupedItems) {
        logger.labeledLog('Periodic check: grouping missing, re-applying');
        this.emitUpdate();
      }
    }, 3000);
  }

  /**
   * Clean up navigation observers to prevent memory leaks
   */
  protected cleanupNavigationObservers(): void {
    if (this.urlObserver) {
      this.urlObserver.disconnect();
      this.urlObserver = null;
    }
    if (this.navObserver) {
      this.navObserver.disconnect();
      this.navObserver = null;
    }
    if (this.periodicCheckInterval) {
      clearInterval(this.periodicCheckInterval);
      this.periodicCheckInterval = null;
    }
  }

  /**
   * Cleanup method to be called when observer is no longer needed
   */
  public cleanup(): void {
    this.disableObserver();
    this.cleanupNavigationObservers();
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    this.removeAllListeners();
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
