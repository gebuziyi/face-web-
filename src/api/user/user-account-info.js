import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  detailId: 'detail_id',
  diamond: 'diamond',
  f: 'f',
  liveIncome: 'live_income',
  videoIncome: 'video_income',
  matchingIncome: 'matching_income'
}

export const getUserAccountInfoList = function({query, pager, sorter}) {
  return newClient().get('/user/account-info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const updateUserDiamond = function(msg) {
  return newClient().post('/user/account-info/diamond/update', msg)
}
