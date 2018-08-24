import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  sendId: 'send_id',
  price: 'price',
  numbers: 'numbers',
  createTime: 'send_id'
}

export const getVideoGiftSendList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/video/gift/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      videoId: requireNonNull(query.videoId),
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      giftIds: requireNonNull(query.giftIds) ? query.giftIds.join(',') : null,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
