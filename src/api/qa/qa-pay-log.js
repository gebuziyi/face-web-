import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  price: 'price',
  // 按点赞时间排序=按主键ID排序
  createTime: 'log_id'
}

export const getQaPayLogList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/pay/log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      title: requireNonNull(query.title),
      username: requireNonNull(query.username),
      accountUsername: requireNonNull(query.accountUsername),
      priceStart: requireNonNull(query.priceStart),
      priceEnd: requireNonNull(query.priceEnd),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
