// modules
import 'requestidlecallback-polyfill';
import { logger } from './logger';
import {
  ChannelItemContext,
  ChannelItemContextGroupType,
  ChannelManipulator,
} from './channel-manipulators/channel-manipulator';

// constants
const GROUPING_IDLE_CALLBACK_TIMEOUT = 3 * 1000;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 200;

/**
 * Channel Grouping Class
 */
export default class ChannelGrouper {
  private debounceEmitUpdateTimeoutId: number | null;
  private idleCallbackId: number | null;

  constructor(private readonly adapter: ChannelManipulator) {
    this.debounceEmitUpdateTimeoutId = null;
    this.idleCallbackId = null;
  }

  groupingOnIdleAndDebounce(): void {
    if (this.debounceEmitUpdateTimeoutId !== null) {
      window.clearTimeout(this.debounceEmitUpdateTimeoutId);
    }

    // Reduce infinity loop impact
    this.debounceEmitUpdateTimeoutId = window.setTimeout(() => {
      if (this.idleCallbackId !== null) {
        window.cancelIdleCallback(this.idleCallbackId);
      }

      this.idleCallbackId = window.requestIdleCallback(
        () => {
          this.grouping();
        },
        {
          timeout: GROUPING_IDLE_CALLBACK_TIMEOUT,
        },
      );
    }, UPDATE_CHANNEL_LIST_MIN_INTERVAL);
  }

  protected grouping(): void {
    logger.labeledLog('Grouping all by prefix');

    let channelItemContexts = this.adapter.getChannelItemContexts();
    if (!channelItemContexts) {
      return;
    }

    this.adapter.persistChannelItemContexts(channelItemContexts);

    channelItemContexts = this.applyGroupingToContexts(channelItemContexts);

    logger.labeledLog('Grouped channelItemContexts:', channelItemContexts);

    this.adapter.updateChannelItems(channelItemContexts);
  }

  private applyGroupingToContexts(channelItemContexts: readonly ChannelItemContext[]): ChannelItemContext[] {
    return channelItemContexts.map((context, index) => {
      const currentPrefix = channelItemContexts[index].prefix;
      const prevPrefix = channelItemContexts[index - 1]?.prefix ?? null;
      const nextPrefix = channelItemContexts[index + 1]?.prefix ?? null;

      let groupType = ChannelItemContextGroupType.None;

      if (currentPrefix === null || (currentPrefix !== prevPrefix && currentPrefix !== nextPrefix)) {
        groupType = ChannelItemContextGroupType.Alone;
      } else {
        if (prevPrefix !== currentPrefix && nextPrefix === currentPrefix) {
          groupType = ChannelItemContextGroupType.Parent;
        } else {
          if (nextPrefix !== currentPrefix) {
            groupType = ChannelItemContextGroupType.LastChild;
          } else {
            groupType = ChannelItemContextGroupType.Child;
          }
        }
      }

      return {
        ...context,
        prefix: currentPrefix,
        groupType,
      };
    });
  }
}
