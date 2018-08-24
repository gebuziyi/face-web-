import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  tagId: 'tag_id',
  createTime: 'tag_id'
}

export const getMakeFriendIntentionTagList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/user/friend-intention-tag/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      tagName: requireNonNull(query.tagName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getMakeFriendIntentionTagDetail = function (id) {
  return newClient().get(`/user/friend-intention-tag/detail/${id}`)
}

export const updateMakeFriendIntentionTag = function (model) {
  return newClient().post('/user/friend-intention-tag/update', model)
}

export const removeMakeFriendIntentionTag = function (ids) {
  return newClient().post('/user/friend-intention-tag/delete', [].concat(ids))
}

export const createMakeFriendIntentionTag = function (model) {
  return newClient().post('/user/friend-intention-tag/save', model)
}
