import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id'
}

export const getSysConfigList = function({query, pager, sorter}) {
  return newClient().get('/sys/sys-set/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sname: requireNonNull(query.sname),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysConfigDetail = function(setId) {
  return newClient().post('/sys/sys-set/info/' + setId)
}

export const updateSysConfig = function(model) {
  return newClient().post('/sys/sys-set/update', model)
}

export const removeSysConfig = function(ids) {
  return newClient().post('/sys/config/delete', [].concat(ids))
}

export const createSysConfig = function(model) {
  return newClient().post('/sys/sys-set/save', model)
}