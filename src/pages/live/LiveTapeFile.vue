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
      <el-button @click="showSortDialog" type="primary" size="small" v-if="hasPermission('video:topic:sort')" class="btn-operation">
        <i class="fa fa-sort-numeric-desc"></i>
        <span>录播文件排序</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="userId" label="主播用户ID"></el-table-column>
      <el-table-column prop="liveId" label="直播记录ID"></el-table-column>
      <el-table-column prop="streamId" label="直播流ID"></el-table-column>
      <el-table-column prop="videoUrl" label="录播视频URL"></el-table-column>
      <el-table-column prop="fileSize" label="录播文件大小"></el-table-column>
      <el-table-column prop="startTime" label="开始时间戳"></el-table-column>
      <el-table-column prop="endTime" label="结束时间戳"></el-table-column>
      <el-table-column prop="fileId" label="点播ID"></el-table-column>
      <el-table-column prop="fileFormat" label="录播文件格式"></el-table-column>
      <el-table-column prop="duration" label="推流时长/s"></el-table-column>
      <el-table-column prop="streamParam" label="推流url参数"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="deleteTime" label="录播删除时间"></el-table-column>
      <el-table-column prop="username" label="删除人"></el-table-column>
      <el-table-column prop="status" label="录播文件状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.status === 1">已推荐</icon-tag>
          <icon-tag type="warning" v-if="scope.row.status === 2">已删除</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click" size="mini" type="text">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="item" effect="dark" content="推荐" placement="top" v-if="hasPermission('gift:type:delete') && scope.row.status === 1 === false&& scope.row.status === 2 === false">
                <el-button type="success" size="mini" @click="RecommendLive(scope.row)">
                  <i class="fa fa-fire"></i>推荐录播文件
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="item" effect="dark" content="推荐" placement="top" v-if="hasPermission('gift:type:delete')  && scope.row.status === 2 === false">
                <el-button type="info" size="mini" @click="CloseRecommendLive(scope.row)">
                  <i class="fa fa-fire"></i>取消录播文件
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('gift:type:delete') && scope.row.status === 2 === false ">
                <el-button type="danger" size="mini" @click="deleteSingleGift(scope.row)">
                  <i class="fa fa-trash"></i>删除录播文件
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->
    <sort-dialog ref="sortDialog" @done="getTableData()"></sort-dialog>
    <el-dialog :title="`录播文件播放: ${dialog.play.fileId}`" width="1000" class="play-dialog" :visible.sync="dialog.play.show">
      <!-- 设置播放器容器 -->
      <video id="player-container-id" preload="auto" width="900" height="800" playsinline webkit-playinline x5-playinline autoplay></video>
      <span slot="footer">
        <el-button @click="dialog.play.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLiveTapeFileList,
  Recommend,
  CloseRecommend
} from '../../api/live/live-tape-file';
import SortDialog from './dialogs/SortDialog';

export default {
  name: 'live-tape-file-page',
  components: {
    'sort-dialog': SortDialog
  },
  data() {
    return {
      player: null,
      selectedIds: [],
      dialog: {
        play: {
          show: false,
          fileId: ''
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
    showPlayDialog(row) {
      this.dialog.play.show = true;
      this.dialog.play.fileId = row.fileId;
      setTimeout(() => {
        if (this.player) {
          this.player.loadVideoByID({
            fileID: row.fileId,
            appID: '1256213697'
          });
        } else {
          // eslint-disable-next-line
          this.player = TCPlayer('player-container-id', {
            fileID: row.fileId,
            appID: '1256213697'
          });
        }
      }, 500);
    },
    showSortDialog() {
      this.$refs.sortDialog.showDialog();
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
    CloseRecommendLive(row) {
      this.$confirm('此取消推荐此录播文件: ' + row.id, ' 确认取消推荐')
        .then(() => {
          this.loading.table = true;
          CloseRecommend(row.id)
            .then(({ data }) => {
              this.$message.success('取消推荐成功');
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
