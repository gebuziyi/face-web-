import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  rewardId: 'reward_id',
  createTime: 'reward_id',
  price: 'price'
}

export const getQaRewardMoneyList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/reward-money/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      priceStart: requireNonNull(query.priceStart),
      priceEnd: requireNonNull(query.priceEnd),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getQaRewardMoneyDetail = function(rewardId) {
  return newClient().get('/qa/reward-money/detail/' + rewardId)
}

export const updateQaRewardMoney = function(model) {
  return newClient().post('/qa/reward-money/update', model)
}

export const removeQaRewardMoney = function(ids) {
  return newClient().post('/qa/reward-money/delete', [].concat(ids))
}

export const createQaRewardMoney = function(model) {
  return newClient().post('/qa/reward-money/save', model)
}
