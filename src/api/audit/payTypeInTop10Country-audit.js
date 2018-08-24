import { newClient } from '../axios-client-factory'

export const getPayTypeInTop10CountryAuditData = function ({ pager }) {
  return newClient().get('/audit/pay-type/bar/top10-country', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
