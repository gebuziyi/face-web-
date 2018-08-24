import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getLiveTypeList = function({ query, pager, sorter }) {
  return newClient().get('/live/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeName: requireNonNull(query.typeName),
      username: requireNonNull(query.username),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getLiveTypeDetail = function(typeId) {
  return newClient().get('/live/type/detail/' + typeId)
}

export const updateLiveType = function(model) {
  return newClient().post('/live/type/update', model)
}

export const removeLiveType = function(id) {
  return newClient().post('/live/type/delete', [].concat(id))
}

export const createLiveType = function(model) {
  return newClient().post('/live/type/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllLiveType = function() {
  return newClient().get('/live/type/listall/lite')
}
