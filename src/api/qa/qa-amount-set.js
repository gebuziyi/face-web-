import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  setId: 'set_id',
  price: 'price',
  days: 'days'
}

export const getQaAmountSetList = function({query, pager, sorter}) {
  return newClient().get('/qa/amount-sets/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
