import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  topicId: 'topic_id',
  createTime: 'topic_id'
}

export const getVideoTopicList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/video/topic/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      tname: requireNonNull(query.tname),
      hot: requireNonNull(query.hot),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getVideoTopicDetail = function(typeId) {
  return newClient().get('/video/topic/detail/' + typeId)
}

export const updateVideoTopic = function(model) {
  return newClient().post('/video/topic/update', model)
}

export const removeVideoTopic = function(id) {
  return newClient().post('/video/topic/delete', [].concat(id))
}

export const createVideoTopic = function(model) {
  return newClient().post('/video/topic/save', model)
}

export const getTopicListByName = function(name) {
  return newClient().get('/video/topic/search', {
    params: {
      query: name
    }
  })
}

export const makeTopicHot = function(id) {
  return newClient().post(`/video/topic/${id}/hot/make`)
}

export const cancelTopicHot = function(id) {
  return newClient().post(`/video/topic/${id}/hot/cancel`)
}

export const getAllHotTopic = function() {
  return newClient().get('/video/topic/hot')
}

export const updateVideoTopicSort = function(payload) {
  return newClient().post('/video/topic/hot/sort', payload)
}
