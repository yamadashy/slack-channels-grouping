import ChannelObserver from './content/channel-observer';
import ChannelGrouper from './content/channe-grouper';
import { alreadyAppliedExtension } from './content/apply-checker';
import { waitElementRender } from './content/utils/wait-element-render';
import * as domConstants from './content/dom-constants';
import { logger } from './content/logger';
import { isAlreadyRunningExtension } from './content/utils/extension-running-checker';

const RUNNING_CHECK_IDENTIFIER = 'slack-channels-grouping';
const WAIT_RENDER_CHANNEL_LIST_TIMEOUT = 1000 * 60;
const WAIT_RENDER_CHANNEL_LIST_INTERVAL = 200;

((): void => {
  waitElementRender(
    domConstants.SELECTOR_CHANNEL_LIST_ITEMS,
    WAIT_RENDER_CHANNEL_LIST_INTERVAL,
    WAIT_RENDER_CHANNEL_LIST_TIMEOUT,
  )
    .then(() => {
      // Check already running extension
      if (isAlreadyRunningExtension(RUNNING_CHECK_IDENTIFIER)) {
        logger.labeledLog('Extension is already running. Skip apply.');
        return;
      }

      // Check already running extension (For backward compatibility)
      if (alreadyAppliedExtension()) {
        logger.labeledLog('Extension is already applied. Skip apply.');
        return;
      }

      logger.labeledLog('Rendered channel list item.');

      const channelObserver = new ChannelObserver();
      const channelGrouper = new ChannelGrouper();

      // Grouping
      channelGrouper.groupingAllByPrefixOnIdleAndDebounce();

      // Grouping on update
      channelObserver.on('update', () => {
        channelGrouper.groupingAllByPrefixOnIdleAndDebounce();
      });

      channelObserver.startObserve();
    })
    .catch(() => {
      logger.labeledLog('Fail to wait channel list item.');
      // Do nothing
    });
})();
