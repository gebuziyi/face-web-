import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getGiftTypeList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/gift/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      gname: requireNonNull(query.gname),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getGiftTypeDetail = function(typeId) {
  return newClient().get('/gift/type/detail/' + typeId)
}

export const updateGiftType = function(model) {
  return newClient().post('/gift/type/update', model)
}

export const removeGiftType = function(id) {
  return newClient().post('/gift/type/delete', [].concat(id))
}

export const createGiftType = function(model) {
  return newClient().post('/gift/type/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllGiftType = function() {
  return newClient().get('/gift/type/listall')
}
