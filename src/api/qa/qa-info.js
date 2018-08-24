import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  infoId: 'info_id',
  likeNum: 'like_num',
  makeNum: 'make_num',
  replyNum: 'reply_num',
  createTime: 'create_time'
}

// 分页查询问答信息列表
export const getQaInfoList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeId: requireNonNull(query.typeId),
      title: requireNonNull(query.title),
      username: requireNonNull(query.username),
      amountType: requireNonNull(query.amountType),
      top: requireNonNull(query.top),
      countryName: requireNonNull(query.countryName),
      tyepName: requireNonNull(query.tyepName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

// 更新问答置顶配置
export const updateTopSetting = function(infoId) {
  return newClient().post('/qa/info/detail/' + infoId + '/top')
}

export const updateCheckStatus = function(infoId) {
  return newClient().post('/qa/info/detail/' + infoId + '/check')
}

export const getAllAmountType = function() {
  return newClient().get('/qa/info/amount-types')
}
