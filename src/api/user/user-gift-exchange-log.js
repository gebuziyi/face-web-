import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  numbers: 'numbers',
  logTime: 'log_id'
}

export const getUserGiftExchangeLogList = function({query, pager, sorter}) {
  let logTimeStart = null
  let logTimeEnd = null

  if (query.logTime !== null && typeof query.logTime !== 'undefined') {
    logTimeStart = query.logTime[0]
    logTimeEnd = query.logTime[1]
  }

  return newClient().get('/user/gift/exchange-log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      giftId: requireNonNull(query.giftId),
      canSend: requireNonNull(query.canSend),
      logTimeStart: requireNonNull(logTimeStart),
      logTimeEnd: requireNonNull(logTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
