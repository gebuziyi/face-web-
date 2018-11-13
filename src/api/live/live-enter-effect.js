import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getList = function({ query, pager, sorter }) {
  return newClient().get('/live/enter-effect/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      name: requireNonNull(query.name),
      status: requireNonNull(query.status),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getDeletedList = function({ query, pager, sorter }) {
  return newClient().get('/live/enter-effect/list-deleted', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getDetail = function(id) {
  return newClient().get('/live/enter-effect/detail/' + id)
}

export const update = function(model) {
  return newClient().post('/live/enter-effect/update', model)
}

export const remove = function(id) {
  return newClient().post('/live/enter-effect/del', [].concat(id))
}

export const create = function(model) {
  return newClient().post('/live/enter-effect/save', model)
}
