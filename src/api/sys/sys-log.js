import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id',
  createDate: 'id'
}

export const getSysLogList = function({ query, pager, sorter }) {
  return newClient().get('/sys/log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      operation: requireNonNull(query.operation),
      platform: requireNonNull(query.platform),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
