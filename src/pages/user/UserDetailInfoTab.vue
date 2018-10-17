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
      <el-table-column prop="detailId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="img" label="头像">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="diamond" label="钻石数量" sortable="custom"></el-table-column>
      <el-table-column prop="f" label="F币数量" sortable="custom"></el-table-column>
      <el-table-column prop="liveIncome" label="直播收入" sortable="custom"></el-table-column>
      <el-table-column prop="videoIncome" label="短视频收入" sortable="custom" width="120px"></el-table-column>
      <el-table-column prop="matchingIncome" label="1V1收入" sortable="custom"></el-table-column>
      <el-table-column prop="anchorTime" label="直播任务时长"></el-table-column>
      <el-table-column prop="language" label="母语"></el-table-column>
      <el-table-column prop="citizenship" label="国籍"></el-table-column>
      <el-table-column prop="nowAddressName" label="现居住地"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column prop="memo" label="备注"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="修改钻石数量" placement="top" v-if="hasPermission('user:account-info:diamond:update')">
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
    <!-- 修改等级信息 -->
    <el-dialog :visible.sync="dialog.edit.show" :title="`修改用户 [${dialog.edit.username}] 钻石数量`" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <div class="tips">
          <p>原钻石数量:
            <span style="color: red; font-weight: 600; padding-left: 1em;">{{ dialog.edit.original }}</span>
          </p>
        </div>
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="新钻石数量" prop="diamond">
            <el-input-number v-model.trim="dialog.edit.model.diamond" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="dialog.edit.model.memo" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'头像图片预览: '">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserAccountInfoList,
  updateUserDiamond
} from '../../api/user/user-account-info';

export default {
  name: 'user-account-info-page',
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        },
        edit: {
          detailId: null,
          username: null,
          userId: null,
          original: null,
          model: {
            diamond: null,
            memo: null
          },
          show: false,
          rules: {
            diamond: [
              {
                required: true,
                trigger: 'change',
                message: '钻石数量不能为空'
              },
              {
                type: 'number',
                min: 0,
                trigger: 'change',
                message: '钻石数量不能小于0'
              }
            ],
            memo: [
              { required: true, trigger: 'change', message: '备注不能为空' }
            ]
          }
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        userId: null,
        nickname: null
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
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.mname = row.mname;
      this.dialog.picPreview.show = true;
    },
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
          `此操作将会把用户: ${this.dialog.edit.username} 的钻石数量从 ${
            this.dialog.edit.original
          } 修改为 ${this.dialog.edit.model.diamond}, 是否继续?`,
          '修改确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            let msg = {
              detailId: this.dialog.edit.detailId,
              userId: this.dialog.edit.userId,
              diamond: this.dialog.edit.model.diamond,
              memo: this.dialog.edit.model.memo
            };

            updateUserDiamond(msg)
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
    showUpdateDialog(row) {
      this.dialog.edit.detailId = row.detailId;
      this.dialog.edit.userId = row.userId;
      this.dialog.edit.username = row.username;
      this.dialog.edit.original = row.diamond;
      this.dialog.edit.model.diamond = row.diamond;
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
      getUserAccountInfoList({
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
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
}

.img-preview {
  display: block;
  margin: auto auto;
  max-width: 600px;
  max-height: 600px;
}

.tips {
  margin-bottom: 1em;
}
</style>
