import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  aproveId: 'approve_id',
  approveTime: 'approve_time',
  okTime: 'ok_time'
}

export const getUserApproveList = function ({ query, pager, sorter }) {
  let approveTimeStart = null
  let approveTimeEnd = null
  let okTimeStart = null
  let okTimeEnd = null

  if (query.approveTime !== null && typeof query.approveTime !== 'undefined') {
    approveTimeStart = query.approveTime[0]
    approveTimeEnd = query.approveTime[1]
  }
  if (query.okTime !== null && typeof query.okTime !== 'undefined') {
    okTimeStart = query.okTime[0]
    okTimeEnd = query.okTime[1]
  }

  return newClient().get('/user/approve/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      realName: requireNonNull(query.realName),
      cardId: requireNonNull(query.cardId),
      approveManUsername: requireNonNull(query.approveManUsername),
      isPast: requireNonNull(query.isPast),
      approveTimeStart: requireNonNull(approveTimeStart),
      approveTimeEnd: requireNonNull(approveTimeEnd),
      okTimeStart: requireNonNull(okTimeStart),
      okTimeEnd: requireNonNull(okTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const passUserApprove = function (msg) {
  return newClient().post('/user/approve/pass', msg)
}

export const denyUserApprove = function (msg) {
  return newClient().post(`/user/approve/deny`, msg)
}
