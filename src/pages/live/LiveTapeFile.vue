<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="主播用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="liveId">
        <el-input v-model.trim="queryModel.liveId" placeholder="直播记录ID"></el-input>
      </el-form-item>
     <el-form-item prop="status">
        <el-select v-model="queryModel.status" clearable placeholder="录播文件状态">
          <el-option :value="1" label="已推荐"></el-option>
          <el-option :value="2" label="已删除"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <!-- <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('gift:type:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button> -->
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="userId" label="主播用户ID"></el-table-column>
      <el-table-column prop="liveId" label="直播记录ID"></el-table-column>
      <el-table-column prop="streamId" label="直播流ID"></el-table-column>
      <el-table-column prop="videoUrl" label="录播视频URL" ></el-table-column>
      <el-table-column prop="fileSize" label="录播文件大小" ></el-table-column>
      <el-table-column prop="startTime" label="开始时间戳" ></el-table-column>
      <el-table-column prop="endTime" label="结束时间戳" ></el-table-column>
      <el-table-column prop="fileId" label="点播ID"></el-table-column>
      <el-table-column prop="fileFormat" label="录播文件格式"></el-table-column>
      <el-table-column prop="duration" label="推流时长/s"></el-table-column>
      <el-table-column prop="streamParam" label="推流url参数"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="sort" label="排序值" ></el-table-column>
      <el-table-column prop="deleteTime" label="录播删除时间" ></el-table-column>
      <el-table-column prop="username" label="删除人" ></el-table-column>
      <el-table-column prop="status" label="录播文件状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.status === 1">已推荐</icon-tag>
          <icon-tag type="warning" v-if="scope.row.status === 2">已删除</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark"   content="推荐" placement="top" v-if="hasPermission('gift:type:delete') && scope.row.status === 1 === false&& scope.row.status === 2 === false">
              <el-button type="success" size="mini" @click="RecommendLive(scope.row)">
                <i>推荐</i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('gift:type:delete') && scope.row.status === 2 === false">
              <el-button type="danger" size="mini" @click="deleteSingleGift(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->
  </div>
</template>

<script>
import {
  getLiveTapeFileList,
  remove,
  Recommend
} from '../../api/live/live-tape-file';

import { emptyUserAvatarAccessory } from '../../utils/empty-model';

export default {
  name: 'gift-type-page',
  data() {
    const token = this.$store.state.user.token;
    return {
      imgFileList: [],
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        },
        create: {
          model: emptyUserAvatarAccessory(),
          show: false,
          formLoading: true,
          btnLoading: false,
          // 文件上传的url
          uploadAction:
            '/faceshow-admin/api/fileupload?token=' +
            token +
            '&temp=' +
            new Date().getTime(),
          // 上传文件时请求的header
          headers: {
            token: token
          }
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        liveId: null,
        status: null,
        createTime: null
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
      this.dialog.picPreview.picSrc = row.url;
      this.dialog.picPreview.mname = row.mname;
      this.dialog.picPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.id);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的挂饰', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          remove(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    deleteSingleGift(row) {
      this.$confirm('此操作将删除此录播文件: ' + row.id, '删除确认')
        .then(() => {
          this.loading.table = true;
          remove(row.id)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    RecommendLive(row) {
      this.$confirm('此操作将推荐此录播文件: ' + row.id, ' 确认推荐')
        .then(() => {
          this.loading.table = true;
          Recommend(row.id)
            .then(({ data }) => {
              this.$message.success('推荐成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    openCreateDialog() {
      this.dialog.create.show = true;
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
      // 显示表格loading
      this.loading.table = true;
      this.dialog.create.model = emptyUserAvatarAccessory();
      this.imgFileList = [];
      getLiveTapeFileList({
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
.gift-img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  overflow: hidden;
}

.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
}

.gift-img-preview {
  width: 240px;
  height: 240px;
  border-radius: 20%;
  overflow: hidden;
}
</style>
