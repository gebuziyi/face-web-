import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  activityId: 'activity_id',
  createTime: 'activity_id',
  preferences: 'preferences'
}

export const getRechargeActivityList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/recharge/activity/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      activityName: requireNonNull(query.activityName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getRechargeActivityDetail = function(id) {
  return newClient().get('/recharge/activity/detail/' + id)
}

export const updateRechargeActivity = function(model) {
  return newClient().post('/recharge/activity/update', model)
}

export const disableRechargeActivity = function(ids) {
  return newClient().post('/recharge/activity/disable', [].concat(ids))
}

export const enableRechargeActivity = function(id) {
  return newClient().post('/recharge/activity/enable', id, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const createRechargeActivity = function(model) {
  return newClient().post('/recharge/activity/save', model)
}

export const getAllRechargeActivities = function() {
  return newClient().get('/recharge/activity/activityExpireIs1List')
}
