import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id',
  createTime: 'id'
}

export const getUserAvatarAccessoryList = function ({ query, pager, sorter }) {
  return newClient().get('/user/accessory/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      accessoryId: requireNonNull(query.accessoryId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const createUserAvatarAccessory = function (payload) {
  return newClient().post('/user/accessory/create', payload);
}

export const getAllAccessories = function () {
  return newClient().get('/user/avatar-accessory-info/getUndeletedAll');
}
