import ChannelObserver from './content/channel-observer';
import ChannelGrouper from './content/channe-grouper';
import { alreadyAppliedExtension } from './content/apply-checker';
import { waitElementRender } from './content/utils/wait-element-render';
import * as domConstants from './content/dom-constants';
import { labeledLog } from './content/utils/console-logger';

const WAIT_RENDER_CHANNEL_LIST_TIMEOUT = 1000 * 60;

((): void => {
  if (alreadyAppliedExtension()) {
    labeledLog('Extension is already applied. Skip apply.');
    return;
  }

  waitElementRender(domConstants.SELECTOR_CHANNEL_LIST_ITEMS, WAIT_RENDER_CHANNEL_LIST_TIMEOUT)
    .then(() => {
      labeledLog('Rendered channel list item.');

      const channelObserver = new ChannelObserver();
      const channelGrouper = new ChannelGrouper();

      // Grouping
      channelGrouper.groupingAllByPrefixOnIdle();

      // Grouping on update
      channelObserver.on('update', () => {
        channelGrouper.groupingAllByPrefixOnIdle();
      });
      channelObserver.startObserve();
    })
    .catch(() => {
      labeledLog('Fail to wait channel list item.');
      // Do nothing
    });
})();
