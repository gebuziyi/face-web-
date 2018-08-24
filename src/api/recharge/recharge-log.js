import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  rechargeId: 'recharge_id',
  createTime: 'recharge_id',
  money: 'money',
  price: 'price'
}

export const getRechargeLogList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/recharge/log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      orderNo: requireNonNull(query.orderNo),
      moneyStart: requireNonNull(query.moneyStart),
      moneyEnd: requireNonNull(query.moneyEnd),
      status: requireNonNull(query.status),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllOrderStatus = function() {
  return newClient().get('/recharge/log/status/list')
}
