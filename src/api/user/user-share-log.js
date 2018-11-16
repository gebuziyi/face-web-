import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  createTime: 'log_id'
}

export const getShareLogList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/user/share-log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      id: requireNonNull(query.id),
      userId: requireNonNull(query.userId),
      shareSource: requireNonNull(query.shareSource),
      platform: requireNonNull(query.platform),
      videoId: requireNonNull(query.videoId),
      liveId: requireNonNull(query.liveId),
      activityId: requireNonNull(query.activityId),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
