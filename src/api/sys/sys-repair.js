import { newClient } from '../axios-client-factory'

export const doVideoRedisRepair = function() {
  return newClient().post('/video/info/admin/repairVideos')
}

export const dovestAccountRedisRepair = function() {
  return newClient().post('/sys/vest/admin/repairVest')
}
export const createNewWords = function(model) {
  return newClient().post('/sys/vest/listDirtyWords/save', model)
}
export const postDirtyWords = function() {
  return newClient().post('/sys/vest/admin/listDirtyWords')
}
export const removeSysConfig = function(DirtyWordsList) {
  return newClient().post('/sys/vest/listDirtyWords/del', [].concat(DirtyWordsList))
}
