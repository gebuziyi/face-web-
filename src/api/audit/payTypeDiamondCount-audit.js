import { newClient } from '../axios-client-factory'

export const getPayTypeDiamondCountAuditData = function ({ pager }) {
  return newClient().get('/audit/pay-type/pie/diamond-count', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
