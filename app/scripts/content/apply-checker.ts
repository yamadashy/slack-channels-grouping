import * as $ from 'jquery/dist/jquery.slim';
import { SELECTOR_CHANNEL_LIST_ITEMS } from './dom-constants';

export function alreadyAppliedExtension(): boolean {
  return $(SELECTOR_CHANNEL_LIST_ITEMS).find('span.scg').length > 0;
}
