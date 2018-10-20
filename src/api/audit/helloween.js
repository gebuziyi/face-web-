import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'

export const getHelloweenLiveLanternCount = function ({ query, pager }) {
  return newClient().get('/audit/hellow/live/lantern-count', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickName: requireNonNull(query.nickName),
      role: requireNonNull(query.role)
    }
  })
}
