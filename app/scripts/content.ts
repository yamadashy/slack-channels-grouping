import ChannelObserver from './slack/channel-observer';
import ChannelGrouper from './slack/channe-grouper';
import { BODY_EXTENSION_APPLIED_FLAG } from './slack/dom-constants';

((): void => {
  // Check applied
  const alreadyApplied = document.body.getAttribute(BODY_EXTENSION_APPLIED_FLAG) === '1';

  if (alreadyApplied) {
    return;
  }

  document.body.setAttribute(BODY_EXTENSION_APPLIED_FLAG, '1');

  // Apply
  const channelObserver = new ChannelObserver();
  const channelGrouper = new ChannelGrouper();
  channelObserver.on('update', () => {
    channelGrouper.groupingAllByPrefixOnIdle();
  });
  channelObserver.start();
})();
