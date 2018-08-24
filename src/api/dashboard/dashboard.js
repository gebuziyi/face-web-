import { newClient } from '../axios-client-factory';

export const countTotalUser = function() {
  return newClient().get('/dashboardController/countTotalUser')
}

export const queryAnchorCount = function() {
  return newClient().get('/dashboardController/queryAnchorCount')
}

export const countTotalDiamond = function() {
  return newClient().get('/dashboardController/countTotalDiamond')
}

export const countTotalVideo = function() {
  return newClient().get('/dashboardController/countTotalVideo')
}

export const getNewRegisteredUserInTop10 = function() {
  return newClient().get('/dashboardController/getNewRegisteredUserInTop10')
}

export const getVideoCollectionNumMaxInTop10 = function() {
  return newClient().get('/dashboardController/getVideoCollectionNumMaxInTop10')
}
export const getLiveOnlineNumMaxInTop10 = function() {
  return newClient().get('/dashboardController/getLiveOnlineNumMaxInTop10')
}

export const getNewRechargeOrderInTop10 = function() {
  return newClient().get('/dashboardController/getNewRechargeOrderInTop10')
}

export const getDataCountByWeek = function() {
  return newClient().get('/dashboardController/getDataCountByWeek')
}
