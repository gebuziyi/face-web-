import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'id'
}

export const getAppActivityList = function ({ query, pager, sorter }) {
  return newClient().get('/app/activity/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      type: requireNonNull(query.type),
      name: requireNonNull(query.name),
      isDeleted: requireNonNull(query.isDeleted),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllActivityNames = function () {
  return newClient().get('/app/activity/info/activity/names')
}

export const deleteAppActivity = function (id) {
  return newClient().post('/app//activity/info/delete', [].concat(id))
}

export const createAppActivity = function(model) {
  return newClient().post('/app/activity/info/save', model)
}

export const getAppActivityDetail = function (id) {
  return newClient().get('/app/activity/info/detail/' + id)
}

export const editAppActivity = function (model) {
  return newClient().post(`/app/activity/info/update`, model)
}
