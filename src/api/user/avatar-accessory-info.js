import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getList = function({ query, pager, sorter }) {
  return newClient().get('/user/avatar-accessory-info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      name: requireNonNull(query.name),
      isDeleted: requireNonNull(query.isDeleted),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const deleteGetList = function({ query, pager, sorter }) {
  return newClient().get('/user/avatar-accessory-info/list-delete', {
    params: {
      page: pager.page,
      limit: pager.limit,
      name: requireNonNull(query.name),
      isDeleted: requireNonNull(query.isDeleted),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getDetail = function(id) {
  return newClient().get('/user/avatar-accessory-info/detail/' + id)
}

export const update = function(model) {
  return newClient().post('/user/avatar-accessory-info/update', model)
}

export const remove = function(id) {
  return newClient().post('/user/avatar-accessory-info/del', [].concat(id))
}

export const create = function(model) {
  return newClient().post('/user/avatar-accessory-info/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllGiftType = function() {
  return newClient().get('/gift/type/listall')
}
