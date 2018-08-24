import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id'
}

export const getSysConfigList = function({query, pager, sorter}) {
  return newClient().get('/sys/config/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      key: requireNonNull(query.key),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysConfigDetail = function(id) {
  return newClient().get('/sys/config/info/' + id)
}

export const updateSysConfig = function(model) {
  return newClient().post('/sys/config/update', model)
}

export const removeSysConfig = function(ids) {
  return newClient().post('/sys/config/delete', [].concat(ids))
}

export const createSysConfig = function(model) {
  return newClient().post('/sys/config/save', model)
}
