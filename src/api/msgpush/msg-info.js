import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  pushId: 'push_id',
  createTime: 'create_time'
}

export const getMsgLogList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/msgpush/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userNickName: requireNonNull(query.userNickName),
      typeId: requireNonNull(query.typeId),
      accountNickName: requireNonNull(query.accountNickName),
      content: requireNonNull(query.content),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
