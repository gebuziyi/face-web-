import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  orderId: 'order_id',
  price: 'price',
  createTime: 'order_id'
}

export const getRechargeOrderList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/recharge/order/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      orderNo: requireNonNull(query.orderNo),
      typeId: requireNonNull(query.typeId),
      rechargeId: requireNonNull(query.rechargeId),
      status: requireNonNull(query.status),
      payStatus: requireNonNull(query.payStatus),
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      priceStart: requireNonNull(query.priceStart),
      priceEnd: requireNonNull(query.priceEnd),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getRechargeOrderDetail = function(id) {
  return newClient().get('/recharge/order/detail/' + id)
}

export const updateRechargeOrder = function(model) {
  return newClient().post('/recharge/order/update', model)
}

export const getAllOrderStatus = function() {
  return newClient().get('/recharge/order/status/list')
}

export const getAllPayStatus = function() {
  return newClient().get('/recharge/order/paystatus/list')
}
