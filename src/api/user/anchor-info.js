import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  userId: 'user_id',
  fensiNum: 'fensi_num',
  charmValues: 'charm_values'
}

export const getAnchorInfoList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/user/info/anchor/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      mobile: requireNonNull(query.mobile),
      email: requireNonNull(query.email),
      sex: requireNonNull(query.sex),
      contract: requireNonNull(query.contract),
      country: requireNonNull(query.country),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const updateAnchorTagSet = function (model) {
  return newClient().post(`/user/info/anchor/${model.userId}/tags`, model)
}

export const setAnchorContract = function(userId) {
  return newClient().post(`/user/info/anchor/${userId}/contract/set`)
}

export const cancelAnchorContract = function(userId) {
  return newClient().post(`/user/info/anchor/${userId}/contract/cancel`)
}
