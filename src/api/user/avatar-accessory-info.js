import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getGiftTypeList = function({ query, pager, sorter }) {
  return newClient().get('/user/avatar-accessory/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      name: requireNonNull(query.name),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getGiftTypeDetail = function(id) {
  return newClient().get('/user/avatar-accessory/detail/' + id)
}

export const updateGiftType = function(model) {
  return newClient().post('/user/avatar-accessory/update', model)
}

export const removeGiftType = function(id) {
  return newClient().post('/user/avatar-accessory/del', [].concat(id))
}

export const createGiftType = function(model) {
  return newClient().post('/user/avatar-accessory/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllGiftType = function() {
  return newClient().get('/gift/type/listall')
}
