import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  infoId: 'info_id',
  numbers: 'numbers'
}

export const getUserGiftInfoList = function({query, pager, sorter}) {
  return newClient().get('/user/gift/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      giftId: requireNonNull(query.giftId),
      canSend: requireNonNull(query.canSend),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const updateUserGiftNumber = function(msg) {
  return newClient().post('/user/gift/update', msg)
}
