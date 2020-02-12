import ChannelObserver from './slack/channel-observer';
import ChannelGrouper from './slack/channe-grouper';

((): void => {
  const channelObserver = new ChannelObserver();
  const channelGrouper = new ChannelGrouper();
  channelObserver.on('update', () => {
    channelGrouper.groupingAllByPrefixOnIdle();
  });
  channelObserver.start();
})();
