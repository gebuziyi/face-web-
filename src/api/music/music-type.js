import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id',
  editorTime: 'editor_time',
  sort: 'sort'
}

export const getMusicTypeList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/music/type/list', {
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

export const getMusicTypeDetail = function(typeId) {
  return newClient().get('/music/type/detail/' + typeId)
}

export const updateMusicType = function(model) {
  return newClient().post('/music/type/update', model)
}

export const removeMusicType = function(id) {
  return newClient().post('/music/type/delete', [].concat(id))
}

export const createMusicType = function(model) {
  return newClient().post('/music/type/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getAllMusicTypeLite = function() {
  return newClient().get('/music/type/all/lite')
}

export const getAllMusicType = function() {
  return newClient().get('/music/type/all')
}

export const updateMusicTypeSort = function(sortedTypes) {
  return newClient().post('/music/type/sort/update', sortedTypes)
}
