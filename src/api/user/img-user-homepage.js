import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id',
  createTime: 'id'
}

export const getList = function ({ query, pager, sorter }) {
  return newClient().get('/user/img-user-homepage/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      nickName: requireNonNull(query.nickName),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const deletes = function (ids) {
  return newClient().post('/user/img-user-homepage/delete', [].concat(ids));
}
