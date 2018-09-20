import { newClient } from '../axios-client-factory'

export const searchMusicListByName = function(name) {
  return newClient().get('/fuzzy/entity/music/name', {
    params: {
      query: name
    }
  })
}

export const searchVideoTopicListByName = function(name) {
  return newClient().get('/fuzzy/entity/video-topic/name', {
    params: {
      query: name
    }
  })
}

export const searchMusicNameList = function(name) {
  return newClient().get('/fuzzy/str/music/name', {
    params: {
      query: name
    }
  })
}

export const searchSingerList = function(name) {
  return newClient().get('/fuzzy/str/music/singer', {
    params: {
      query: name
    }
  })
}

export const searchLittleAssistantnotificationsByName = function(name) {
  return newClient().get('/fuzzy/entity/video-topic/name', {
    params: {
      query: name
    }
  })
}