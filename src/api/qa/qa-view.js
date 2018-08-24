import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  likeId: 'view_id',
  // 按查看时间排序=按主键ID排序
  createTime: 'view_id'
}

export const getQaViewList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/view/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      title: requireNonNull(query.title),
      username: requireNonNull(query.username),
      hasNewAnswer: requireNonNull(query.hasNewAnswer),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
