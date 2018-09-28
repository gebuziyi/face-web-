<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="videoId">
        <el-input v-model.trim="queryModel.videoId" placeholder="视频ID"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="评论人用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="statues">
        <el-select v-model="queryModel.statues" clearable placeholder="审核状态">
          <el-option :value="1" label="审核通过"></el-option>
          <el-option :value="0" label="审核不通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="isType">
        <el-select v-model="queryModel.isType" clearable placeholder="是否真实用户">
          <el-option :value="0" label="真实普通账号"></el-option>
          <el-option :value="1" label="机器人账号"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="评论时间" end-placeholder="评论时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="checkFailedBatch" type="warning" size="small" v-if="hasPermission('video:comment:audit-failed')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-times"></i>
        <span>批量审核不通过</span>
      </el-button>
       <el-button @click="passFailedBatch" type="success" size="small" v-if="hasPermission('video:comment:audit-failed')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-times"></i>
        <span>批量审核通过</span>
      </el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('video:comment:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="commentId" label="评论ID" sortable="custom"></el-table-column>
      <el-table-column prop="videoId" label="视频ID"></el-table-column>
      <el-table-column prop="userId" label="评论人ID"></el-table-column>
      <el-table-column prop="nickname" label="评论人昵称"></el-table-column>
      <el-table-column prop="comment" label="评论内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statues" label="审核状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.statues === 1 ? 'success' : 'danger'">{{ scope.row.statues === 1 ? '审核通过' : '审核未通过' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isType" label="用户状态" sortable="custom">
         <template slot-scope="scope">
            <icon-tag type="success" v-if='scope.row.isType === 0'>真实普通账号</icon-tag>
            <icon-tag type="warning" v-if='scope.row.isType === 1'>机器人账号</icon-tag>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="审核不通过" placement="top" v-if="hasPermission('video:comment:delete') && scope.row.statues === 1">
              <el-button type="warning" size="mini" @click="checkFailedSingle(scope.row)">
                <i class="fa fa-times"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核通过" placement="top" v-if="hasPermission('video:comment:delete') && scope.row.statues === 0">
              <el-button type="success" size="mini" @click="ReviewAndPassThrough(scope.row)">
               <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('video:comment:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
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
  </div>
</template>

<script>
import {
  getVideoCommentList,
  checkFailedComment,
  deleteVideoComment,
  ReviewAndPass
} from '../../api/video/video-comment';

export default {
  name: 'video-comment-page',
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        videoId: null,
        statues: null,
        isType: null,
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
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.commentId);
      }
    },
    deleteBatch() {
      this.$confirm(
        '此操作将删除所选择的视频评论, 这些评论的点赞记录, 子评论, 子评论的点赞记录也会一并删除, 确定继续?',
        '批量删除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          deleteVideoComment(this.selectedIds)
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
    checkFailedBatch() {
      this.$confirm(
        '此操作将把所选择的视频评论标记为审核不通过, 确定继续?',
        '批量审核视频评论',
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          checkFailedComment(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('操作成功');
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
    passFailedBatch() {
      this.$confirm(
        '此操作将把所选择的视频评论标记为审核通过, 确定继续?',
        '批量审核视频评论',
        {
          type: 'success'
        }
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          ReviewAndPass(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('操作成功');
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
    checkFailedSingle(row) {
      this.$confirm(
        '此操作将把所选择的视频评论标记为审核不通过, 确定继续?',
        '审核视频评论',
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          checkFailedComment(row.commentId)
            .then(({ data }) => {
              this.$message.success('操作成功');
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
    ReviewAndPassThrough(row) {
      this.$confirm(
        '此操作将把所选择的视频评论标记为审核通过, 确定继续?',
        '审核视频评论',
        {
          type: 'success'
        }
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          ReviewAndPass(row.commentId)
            .then(({ data }) => {
              this.$message.success('操作成功');
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
    deleteSingle(row) {
      this.$confirm(
        `此操作将删除选择的视频评论, 该评论的点赞记录, 子评论, 子评论的点赞记录也会一并删除, 确定继续?`,
        '删除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading.table = true;
          deleteVideoComment(row.commentId)
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
      getVideoCommentList({
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
    if (this.$route.query && this.$route.query.videoId) {
      this.queryModel.videoId = this.$route.query.videoId;
    }
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
