import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  msgId: 'msg_id',
  msgCreateTime: 'msg_id'
}

export const getAppSplashScreenList = function ({ query, pager, sorter }) {
  return newClient().get('/app/splash/screen/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      type: requireNonNull(query.type),
      isDeleted: requireNonNull(query.isDeleted),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const deleteAppSplashScreen = function (id) {
  return newClient().post('/app/splash/screen/delete', [].concat(id))
}

export const createAppSplashScreen = function(model) {
  return newClient().post('/app/splash/screen/save', model)
}

export const getAppSplashScreenDertail = function (id) {
  return newClient().get('/app/splash/screen/detail/' + id)
}

export const updateAppSplashScreen = function (model) {
  return newClient().post(`/app/splash/screen/update`, model)
}

export const checkEnableTime = function(model) {
  return newClient().post('/app/splash/screen/check', model)
}
