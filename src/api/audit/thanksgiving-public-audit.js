import { newClient } from '../axios-client-factory';

export const getThanksgivingRegisterByDailyLineLine = function() {
  return newClient().get('/thanksgiving/public/register-daily')
}

export const getAllPublicTotalByThanksgivingDays = function() {
  return newClient().get('/thanksgiving/public/all-register')
}

export const getRechargeDataByThanksgivingLine = function() {
  return newClient().get('/thanksgiving/public/recharge-data')
}
