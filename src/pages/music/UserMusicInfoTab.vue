<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model="queryModel.username" clearable placeholder="会员用户名"></el-input>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('music:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 音乐播放器 -->
    <transition name="el-zoom-in-top">
      <aplayer ref="aplayer" :mutex="false" :music="playingMusic" v-if="playingMusic !== null" :repeat="'none'"></aplayer>
    </transition>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="musicId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="mname" label="音乐名称"></el-table-column>
      <el-table-column prop="numbers" label="被使用次数" width="120" sortable="custom"></el-table-column>
      <el-table-column prop="country" label="国家" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="试听" placement="top">
              <el-button type="primary" size="mini" @click="setPlayingMusic(scope.row)">
                <i class="fa fa-headphones"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('music:info:delete')">
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
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'音乐封面图片预览: ' + dialog.picPreview.mname">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import { getMusicInfoList, removeMusicInfo } from '../../api/music/music-info';
import Aplayer from 'vue-aplayer';

export default {
  name: 'user-music-info-tab',
  components: {
    aplayer: Aplayer
  },
  data() {
    return {
      playingMusic: null,
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          mname: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        createTime: null,
        fromUser: 1
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
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.musicId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的音乐信息', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeMusicInfo(this.selectedIds)
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
    deleteSingle(row) {
      this.$confirm('此操作将删除音乐信息: ' + row.mname, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeMusicInfo(row.musicId)
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
      getMusicInfoList({
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
    setPlayingMusic(row) {
      const opt = {
        title: row.mname,
        artist: row.singer,
        src: row.url,
        pic: row.img
      };

      this.playingMusic = opt;
      setTimeout(() => {
        this.$refs.aplayer.play();
      }, 100);
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

.aplayer {
  display: block;
  width: 400px;
  position: fixed;
  top: 40px;
  right: 0px;
  z-index: 99;
}
</style>
