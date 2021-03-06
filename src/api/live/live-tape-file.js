import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getLiveTapeFileList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/live/tape-file/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      liveId: requireNonNull(query.liveId),
      status: requireNonNull(query.status),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const remove = function(fileId) {
  return newClient().post('/live/tape-file/del', [].concat(fileId))
}

export const Recommend = function(id) {
  return newClient().get('/live/tape-file/RecommendLive/' + id)
}

export const pull = function() {
  return newClient().get('/live/tape-file/pull/')
}

export const CloseRecommend = function(id) {
  return newClient().get('/live/tape-file/CloseRecommendLive/' + id)
}

export const getAll = function() {
  return newClient().get('/live/tape-file/withList')
}

export const update = function(sortedTypes) {
  return newClient().post('/live/tape-file/sort', sortedTypes)
}
