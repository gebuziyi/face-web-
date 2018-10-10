import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sys: {
      menus: []
    },
    user: {
      userId: localStorage.getItem('userId'),
      username: '',
      login: false,
      token: localStorage.getItem('token'),
      permissions: []
    },
    assistant: {
      officialAccountId: null
    }
  },
  mutations: {
    setOfficialAccountId: (state, payload) => {
      state.assistant.officialAccountId = payload;
    },
    setUser: (state, { username, userId, token }) => {
      state.user.username = username
      state.user.userId = userId
      state.user.token = token
      localStorage.setItem('userId', userId)
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
    },
    setMenu: (state, { menuList }) => {
      state.sys.menus = menuList
    },
    setPermissions: (state, { permissions }) => {
      state.user.permissions = permissions
    },
    logout: (state, payload) => {
      state.user.login = false;
      state.user.username = null;
      state.user.token = null;
      state.permissions = [];
      state.sys.menus = [];
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  },
  getters: {
    getCurrentMenu: (state) => (currentPath) => {
      if (state.sys.menus.length === 0) {
        return {
          icon: '',
          title: ''
        }
      }
      let lv2Menus = []
      state.sys.menus.map(item => item.list).forEach(item => {
        lv2Menus = lv2Menus.concat(item)
      })
      let level2Menu = lv2Menus.find(lv2Menu => lv2Menu.url === currentPath)
      let result = {
        icon: level2Menu.icon,
        title: level2Menu.name,
        menuId: level2Menu.menuId,
        parentId: level2Menu.parentId
      }
      return result
    },
    getParentMenu: (state) => (parentId) => {
      if (state.sys.menus.length === 0) {
        return {
          icon: 'fa fa-home',
          title: '首页'
        }
      } else {
        let parentMenu = state.sys.menus.find(item => item.menuId === parentId)
        let result = {
          icon: parentMenu.icon,
          title: parentMenu.name
        }
        return result
      }
    },
    hasMenuPermission: (state) => (path) => {
      if (store.state.sys.menus.length === 0 || store.state.user.permissions.length === 0) {
        return true
      }
      let lv2Menus = []
      state.sys.menus.map(item => item.list).forEach(item => {
        lv2Menus = lv2Menus.concat(item)
      })
      let level2Menu = lv2Menus.find(lv2Menu => lv2Menu.url === path)
      if (level2Menu === null || typeof level2Menu === 'undefined') {
        return false;
      }
      if (level2Menu.perms && level2Menu.perms !== '') {
        const permArr = level2Menu.perms.indexOf(',') === -1 ? [].concat(level2Menu.perms) : [].concat(level2Menu.perms.split(','));
        for (const perm of permArr) {
          if (store.state.user.permissions.indexOf(perm) === -1) {
            return false
          }
        }
        return true
      }

      return true
    }
  }
})

// 检查用户权限
Vue.prototype.hasPermission = function (permission) {
  return store.state.user.permissions.indexOf(permission) !== -1
}

export default store
