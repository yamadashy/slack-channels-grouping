import ChannelObserver from './content/channel-observer';
import ChannelGrouper from './content/channe-grouper';
import { alreadyAppliedExtension } from './content/apply-checker';

((): void => {
  if (alreadyAppliedExtension()) {
    return;
  }

  // Apply
  const channelObserver = new ChannelObserver();
  const channelGrouper = new ChannelGrouper();
  channelObserver.on('update', () => {
    channelGrouper.groupingAllByPrefixOnIdle();
  });
  channelObserver.start();
})();
