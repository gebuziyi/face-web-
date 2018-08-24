import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'creator_time'
}

// 分页查询问答类型列表
export const getQaTypeList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeName: requireNonNull(query.typeName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

// 根据ID获取问答式类型详情
export const getQaTypeDetail = function(typeId) {
  return newClient().get('/qa/type/detail/' + typeId)
}

// 更新问答类型
export const updateQaType = function(model) {
  return newClient().post('/qa/type/update', model)
}

// 根据ID列表删除问答类型
export const removeQaType = function(ids) {
  return newClient().post('/qa/type/delete', [].concat(ids))
}

// 创建问答类型
export const createQaType = function(model) {
  return newClient().post('/qa/type/save', model)
}

export const getAllQaType = function() {
  return newClient().get('/qa/type/listall/lite')
}
