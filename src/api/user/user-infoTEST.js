import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  userId: 'user_id',
  fensiNum: 'fensi_num',
  charmValues: 'charm_values',
  balance: 'balance',
  regTime: 'user_id'
}

export const getUserInfoList = function ({ query, pager, sorter }) {
  let regTimeStart = null
  let regTimeEnd = null

  if (query.regTime !== null && typeof query.regTime !== 'undefined') {
    regTimeStart = query.regTime[0]
    regTimeEnd = query.regTime[1]
  }

  return newClient().get('/user/infoTEST/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      mobile: requireNonNull(query.mobile),
      email: requireNonNull(query.email),
      countryId: requireNonNull(query.countryId),
      sex: requireNonNull(query.sex),
      regTimeStart: requireNonNull(regTimeStart),
      regTimeEnd: requireNonNull(regTimeEnd),
      anchorNo: requireNonNull(query.anchorNo),
      isAnchor: requireNonNull(query.isAnchor),
      statues: requireNonNull(query.statues),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getUserInfoDetail = function (id) {
  return newClient().get('/user/infoTEST/detail/' + id)
}

export const deleteUserBatch = function (id) {
  return newClient().post('/user/infoTEST/delete', [].concat(id))
}

export const freezeUserBatch = function (id) {
  return newClient().post('/user/infoTEST/freeze', [].concat(id))
}

export const unfreezeUserBatch = function (id) {
  return newClient().post('/user/infoTEST/unfreeze', [].concat(id))
}

export const updateUserCountry = function (userId, model) {
  return newClient().post(`/user/infoTEST/${userId}/country`, model)
}
