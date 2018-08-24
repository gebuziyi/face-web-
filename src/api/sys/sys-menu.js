import {newClient} from '../axios-client-factory'

export const getSysMenu = function() {
  return newClient().get('/sys/menu/nav')
}

export const getSysMenuList = function() {
  return newClient().get('/sys/menu/list')
}

export const saveSysMenu = function(model) {
  return newClient().post('/sys/menu/save', model)
}

export const deleteSysMenu = function(menuId) {
  return newClient().post('/sys/menu/delete', 'menuId=' + menuId)
}

export const getSysMenuDetail = function(menuId) {
  return newClient().get('/sys/menu/info/' + menuId)
}

export const updateSysMenu = function(model) {
  return newClient().post('/sys/menu/update', model)
}

export const getSysMenuTreeData = function() {
  return newClient().get('/sys/menu/tree')
}
