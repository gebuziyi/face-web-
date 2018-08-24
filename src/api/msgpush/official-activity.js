import { newClient } from '../axios-client-factory'

export const publishOfficialActivity = function(model) {
  return newClient().post('/msgpush/activity')
}
