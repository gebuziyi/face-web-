import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  setId: 'setId'
}

export const getSysConfigList = function({query, pager, sorter}) {
  return newClient().get('/sys/sys-set/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sname: requireNonNull(query.sname),
      del: requireNonNull(query.del),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysSetDetail = function(setId) {
  return newClient().get('/sys/sys-set/info/' + setId)
}

export const updateSysConfig = function(model) {
  return newClient().post('/sys/sys-set/update', model)
}

export const removeSysConfig = function(ids) {
  return newClient().post('/sys/sys-set/delete', [].concat(ids))
}

export const createSysConfig = function(model) {
  return newClient().post('/sys/sys-set/save', model)
}
