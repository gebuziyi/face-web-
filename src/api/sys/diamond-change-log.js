import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id'
}

export const getdiamondChangeLogList = function({query, pager, sorter}) {
  return newClient().get('/user/account-info/DiamondChangeLog', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      adminId: requireNonNull(query.adminId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
