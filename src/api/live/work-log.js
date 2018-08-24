import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  workDate: 'log_id',
  totalDuration: 'total_duation'
}

export const getWorkLogList = function({ query, pager, sorter }) {
  let workDateStart = null
  let workDateEnd = null

  if (query.workDate !== null && typeof query.workDate !== 'undefined') {
    workDateStart = query.workDate[0]
    workDateEnd = query.workDate[1]
  }

  return newClient().get('/live/work-log/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      homeNo: requireNonNull(query.homeNo),
      done: requireNonNull(query.done),
      workDateStart: requireNonNull(workDateStart),
      workDateEnd: requireNonNull(workDateEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getLiveInfoListByLogId = function(logId) {
  return newClient().get(`/live/work-log/${logId}/infos`)
}
