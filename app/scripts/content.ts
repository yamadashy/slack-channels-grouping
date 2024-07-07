import ChannelObserver from './content/channel-observer';
import ChannelGrouper from './content/channe-grouper';
import { waitElementRender } from './content/utils/wait-element-render';
import * as domConstants from './content/dom-constants';
import { logger } from './content/logger';
import { isAlreadyRunningExtension } from './content/utils/extension-running-checker';
import { DomChannelManipulator } from './content/channel-manipulators/dom-channel-manipulator';

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

      logger.labeledLog('Rendered channel list item.');

      const channelObserver = new ChannelObserver();
      const domChannnelManipulator = new DomChannelManipulator();
      const channelGrouper = new ChannelGrouper(domChannnelManipulator);

      // Grouping
      channelGrouper.groupingOnIdleAndDebounce();

      // Grouping on update
      channelObserver.on('update', () => {
        channelGrouper.groupingOnIdleAndDebounce();
      });

      channelObserver.startObserve();
    })
    .catch(() => {
      logger.labeledLog('Fail to wait channel list item.');
      // Do nothing
    });
})();
