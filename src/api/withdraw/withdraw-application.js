import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  aid: 'aid',
  money: 'money',
  createTime: 'aid'
}

export const getWithdrawApplicationList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/withdraw/application/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      payType: requireNonNull(query.payType),
      check: requireNonNull(query.check),
      status: requireNonNull(query.status),
      userId: requireNonNull(query.userId),
      withdrawId: requireNonNull(query.withdrawId),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getWithdrawApplicationDetail = function(id) {
  return newClient().get('/withdraw/application/detail/' + id)
}

export const passApplication = function(aid) {
  return newClient().post(`/withdraw/application/${aid}/check/pass`)
}

export const denyApplication = function(msg) {
  return newClient().post(`/withdraw/application/${msg.aid}/check/deny`, msg)
}

export const transferSuccess = function(aid) {
  return newClient().post(`/withdraw/application/${aid}/transfer/success`)
}

export const transferFailed = function(msg) {
  return newClient().post(`/withdraw/application/${msg.aid}/transfer/failed`, msg)
}
