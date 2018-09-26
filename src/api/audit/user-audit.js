import { newClient } from '../axios-client-factory'

export const getUserCountInCountryAuditData = function ({ pager }) {
  return newClient().get('/audit/user/bar/user-count/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
export const getUserRechargeTypeAuditPieData = function () {
  return newClient().get('/audit/user/pie/user-count/regist-type')
}
