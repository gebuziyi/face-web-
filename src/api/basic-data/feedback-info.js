import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  feedblackId: 'feedblack_id',
  createTime: 'feedblack_id'
}

export const getFeedbackInfoList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/feedback/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      content: requireNonNull(query.content),
      isProcess: requireNonNull(query.isProcess),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const processFeedback = function(model) {
  return newClient().post('/feedback/info/detail/process', model)
}

export const getDetail = function(feedblackId) {
  return newClient().get('/feedback/info/detail/' + feedblackId)
}

export const deleteFeedback = function(ids) {
  return newClient().post('/feedback/info/delete', [].concat(ids))
}
