import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  replyId: 'reply_id',
  likeNum: 'like_nums',
  makeNum: 'make_num',
  createTime: 'create_time'
}

export const getQaReplyList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/reply/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      title: requireNonNull(query.title),
      username: requireNonNull(query.username),
      bestAnswer: requireNonNull(query.bestAnswer),
      awesome: requireNonNull(query.awesome),
      address: requireNonNull(query.address),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const updateCheckStatus = function(replyId) {
  return newClient().post('/qa/reply/detail/' + replyId + '/check')
}
