import { newClient } from '../axios-client-factory'

export const getPayTypeUserCountAuditData = function ({ pager }) {
  return newClient().get('/audit/pay-type/pie/user-count', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
