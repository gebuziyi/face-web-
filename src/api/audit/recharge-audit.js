import { newClient } from '../axios-client-factory'

export const getRechargeUserConsumeRatioAuditData = function ({ pager }) {
  return newClient().get('/audit/recharge/line/consume-user-ratio', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
