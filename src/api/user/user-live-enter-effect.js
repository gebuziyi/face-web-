import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id',
  createTime: 'id'
}

export const getUserLiveEnterEffectList = function ({ query, pager, sorter }) {
  return newClient().get('/user/live-enter-effect/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      effectId: requireNonNull(query.effectId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const createUserLiveEnterEffect = function (payload) {
  return newClient().post('/user/live-enter-effect/create', payload);
}

export const getAllEffects = function () {
  return newClient().get('/live/enter-effect/getUndeletedAll');
}

export const deleteUserLiveEnterEffect = function (ids) {
  return newClient().post('/user/live-enter-effect/delete', [].concat(ids));
}
