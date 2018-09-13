import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id',
  createTime: 'id'
}

export const getSysUserVestList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/sys/vest/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      countryId: requireNonNull(query.countryId),
      username: requireNonNull(query.username),
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      adminUsername: requireNonNull(query.adminUsername),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysUserVestDetail = function (vestId) {
  return newClient().get(`/sys/vest/detail/${vestId}`)
}

export const updateSysUserVest = function (model) {
  return newClient().post('/sys/vest/update', model)
}

export const createSysUserVest = function (model) {
  return newClient().post('/sys/vest/save', model)
}

export const deleteSysUserVest = function (ids) {
  return newClient().post('/sys/vest/delete', [].concat(ids))
}

export const getAllLoginAdminVest = function (userId) {
  return newClient().get(`/sys/vest/admin/${userId}`)
}
