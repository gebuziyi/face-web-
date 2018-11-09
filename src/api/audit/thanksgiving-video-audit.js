import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  videoId: 'video_id',
  collectionNum: 'collection_num',
  commentNum: 'comment_num',
  shareNum: 'share_num',
  playNum: 'play_num'
}

export const getThanksgivingVideoTableData = function ({ query, pager, sorter }) {
  return newClient().get('/thanksgiving/video/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      distinct: requireNonNull(query.distinct),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getVideoDatasThanksgivingDays = function() {
  return newClient().get('/thanksgiving/video/list-videoData')
}

export const getThanksgivingVideoByDailyLineLine = function() {
  return newClient().get('/thanksgiving/video/videos-daily')
}
