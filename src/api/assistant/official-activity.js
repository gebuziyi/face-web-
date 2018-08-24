import { newClient } from '../axios-client-factory'

export const sendUrlMsg = function (model) {
  return newClient().post('/assistant/chat-msg/sendUrlMsg', model)
}

export const sendMusicMsg = function (model) {
  return newClient().post('/assistant/chat-msg/sendMusicMsg', model)
}

export const sendVideoTopicMsg = function (model) {
  return newClient().post('/assistant/chat-msg/sendVideoTopicMsg', model)
}

export const sendLiveMsg = function (model) {
  return newClient().post('/assistant/chat-msg/sendLiveMsg', model)
}
