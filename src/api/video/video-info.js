import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  videoId: 'video_id',
  collectionNum: 'collection_num',
  createTime: 'video_id',
  commentNum: 'comment_num',
  shareNum: 'share_num',
  heatNum: 'heat_num',
  playNum: 'play_num'
}

export const getVideoInfoList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/video/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      videoId: requireNonNull(query.videoId),
      topicId: requireNonNull(query.topicId),
      typeId: requireNonNull(query.typeId),
      musicId: requireNonNull(query.musicId),
      userId: requireNonNull(query.userId),
      nickname: requireNonNull(query.nickname),
      username: requireNonNull(query.username),
      country: requireNonNull(query.country),
      vname: requireNonNull(query.vname),
      statues: requireNonNull(query.statues),
      isPrivate: requireNonNull(query.isPrivate),
      source: requireNonNull(query.source),
      hot: requireNonNull(query.hot),
      featured: requireNonNull(query.featured),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sysUserId: requireNonNull(query.sysUserId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getVideoInfoDetail = function (id) {
  return newClient().get('/video/info/detail/' + id)
}

export const deleteVideoInfo = function (id) {
  return newClient().post('/video/info/delete', [].concat(id))
}

export const DoCancelHotConfirm = function (id) {
  return newClient().post('/video/info/cancel/hot/videos', [].concat(id))
}
export const freezeVideoInfo = function (id) {
  return newClient().post('/video/info/freeze', [].concat(id))
}

export const unfreezeVideoInfo = function (id) {
  return newClient().post('/video/info/unfreeze', [].concat(id))
}

export const getAllVideoStatus = function () {
  return newClient().get('/video/info/status/list')
}

export const getAllVideoPrivacyStatus = function () {
  return newClient().get('/video/info/privacy-status/list')
}

export const getAllVideoSource = function () {
  return newClient().get('/video/info/source/list')
}

export const makeVideoHot = function (id) {
  return newClient().post(`/video/info/${id}/hot/make`)
}

export const cancelVideoHot = function (id) {
  return newClient().post(`/video/info/${id}/hot/cancel`)
}

export const makeVideoFeatured = function (id) {
  return newClient().post(`/video/info/featured/make`, [].concat(id))
}

export const cancelVideoFeatured = function (id) {
  return newClient().post(`/video/info/featured/cancel`, [].concat(id))
}

export const updateVideoInfo = function (model) {
  return newClient().post(`/video/info/update`, model)
}

export const createVideoInfo = function (model, uploadProgressCb) {
  return newClient().post(`/video/info/save`, model, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // 为了防止视频文件太大服务器处理时间长的导致超时, 这里将超时时间设置为10分钟
    timeout: 10 * 60 * 1000,
    onUploadProgress: uploadProgressCb
  })
}

export const testUploadVideoInfo = function (uploadProgressCb) {
  return newClient().post({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // 为了防止视频文件太大服务器处理时间长的导致超时, 这里将超时时间设置为10分钟
    timeout: 10 * 60 * 1000,
    onUploadProgress: uploadProgressCb
  })
}

export const addTopics = function (videoId, topicIds) {
  return newClient().post(`/video/info/${videoId}/topics`, topicIds)
}

export const removeVideoTopic = function (videoId, topicId) {
  return newClient().post(`/video/info/${videoId}/topicsDelete`, topicId, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
