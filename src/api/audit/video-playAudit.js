import { newClient } from '../axios-client-factory'

export const getvideoPlayAudit = function ({ pager }) {
  return newClient().get('/audit/video/bar/video-play/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
