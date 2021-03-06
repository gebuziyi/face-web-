import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  msgId: 'msg_id',
  msgCreateTime: 'msg_id'
}

export const getAssistantChatMsgPage = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/assistant/chat-msg/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      nickname: requireNonNull(query.nickname),
      userId: requireNonNull(query.userId),
      assistandId: requireNonNull(query.assistandId),
      ifAssiataneId: requireNonNull(query.ifAssiataneId),
      readByAdmin: requireNonNull(query.readByAdmin),
      msgType: requireNonNull(query.msgType),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAssistantChatMsgByH5Page = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/chat-msg/h5-list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAssistantChatMsgByMusicPage = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/chat-msg/music-list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAssistantChatMsgByVideoTopicPage = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/chat-msg/videoTopic-list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const getAssistantChatMsgByLiveRoomPage = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/chat-msg/LiveRoom-list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const getLittleAssistantChatMsgPage = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/chat-msg/Assistant-list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}
export const replyMsg = function (msg) {
  return newClient().post('/assistant/chat-msg/text', msg)
}

export const deleteMsg = function (msgIds) {
  return newClient().post('/assistant/chat-msg/delete', [].concat(msgIds))
}

export const getDetailList = function (msgId) {
  return newClient().get('/assistant/chat-msg/detailList/' + msgId)
}

export const getChatRecords = function (userId) {
  return newClient().get('/assistant/chat-msg/chatRecords/' + userId)
}
export const updateSysConfig = function(model) {
  return newClient().post('/assistant/chat-msg/update', model)
}

export const getAssistantId = function () {
  return newClient().get('/assistant/chat-msg/assistantId/')
}

export const doReadByAdmin = function (msgId) {
  return newClient().post(`/assistant/chat-msg/readMsg/${msgId}`)
}
