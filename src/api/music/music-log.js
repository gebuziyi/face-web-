import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  createTime: 'log_id'
}

export const getMusiclogList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/music/log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      user_id: requireNonNull(query.user_id),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const getMusicLogDetail = function (userId) {
  return newClient().get('/music/log/detail/' + userId)
}
