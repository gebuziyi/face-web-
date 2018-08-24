<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="mname">
        <el-select v-model="queryModel.mname" clearable placeholder="键入搜索音乐名称" filterable :filter-method="remoteSearchMusicName" remote :loading="loading.select.mname">
          <template v-for="(item, index) in musicNameList">
            <el-option :label="item" :value="item" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="singer">
        <el-select v-model="queryModel.singer" clearable placeholder="键入搜索歌手/乐队" filterable :filter-method="remoteSearchSinger" remote :loading="loading.select.singer">
          <template v-for="(item, index) in singerList">
            <el-option :label="item" :value="item" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="queryModel.username" clearable placeholder="管理员用户名"></el-input>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="音乐类型" clearable>
          <el-option v-for="(item, index) in musicTypeList" :key="index" :value="item.typeId" :label="item.typeName"></el-option>
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
      <el-button @click="openTransferDialog" type="primary" size="small" v-if="hasPermission('music:info:transfer')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-exchange"></i>
        <span>批量转移</span>
      </el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('music:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('music:info:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
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
      <el-table-column prop="singer" label="歌手/乐队"></el-table-column>
      <el-table-column prop="introduce" label="音乐介绍" show-overflow-tooltip></el-table-column>
      <el-table-column prop="img" label="音乐封面">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="numbers" label="被使用次数" width="120" sortable="custom"></el-table-column>
      <el-table-column prop="country" label="国家" width="80"></el-table-column>
      <el-table-column prop="typeName" label="音乐类型" width="80"></el-table-column>
      <el-table-column prop="accountUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="试听" placement="top">
              <el-button type="primary" size="mini" @click="setPlayingMusic(scope.row)">
                <i class="fa fa-headphones"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('music:info:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
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
    <affix :offset-bottom="20">
      <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
      </el-pagination>
    </affix>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'音乐封面图片预览: ' + dialog.picPreview.mname">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <music-info-edit-dialog ref="editDialog" :types="musicTypeList" @done="getTableData()"></music-info-edit-dialog>
    <music-info-create-dialog ref="createDialog" :types="musicTypeList" @done="getTableData()"></music-info-create-dialog>
    <music-info-transfer-dialog ref="transferDialog" :types="musicTypeList" @done="getTableData()"></music-info-transfer-dialog>
  </div>
</template>

<script>
import { getMusicInfoList, removeMusicInfo } from '../../api/music/music-info';
import { getAllMusicTypeLite } from '../../api/music/music-type';
import { debounce } from 'lodash';
import { searchMusicNameList, searchSingerList } from '../../api/fuzzy-search';
import MusicInfoTransferDialog from './dialogs/MusicInfoTransferDialog';
import MusicInfoCreateDialog from './dialogs/MusicInfoCreateDialog';
import MusicInfoEditDialog from './dialogs/MusicInfoEditDialog';
import Aplayer from 'vue-aplayer';

export default {
  name: 'music-info-page',
  components: {
    'music-info-transfer-dialog': MusicInfoTransferDialog,
    'music-info-create-dialog': MusicInfoCreateDialog,
    'music-info-edit-dialog': MusicInfoEditDialog,
    aplayer: Aplayer
  },
  data() {
    return {
      playingMusic: null,
      musicNameList: [],
      singerList: [],
      musicTypeList: [],
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          mname: null
        }
      },
      loading: {
        table: true,
        select: {
          mname: false,
          singer: false
        }
      },
      tableData: [],
      queryModel: {
        mname: null,
        typeId: null,
        singer: null,
        createTime: null,
        fromAdmin: 1,
        username: null
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
    openTransferDialog() {
      const musicInfos = this.tableData.filter(
        item => this.selectedIds.indexOf(item.musicId) !== -1
      );
      this.$refs.transferDialog.showDialog(musicInfos);
    },
    remoteSearchMusicName: debounce(function(query) {
      // 搜索音乐名称
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.mname = true;
      searchMusicNameList(query.trim())
        .then(({ data }) => {
          this.musicNameList = data.list;
          this.loading.select.mname = false;
        })
        .catch(error => {});
    }, 500),
    remoteSearchSinger: debounce(function(query) {
      // 搜索歌手名称
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.singer = true;
      searchSingerList(query.trim())
        .then(({ data }) => {
          this.singerList = data.list;
          this.loading.select.singer = false;
        })
        .catch(error => {});
    }, 500),
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
      this.musicFileList = [];
    },
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
    openCreateDialog() {
      this.$refs.createDialog.showDialog();
    },
    openEditDialog(row) {
      this.$refs.editDialog.showDialog(row.musicId);
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
      this.imgFileList = [];
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
    initMusicTypeSelectData() {
      getAllMusicTypeLite()
        .then(({ data }) => {
          this.musicTypeList = data.list;
        })
        .catch(errorMsg => {});
    },
    setPlayingMusic(row) {
      const opt = {
        title: row.mname,
        artist: row.singer,
        src: row.url,
        pic: row.img
      }

      this.playingMusic = opt;
      setTimeout(() => {
        this.$refs.aplayer.play();
      }, 100)
    }
  },
  created() {
    this.initMusicTypeSelectData();
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
