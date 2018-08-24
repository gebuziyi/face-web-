<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="nickName" label="用户昵称">
    </el-table-column>
    <el-table-column prop="img" label="头像">
      <template slot-scope="scope">
        <img :src="scope.row.img" class="avatar" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template slot-scope="scope">
        <icon-tag :type="scope.row.sex === 0 ? 'danger' : ''" :icon="scope.row.sex === 0 ? 'fa fa-venus' : scope.row.sex === 1 ? 'fa fa-mars' : 'fa fa-question-circle-o'">
          {{ scope.row.sex === 0 ? '女' : scope.row.sex === 1 ? '男' : '未知' }}
        </icon-tag>
      </template>
    </el-table-column>
    <el-table-column prop="country" label="国家">
    </el-table-column>
  </el-table>
</template>

<script>
import { getNewRegisteredUserInTop10 } from '../../../api/dashboard/dashboard';

export default {
  name: 'newest-registered-users',

  data() {
    return {
      users: []
    };
  },

  methods: {
    getTableData() {
      getNewRegisteredUserInTop10()
        .then(({ data }) => {
          this.users = data.users;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
