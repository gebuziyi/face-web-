import { newClient } from '../axios-client-factory'

export const getAvgRechargeAudit = function ({ pager }) {
  return newClient().get('/audit/recharge/line/avg-price', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
