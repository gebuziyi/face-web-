import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getVideoTypeList = function({ query, pager, sorter }) {
  return newClient().get('/video/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      tname: requireNonNull(query.tname),
      username: requireNonNull(query.username),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getVideoTypeDetail = function(typeId) {
  return newClient().get('/video/type/detail/' + typeId)
}

export const updateVideoType = function(model) {
  return newClient().post('/video/type/update', model)
}

export const removeVideoType = function(id) {
  return newClient().post('/video/type/delete', [].concat(id))
}

export const createVideoType = function(model) {
  return newClient().post('/video/type/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllVideoType = function() {
  return newClient().get('/video/type/listall/lite')
}
