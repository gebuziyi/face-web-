<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="giftId">
        <el-select v-model="queryModel.giftId" clearable placeholder="礼品信息">
          <template v-for="(item, index) in giftInfoList">
            <el-option :label="item.giftName" :value="item.giftId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="canSend">
        <el-select v-model="queryModel.canSend" placeholder="能否转增" clearable>
          <el-option :value="1" label="可以转赠"></el-option>
          <el-option :value="0" label="不能转赠"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="infoId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="giftName" label="礼品名称"></el-table-column>
      <el-table-column prop="giftImg" label="礼品图片">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.giftImg" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="numbers" label="礼品数量" sortable="custom"></el-table-column>
      <el-table-column prop="canSend" label="能否转赠">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.canSend === true ? 'success' : 'danger'">{{ scope.row.canSend === true ? '可以转赠' : '不能转赠'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="修改礼品数量" placement="top" v-if="hasPermission('user:gift:update')">
              <el-button type="warning" size="mini" @click="showUpdateDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <!-- 修改礼物数量 -->
    <el-dialog :visible.sync="dialog.edit.show" :title="`用户 [${dialog.edit.username}] 拥有的 [${dialog.edit.giftName}] 数量`" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <div class="tips">
          <p>原礼物数量:
            <span style="color: red; font-weight: 600; padding-left: 1em;">{{ dialog.edit.original }}</span>
          </p>
        </div>
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="新礼物数量" prop="numbers">
            <el-input-number v-model.trim="dialog.edit.model.numbers" :min="0"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`${dialog.picPreview.giftName}: `">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserGiftInfoList,
  updateUserGiftNumber
} from '../../api/user/user-gift-info';
import { getAllGiftInfo } from '../../api/gift/gift-info';

export default {
  name: 'user-gift-info-page',
  data() {
    return {
      giftInfoList: [],
      dialog: {
        edit: {
          detailId: null,
          username: null,
          original: null,
          model: {
            numbers: null
          },
          show: false,
          rules: {
            numbers: [
              {
                required: true,
                trigger: 'change',
                message: '礼物数量不能为空'
              },
              {
                type: 'number',
                min: 0,
                trigger: 'change',
                message: '礼物数量不能小于0'
              }
            ]
          }
        },
        picPreview: {
          show: false,
          picSrc: null,
          giftName: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        giftId: null,
        canSend: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      }
    };
  },
  methods: {
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    doEdit() {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.$confirm(
          `此操作将会把用户: ${this.dialog.edit.username} 的 ${
            this.dialog.edit.giftName
          } 数量从 ${this.dialog.edit.original} 修改为 ${
            this.dialog.edit.model.numbers
          }, 是否继续?`,
          '修改确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            let msg = {
              infoId: this.dialog.edit.infoId,
              numbers: this.dialog.edit.model.numbers
            };

            updateUserGiftNumber(msg)
              .then(resp => {
                this.$message.success('修改成功');
                this.dialog.edit.show = false;
                this.getTableData();
              })
              .catch(error => {});
          })
          .catch(() => {});
      });
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.giftImg;
      this.dialog.picPreview.giftName = row.giftName;
      this.dialog.picPreview.show = true;
    },
    showUpdateDialog(row) {
      this.dialog.edit.infoId = row.infoId;
      this.dialog.edit.username = row.username;
      this.dialog.edit.giftName = row.giftName;
      this.dialog.edit.original = row.numbers;
      this.dialog.edit.model.numbers = row.numbers;
      this.dialog.edit.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
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
      getUserGiftInfoList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    },
    initGiftInfoSelectData() {
      getAllGiftInfo()
        .then(({ data }) => {
          this.giftInfoList = data.list;
        })
        .catch(error => {});
    }
  },
  created() {
    this.initGiftInfoSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.tips {
  margin-bottom: 1em;
}
</style>
