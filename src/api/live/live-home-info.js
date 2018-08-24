import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  infoId: 'info_id',
  createTime: 'info_id'
}

export const getLiveHomeInfoList = function({ query, pager, sorter }) {
  return newClient().get('/live/home/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username),
      homeNo: requireNonNull(query.homeNo),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const closeCurrentLive = function(infoId) {
  return newClient().post(`/live/home/${infoId}/close`)
}

export const enableAnchorLive = function(infoId) {
  return newClient().post(`/live/home/${infoId}/enable`)
}

export const disableAnchorLive = function(infoId) {
  return newClient().post(`/live/home/${infoId}/disable`)
}
