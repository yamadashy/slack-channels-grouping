import * as $ from 'jquery/dist/jquery.slim';
import {CHANNEL_LIST_ITEMS_SELECTOR} from './dom-constants';

export function alreadyAppliedExtension(): boolean {
  return $(CHANNEL_LIST_ITEMS_SELECTOR).find( 'span.scg').length > 0;
}
