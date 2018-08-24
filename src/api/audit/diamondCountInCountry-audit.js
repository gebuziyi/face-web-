import { newClient } from '../axios-client-factory'

export const getDiamondCountInCountryAuditData = function ({ pager }) {
  return newClient().get('/audit/recharge/pie/diamond-count-in-country', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
