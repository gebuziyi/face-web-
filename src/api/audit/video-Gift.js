import { newClient } from '../axios-client-factory'

export const getVideoGift = function ({ pager }) {
  return newClient().get('/audit/video/bar/video-gift/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
