import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  roleId: 'role_id',
  createTime: 'role_id'
}

export const getSysRoleList = function({query, pager, sorter}) {
  return newClient().get('/sys/role/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      name: requireNonNull(query.name),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysRoleDetail = function(roleId) {
  return newClient().get('/sys/role/info/' + roleId)
}

export const updateSysRole = function(model) {
  return newClient().post('/sys/role/update', model)
}

export const removeSysRole = function(ids) {
  return newClient().post('/sys/role/delete', [].concat(ids))
}

export const createSysRole = function(model) {
  return newClient().post('/sys/role/save', model)
}

export const getSysRoleListForSelect = function() {
  return newClient().get('/sys/role/select')
}
