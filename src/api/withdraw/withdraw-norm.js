import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  withdrawId: 'withdraw_id',
  createTime: 'withdraw_id',
  f: 'f',
  price: 'price'
}

export const getWithdrawNormList = function ({ query, pager, sorter }) {
  return newClient().get('/withdraw/norm/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      currency: requireNonNull(query.currency),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getWithdrawNormDetail = function (id) {
  return newClient().get('/withdraw/norm/detail/' + id)
}

export const updateWithdrawNorm = function (model) {
  return newClient().post('/withdraw/norm/update', model)
}

export const createWithdrawNorm = function (model) {
  return newClient().post('/withdraw/norm/save', model)
}

export const getAllWithdrawNorm = function () {
  return newClient().get('/withdraw/norm/all')
}
