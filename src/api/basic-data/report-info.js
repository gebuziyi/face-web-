import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  reportId: 'report_id',
  createTime: 'type_id'
}

export const getReportInfoList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/report/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      accountUserId: requireNonNull(query.accountUserId),
      typeId: requireNonNull(query.typeId),
      reportType: requireNonNull(query.reportType),
      processed: requireNonNull(query.processed),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const getAllReportInfoType = function() {
  return newClient().get('/report/info/types')
}
export const getReportInfoDetail = function(id) {
  return newClient().get('/report/info/detail/' + id)
}
export const createReportInfo = function(model) {
  return newClient().post('/report/info/save', model)
}
export const updateReportInfo = function(model) {
  return newClient().post('/report/info/update', model)
}
export const deleteReportInfo = function(ids) {
  return newClient().post('/report/info/delete', [].concat(ids))
}
export const getUserReportDetail = function(infoId) {
  return newClient().get('/report/info/detailPersonal/' + infoId)
}
export const getVideoReportDetail = function(infoId) {
  return newClient().get('/report/info/detailvideo/' + infoId)
}
export const getVideoCommentdetail = function(infoId) {
  return newClient().get('/report/info/detailVideoComment/' + infoId)
}
export const getFriendRingCommentdetail = function(infoId) {
  return newClient().get('/report/info/detailFriendRingComment/' + infoId)
}
export const getFriendRingdetail = function(infoId) {
  return newClient().get('/report/info/detailFriendRing/' + infoId)
}
export const getdisableDetail = function(videoId) {
  return newClient().post('/report/info/disable/' + videoId)
}
export const getdeleteVideoDetail = function(videoId) {
  return newClient().post('/report/info/deleteVideo/' + videoId)
}
