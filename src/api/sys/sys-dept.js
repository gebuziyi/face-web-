import { newClient } from '../axios-client-factory'

export const getSysDeptList = function() {
  return newClient().get('/sys/dept/list')
}

export const getSysDeptDetail = function(deptId) {
  return newClient().get('/sys/dept/info/' + deptId)
}

export const updateSysDept = function(model) {
  return newClient().post('/sys/dept/update', model)
}

export const deleteSysDept = function(id) {
  return newClient().post('/sys/dept/delete', 'deptId=' + id)
}

export const saveSysDept = function(model) {
  return newClient().post('/sys/dept/save', model)
}

export const getAllSysDeptForSelect = function() {
  return newClient().get('/sys/dept/select')
}
