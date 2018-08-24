import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  tagsId: 'tags_id',
  createTime: 'tags_id'
}

export const getEmotionInfoTagsList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/user/emotion-tags/list', {
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

export const getEmotionInfoTagsDetail = function (id) {
  return newClient().get(`/user/emotion-tags/detail/${id}`)
}

export const updateEmotionInfoTags = function (model) {
  return newClient().post('/user/emotion-tags/update', model)
}

export const removeEmotionInfoTags = function (ids) {
  return newClient().post('/user/emotion-tags/delete', [].concat(ids))
}

export const createEmotionInfoTags = function (model) {
  return newClient().post('/user/emotion-tags/save', model)
}
