import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'

export const getHelloweenLiveLanternCount = function ({ query, pager }) {
  return newClient().get('/audit/hellow/live/lantern-count', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickName: requireNonNull(query.nickName),
      role: requireNonNull(query.role)
    }
  })
}

export const getHalloweenVideoActiveAuditData = function () {
  return newClient().get('/audit/halloween/video/data/audit')
}

export const getHalloweenLineDatas = function () {
  return newClient().get('/audit/halloween/video/line/regs-videos')
}

export const getVideoRankingList = function ({ query, pager }) {
  return newClient().get('/audit/VideoRankings/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId)
    }
  })
}

export const getGiftRankingList = function ({ query, pager }) {
  return newClient().get('/audit/UserGiftRanking/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId)
    }
  })
}
