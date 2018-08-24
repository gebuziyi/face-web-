import { newClient } from '../axios-client-factory'

export const getJobInfoTreeData = function() {
  return newClient().get('/job/info/tree')
}

export const getJobInfoDetail = function(id) {
  return newClient().get('/job/info/detail/' + id)
}

export const updateJobInfo = function(model) {
  return newClient().post('/job/info/update', model)
}

export const deleteJobInfo = function(ids) {
  return newClient().post('/job/info/delete', [].concat(ids))
}

export const saveJobInfo = function(model) {
  return newClient().post('/job/info/save', model)
}
