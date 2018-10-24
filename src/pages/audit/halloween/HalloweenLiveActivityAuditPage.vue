<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickName">
        <el-input v-model.trim="queryModel.nickName" placeholder="用户昵称"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item> -->
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <el-tabs v-model="activeTabName" @tab-click="onTabClick">
      <el-tab-pane label="明星榜" name="account">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="userId" label="接受人ID" sortable="custom"></el-table-column>
          <el-table-column prop="img" label="接收人头像">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击查看大图" placement="top">
                <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="接受人昵称"></el-table-column>
          <el-table-column prop="sex" label="接收人性别"></el-table-column>
          <el-table-column prop="lanternCount" label="收到的南瓜灯数量"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="分配头像挂饰" placement="top" v-if="hasPermission('app:activity:update')">
                  <el-button type="success" size="mini" @click="openAvatarAccessoryDialog(scope.row)">
                    <i class="fa fa-thumbs-up"></i>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="土豪榜" name="from">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="userId" label="赠送人ID" sortable="custom"></el-table-column>
          <el-table-column prop="img" label="赠送人头像">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击查看大图" placement="top">
                <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="赠送人昵称"></el-table-column>
          <el-table-column prop="sex" label="赠送人性别"></el-table-column>
          <el-table-column prop="lanternCount" label="赠送的南瓜灯数量"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="分配头像挂饰" placement="top" v-if="hasPermission('app:activity:update')">
                  <el-button type="success" size="mini" @click="openAvatarAccessoryDialog(scope.row)">
                    <i class="fa fa-thumbs-up"></i>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <el-dialog :visible.sync="dialog.picPreview.show">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <avatar-accessory ref="avatarAccessory" @done="getTableData"></avatar-accessory>
  </div>
</template>

<script>
import { getHelloweenLiveLanternCount } from '../../../api/audit/helloween';
import UserAvatarAccessoryCreateDialog from '../../user/dialogs/UserAvatarAccessoryCreateDialog';
export default {
  name: 'user-giveaway-log-page',
  components: {
    'avatar-accessory': UserAvatarAccessoryCreateDialog
  },
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      activeTabName: 'account',
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        nickName: null,
        createTime: null,
        role: 'account'
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      }
    };
  },
  methods: {
    openAvatarAccessoryDialog(row) {
      this.$refs.avatarAccessory.showDialog(null, row);
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.show = true;
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onTabClick(tab) {
      this.pager.page = 1;
      this.queryModel.role = tab.name;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.getTableData();
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    getTableData() {
      this.loading.table = true;
      getHelloweenLiveLanternCount({
        query: this.queryModel,
        pager: this.pager
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
