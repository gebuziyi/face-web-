<template>
  <el-container>
    <el-aside>
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header height="40px">
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <transition mode="out-in" name="fade">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getSysMenu } from '../api/sys/sys-menu';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

export default {
  name: 'dashboard',
  data() {
    return {};
  },
  components: {
    'side-bar': SideBar,
    'nav-bar': NavBar
  },
  methods: {
    getMenus() {
      getSysMenu()
        .then(({ data }) => {
          if (data.code === 0) {
            this.$store.commit('setMenu', {
              menuList: data.menuList
            });
            this.$store.commit('setPermissions', {
              permissions: data.permissions
            });
          } else {
            const error = new Error(data.msg);
            throw error;
          }
        })
        .catch(error => {});
    }
  },
  created() {
    this.getMenus();
  }
};
</script>

<style scoped>
.el-aside {
  position: fixed;
  left: 0;
  top: 0;
  max-width: 250px;
  background-color: #545c64;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /*防止win10任务栏挡住最下面的菜单项, 不知道在linux下会不会有这种问题*/
  padding-bottom: 100px;
}
/*隐藏y方向滚动条*/
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-header {
  padding: 0px;
  margin-left: 250px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
}
.el-main {
  margin-left: 250px;
}
</style>
