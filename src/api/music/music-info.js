import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  musicId: 'music_id',
  numbers: 'numbers',
  createTime: 'music_id'
}

export const getMusicInfoList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/music/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      mname: requireNonNull(query.mname),
      typeId: requireNonNull(query.typeId),
      singer: requireNonNull(query.singer),
      username: requireNonNull(query.username),
      fromUser: requireNonNull(query.fromUser),
      fromAdmin: requireNonNull(query.fromAdmin),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getMusicInfoDetail = function(id) {
  return newClient().get('/music/info/detail/' + id)
}

export const updateMusicInfo = function(model) {
  return newClient().post('/music/info/update', model)
}

export const removeMusicInfo = function(id) {
  return newClient().post('/music/info/delete', [].concat(id))
}

export const createMusicInfo = function(model) {
  return newClient().post('/music/info/save', model)
}

export const copyToType = function(msg) {
  return newClient().post('/music/info/copy', msg)
}

export const moveToType = function(msg) {
  return newClient().post('/music/info/move', msg)
}
