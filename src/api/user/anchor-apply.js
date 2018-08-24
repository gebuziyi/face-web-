import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  anchorId: 'anchor_id',
  createTime: 'create_time',
  checkTime: 'check_time'
}

export const getAnchorApplyList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  let checkTimeStart = null
  let checkTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.regTime[0]
    createTimeEnd = query.regTime[1]
  }
  if (query.checkTime !== null && typeof query.checkTime !== 'undefined') {
    checkTimeStart = query.regTime[0]
    checkTimeEnd = query.regTime[1]
  }

  return newClient().get('/user/anchor-apply/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      realName: requireNonNull(query.realName),
      checkName: requireNonNull(query.checkName),
      checkType: requireNonNull(query.checkType),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      checkTimeStart: requireNonNull(checkTimeStart),
      checkTimeEnd: requireNonNull(checkTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const passAnchorApply = function (msg) {
  return newClient().post('/user/anchor-apply/pass', msg)
}

export const denyAnchorApply = function (msg) {
  return newClient().post('/user/anchor-apply/deny', msg)
}
