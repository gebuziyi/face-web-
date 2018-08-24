import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  createTime: 'log_id'
}

export const getFreezelogList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/user/freeze-log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      user_id: requireNonNull(query.user_id),
      typeId: requireNonNull(query.typeId),
      userId: requireNonNull(query.userId),
      nick_name: requireNonNull(query.nick_name),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const getFreezeLogListByUserId = function (userId) {
  return newClient().get(`/user/freeze-log/${userId}`)
}
