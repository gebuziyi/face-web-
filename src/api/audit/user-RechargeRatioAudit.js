import { newClient } from '../axios-client-factory'

export const getuserRechargeRatioAudit = function ({ pager }) {
  return newClient().get('/audit/user/pie/recharge-ratio', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
