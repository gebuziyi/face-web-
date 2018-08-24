import { newClient } from '../axios-client-factory'

export const getVideoTypePlayCountAuditData = function ({ pager }) {
  return newClient().get('/audit/video-type/pie/play-count', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
