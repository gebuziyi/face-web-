import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  rechargeId: 'recharge_id',
  createTime: 'recharge_id',
  number: 'number',
  priceChina: 'price_china',
  priceAmerica: 'price_america'
}

export const getRechargeNormList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/recharge/norm/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sign: requireNonNull(query.sign),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getRechargeNormDetail = function(id) {
  return newClient().get('/recharge/norm/detail/' + id)
}

export const updateRechargeNorm = function(model) {
  return newClient().post('/recharge/norm/update', model)
}

export const removeRechargeNorm = function(ids) {
  return newClient().post('/recharge/norm/delete', [].concat(ids))
}

export const createRechargeNorm = function(model) {
  return newClient().post('/recharge/norm/save', model)
}

export const getAllRechargeNorm = function() {
  return newClient().get('/recharge/norm/listall/lite')
}

export const cancelActivity = function (id) {
  return newClient().post('/recharge/norm/cancelRechargeActivity', id, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
