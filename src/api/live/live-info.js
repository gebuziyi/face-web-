import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  liveId: 'live_id',
  infoId: 'info_id',
  onlineNum: 'online_num',
  likeNum: 'like_num',
  giftNum: 'gift_num',
  startTime: 'info_id',
  durationInMinutes: 'duration_in_minutes'
}

export const getLiveInfoList = function({ query, pager, sorter }) {
  let openTimeStart = null
  let openTimeEnd = null

  if (query.openTime !== null && typeof query.openTime !== 'undefined') {
    openTimeStart = query.openTime[0]
    openTimeEnd = query.openTime[1]
  }

  return newClient().get('/live/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      valid: requireNonNull(query.valid),
      liveId: requireNonNull(query.liveId),
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      isLive: requireNonNull(query.isLive),
      openTimeStart: requireNonNull(openTimeStart),
      openTimeEnd: requireNonNull(openTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
