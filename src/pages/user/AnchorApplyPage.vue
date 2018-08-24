<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="申请人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="realName">
        <el-input v-model.trim="queryModel.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item prop="checkName">
        <el-input v-model.trim="queryModel.checkName" placeholder="审核人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="checkType">
        <el-select v-model="queryModel.checkType" placeholder="审核状态" clearable>
          <el-option :value="1" label="审核中"></el-option>
          <el-option :value="2" label="已通过"></el-option>
          <el-option :value="3" label="已拒绝"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="申请时间" end-placeholder="申请时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item prop="checkTime">
        <el-date-picker v-model="queryModel.checkTime" type="datetimerange" range-separator="至" start-placeholder="审核时间" end-placeholder="审核时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="anchorId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="username" label="申请人"></el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column prop="card" label="身份证号码"></el-table-column>
      <el-table-column prop="cardPositive" label="身份证正面手持">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.cardPositive" class="img-thumb" @click="showPicPreviewDialog(scope.row.realName, scope.row.cardPositive, '身份证正面手持')">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cardOpposite" label="身份证反面手持">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.cardOpposite" class="img-thumb" @click="showPicPreviewDialog(scope.row.realName, scope.row.cardOpposite, '身份证反面手持')">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" sortable="custom"></el-table-column>
      <el-table-column prop="checkName" label="审核人"></el-table-column>
      <el-table-column prop="checkTime" label="审核时间" sortable="custom"></el-table-column>
      <el-table-column prop="checkType" label="申请状态">
        <template slot-scope="scope">
          <icon-tag :type="checkType2IconTag(scope.row.checkType).type">{{ checkType2IconTag(scope.row.checkType).description }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="通过申请" placement="top" v-if="hasPermission('user:anchor-apply:pass') && scope.row.checkType === 0">
              <el-button type="success" size="mini" @click="showPassConfirm(scope.row)">
                <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="拒绝申请" placement="top" v-if="hasPermission('user:anchor-apply:deny') && scope.row.checkType === 0">
              <el-button type="danger" size="mini" @click="showDenyConfirm(scope.row)">
                <i class="fa fa-times"></i>
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
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`[${dialog.picPreview.realName}] ${dialog.picPreview.cardTip} :`">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getAnchorApplyList,
  passAnchorApply,
  denyAnchorApply
} from '../../api/user/anchor-apply';

export default {
  name: 'anchor-apply-page',
  data() {
    return {
      dialog: {
        picPreview: {
          cardTip: null,
          show: false,
          picSrc: null,
          realName: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        realName: null,
        createTime: null,
        checkName: null,
        checkType: null,
        checkTime: null
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
    checkType2IconTag(checkType) {
      let result = {
        type: 'info',
        description: '审核中'
      };
      if (checkType === 0) {
      } else if (checkType === 1) {
        result.type = 'success';
        result.description = '已通过';
      } else {
        result.type = 'danger';
        result.description = '已拒绝';
      }

      return result;
    },
    showPassConfirm(row) {
      this.$confirm(
        `确定要通过 [${row.realName}] 的主播申请?`,
        '通过主播申请',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let msg = {
            anchorId: row.anchorId,
            userId: row.userId
          };
          passAnchorApply(msg)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showDenyConfirm(row) {
      this.$confirm(
        `确定要拒绝 [${row.realName}] 的主播申请?`,
        '拒绝主播申请',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let msg = {
            anchorId: row.anchorId,
            userId: row.userId
          };
          denyAnchorApply(msg)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showPicPreviewDialog(realName, picSrc, cardTip) {
      this.dialog.picPreview.realName = realName;
      this.dialog.picPreview.picSrc = picSrc;
      this.dialog.picPreview.cardTip = cardTip;
      this.dialog.picPreview.show = true;
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
      getAnchorApplyList({
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

</style>
