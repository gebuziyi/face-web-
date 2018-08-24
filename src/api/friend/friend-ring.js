import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  friendId: 'friend_id',
  likeNum: 'like_num',
  createTime: 'friend_id'
}

export const getFriendRingList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/friend/ring/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      type: requireNonNull(query.type),
      shield: requireNonNull(query.shield),
      checked: requireNonNull(query.checked),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const checkFailed = function(friendId) {
  return newClient().post(`/friend/ring/${friendId}/check/failed`)
}

export const removeFriendRing = function(ids) {
  return newClient().post(`/friend/ring/delete`, [].concat(ids))
}

export const getFileListByFriendId = function(friendId) {
  return newClient().get(`/friend/ring/${friendId}/files`)
}

export const getAllFriendRingType = function() {
  return newClient().get('/friend/ring/types')
}

export const getAllShieldType = function() {
  return newClient().get('/friend/ring/shield-types')
}
