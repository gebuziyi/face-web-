import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  keyId: 'key_id',
  // 按点赞时间排序=按主键ID排序
  createTime: 'key_id'
}

export const getSearchKeyList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/search/key/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      keyValue: requireNonNull(query.keyValue),
      username: requireNonNull(query.username),
      searchType: requireNonNull(query.searchType),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllSearchType = function() {
  return newClient().get('/search/key/search-types')
}

export const deleteSearchKey = function(ids) {
  return newClient().post('/search/key/delete', [].concat(ids))
}
