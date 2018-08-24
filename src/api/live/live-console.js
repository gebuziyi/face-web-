import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  infoId: 'info_id',
  onlineNum: 'online_num',
  likeNum: 'like_num',
  giftNum: 'gift_num',
  startTime: 'info_id'
}

export const getLivingHomeList = function({ query, pager, sorter }) {
  return newClient().get('/live/console/homes', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      anchorNo: requireNonNull(query.anchorNo),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
