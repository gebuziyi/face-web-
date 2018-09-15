import { newClient } from '../axios-client-factory'

export const doVideoRedisRepair = function() {
  return newClient().post('/video/info/admin/repairVideos')
}

export const dovestAccountRedisRepair = function() {
  return newClient().post('/sys/vest/admin/repairVest')
}
