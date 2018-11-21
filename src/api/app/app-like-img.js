import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id'
}

export const getAppLikeImgList = function ({ query, pager, sorter }) {
  return newClient().get('/app/like/img/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      id: requireNonNull(query.id),
      name: requireNonNull(query.name),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllAppLikeImgNames = function () {
  return newClient().get('/app/like/img/names')
}

export const deleteAppLikeImg = function (id) {
  return newClient().post('/app/like/img/delete', [].concat(id))
}

export const createAppLikeImg = function(model) {
  return newClient().post('/app/like/img/save', model)
}

export const getAppLikeImgDetail = function (id) {
  return newClient().get('/app/like/img/detail/' + id)
}

export const editAppLikeImg = function (model) {
  return newClient().post(`/app/like/img/update`, model)
}
