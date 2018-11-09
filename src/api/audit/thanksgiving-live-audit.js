import { newClient } from '../axios-client-factory';
import { requireNonNull } from '../../utils/coding-utils'

export const getLiveDatasThanksgivingDays = function() {
  return newClient().get('/thanksgiving/live/audit-data')
}

export const getThanksgivingLiveTableData = function ({ query, pager }) {
  return newClient().get('/thanksgiving/live/send-gift-table', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickName: requireNonNull(query.nickName),
      vest: requireNonNull(query.vest),
      role: requireNonNull(query.role)
    }
  })
}
