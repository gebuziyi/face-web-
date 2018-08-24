import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  withdrawId: 'withdraw_id',
  createTime: 'withdraw_id',
  price: 'price'
}

export const getWithdrawLogList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/withdraw/log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      moneyStart: requireNonNull(query.moneyStart),
      moneyEnd: requireNonNull(query.moneyEnd),
      status: requireNonNull(query.status),
      payType: requireNonNull(query.payType),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllWithdrawStatus = function() {
  return newClient().get('/withdraw/log/status/list')
}
