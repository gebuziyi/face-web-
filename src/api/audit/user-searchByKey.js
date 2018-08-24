import { newClient } from '../axios-client-factory'

export const getUserSearchByKey = function ({ pager }) {
  return newClient().get('/audit/search-key/bar/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}
