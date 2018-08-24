import { newClient } from '../axios-client-factory'

export const getvideoTypeCount = function ({ pager }) {
  return newClient().get('/audit/video-type/pie/video-count', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
