import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  commentId: 'comment_id',
  likeNum: 'like_num',
  createTime: 'comment_id'
}

export const getVideoCommentList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/video/comment/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      statues: requireNonNull(query.statues),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const deleteVideoComment = function (id) {
  return newClient().post('/video/comment/delete', [].concat(id))
}

export const checkFailedComment = function (id) {
  return newClient().post('/video/comment/audit/failed', [].concat(id))
}
