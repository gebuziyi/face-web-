<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="videoId">
        <el-input v-model.trim="queryModel.videoId" placeholder="视频ID"></el-input>
      </el-form-item>
      <el-form-item prop="topicId">
        <el-select v-model="queryModel.topicId" clearable placeholder="键入搜索视频话题" filterable :filter-method="remoteSearchVideoTopic" remote :loading="loading.select.topic">
          <template v-for="(item, index) in videoTopicList">
            <el-option :label="item.tname" :value="item.topicId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" clearable placeholder="视频类型">
          <template v-for="(item, index) in videoTypeList">
            <el-option :label="item.videoTypeName" :value="item.videoTypeId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="musicId">
        <el-select v-model="queryModel.musicId" clearable placeholder="键入搜索音乐" filterable :filter-method="remoteSearchVideoMusic" remote :loading="loading.select.music">
          <template v-for="(item, index) in videoMusicList">
            <el-option :label="item.mname" :value="item.musicId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="会员用户名"></el-input>
      </el-form-item>
      <el-form-item prop="country">
        <el-select v-model="queryModel.country" placeholder="国家" clearable filterable>
          <el-option v-for="(item, index) in countryList" :key="index" :value="item.coding" :label="item.countryName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="statues">
        <el-select v-model="queryModel.statues" clearable placeholder="视频状态">
          <template v-for="(item, index) in videoStatusList">
            <el-option :label="item.description" :value="item.status" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="isPrivate">
        <el-select v-model="queryModel.isPrivate" clearable placeholder="隐私状态">
          <template v-for="(item, index) in videoPrivacyStatusList">
            <el-option :label="item.description" :value="item.status" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="hot">
        <el-select v-model="queryModel.hot" placeholder="是否热门" clearable>
          <el-option :value="0" label="普通视频"></el-option>
          <el-option :value="1" label="热门视频"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="上传时间" end-placeholder="上传时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="sysUserId">
        <el-select v-model="queryModel.sysUserId" placeholder="管理员" clearable filterable>
          <el-option v-for="(item, index) in sysList" :key="index" :value="item.userId" :label="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="featured">
        <el-select v-model="queryModel.featured" placeholder="是否精选" clearable>
          <el-option :value="0" label="普通视频"></el-option>
          <el-option :value="1" label="精选视频"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 查询表单 end-->
    <!-- 按钮 -->
    <table-btns :btns="operationBtns" @query="onQueryBtnClick"></table-btns>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange" :row-class-name="toggleRowClassName" :default-sort="defaultSorter">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="videoId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="img" label="视频" width="100">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showVideoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="视频简介" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.introduction | parseTextIntro }}
        </template>
      </el-table-column>
      <el-table-column prop="musicName" label="音乐" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="info" size="mini" v-if="scope.row.musicName === null || scope.row.musicName === ''">原声</el-tag>
          <span v-else>{{ scope.row.musicName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="视频类型" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.typeId !== null">{{ scope.row.typeName }}</span>
          <el-tag v-else type="info" size="mini">未指定</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="topicName" label="视频话题" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.topics !== null && scope.row.topics.length > 0">
            <p v-for="(item, index) in scope.row.topics" :key="index">
              <el-tag size="mini" closable @close="onTopicRemove(scope.row, item.topicId, item.tname)">
                <span> #{{ item.tname }}</span>
              </el-tag>
            </p>
          </template>
          <template v-else>
            <el-tag type="info" size="mini">未参与</el-tag>
          </template>
          <!-- 不允许为私密视频添加话题 -->
          <p v-if="scope.row.isPrivate === 1">
            <el-tag type="success" size="mini" class="cursor-pointer" @click.native="openTopicAddDialog(scope.row)">
              <i class="fa fa-plus"></i> 添加话题</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="country" label="国家" width="60"></el-table-column>
      <el-table-column prop="heatNum" label="热度值" sortable="custom" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.heatNum }}</span>
          <i class="pd-left-5 fa fa-fire"></i>
        </template>
      </el-table-column>
      <el-table-column prop="collectionNum" label="点赞数" sortable="custom" width="100">
        <template slot-scope="scope">
          <el-button type="button" size="small" @click="showLikeLog(scope.row)" :disabled="scope.row.collectionNum === 0">
            <span>{{ scope.row.collectionNum }}</span>
            <i class="pd-left-5 fa fa-heart color-red"></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="commentNum" label="评论数" sortable="custom" width="90">
        <template slot-scope="scope">
          <el-button size="small" @click="toCommentPage(scope.row)" :disabled="scope.row.commentNum === 0">
            <span>{{ scope.row.commentNum }}</span>
            <i class="pd-left-5 fa fa-comments "></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shareNum" label="分享数" sortable="custom" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.shareNum }}</span>
          <i class="pd-left-5 fa fa-share"></i>
        </template>
      </el-table-column>
      <el-table-column prop="playNum" label="播放量" sortable="custom" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.playNum }}</span>
          <i class="el-icon-view"></i>
        </template>
      </el-table-column>
      <el-table-column prop="statues" label="状态" width="90">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.statues === 1 ? 'success' : 'warning'">{{ status2Description(scope.row.statues) }}</icon-tag>
          <icon-tag :type="scope.row.isPrivate | privacyStatus2TagType" :icon="scope.row.isPrivate === 0 ? 'fa fa-lock' : null" v-if="scope.row.statues!=0">{{ privacyStatus2Description(scope.row.isPrivate) }}</icon-tag>
          <icon-tag :type="scope.row.hot === true ? 'danger' : 'info'" :icon="scope.row.hot === true ? 'fa fa-fire' : ''" v-if="scope.row.statues!=0">{{ scope.row.hot === true ? '热门视频' : '普通视频'}}</icon-tag>
          <icon-tag :type="scope.row.statues === 0 ? 'info' : ''" v-if="scope.row.statues === 0">{{ scope.row.deleteType === true ? '管理员删除' : '用户删除'}}</icon-tag>
          <icon-tag :type="'danger'" :icon="'fa fa-snowflake-o'" v-if="scope.row.featured === true">精选</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" sortable="custom" width="105"></el-table-column>
      <el-table-column prop="deleteUserName" label="删除人" width="100"></el-table-column>
      <el-table-column prop="deleteTime" label="删除时间" width="105"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-dropdown trigger="click" size="mini" type="text">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="hasPermission('video:info:update') && scope.row.isPrivate === 1">
                <el-button type="primary" size="mini" @click="openEditDialog(scope.row)">
                  <i class="fa fa-edit"></i>修改视频
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:freeze') && scope.row.statues === 1 && scope.row.hot === false">
                <el-button type="warning" size="mini" @click="doFreezeSingle(scope.row)">
                  <i class="fa fa-lock"></i>冻结视频
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:unfreeze') && scope.row.statues === 2 && scope.row.hot === false">
                <el-button type="success" size="mini" @click="doUnfreezeSingle(scope.row)">
                  <i class="fa fa-unlock"></i>解冻视频
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:hot') && scope.row.hot === false && scope.row.isPrivate === 1 && scope.row.statues !== 2">
                <el-button type="danger" size="mini" @click="showMakeHotConfirm(scope.row)">
                  <i class="fa fa-fire"></i>推荐热门
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:hot') && scope.row.hot === true && scope.row.isPrivate === 1 && scope.row.statues !== 2">
                <el-button type="info" size="mini" @click="showCancelHotConfirm(scope.row)">
                  <i class="fa fa-ban"></i>取消热门
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:delete')">
                <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
                  <i class="fa fa-trash"></i>删除视频
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:delete')">
                <el-button type="info" size="mini" @click="openSendGiftLogDialog(scope.row)">
                  <i class="fa fa-file-text-o"></i>收礼记录
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:featured') && scope.row.featured === false && scope.row.isPrivate === 1 && scope.row.statues === 1">
                <el-button type="danger" size="mini" @click="showMakeFeaturedConfirm(scope.row)">
                  <i class="fa fa-snowflake-o"></i>设为精选
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('video:info:featured') && scope.row.featured === true">
                <el-button type="primary" size="mini" @click="showCancelFeaturedConfirm(scope.row)">
                  <i class="fa fa-ban"></i>取消精选
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
    <!-- 弹窗 -->
    <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
    <edit-dialog ref="editDialog" :types="videoTypeList" :countries="countryList" @done="getTableData()"></edit-dialog>
    <create-dialog ref="createDialog" :types="videoTypeList" :countries="countryList" @done="getTableData()"></create-dialog>
    <topic-add-dialog ref="topicAddDialog" @done="getTableData()"></topic-add-dialog>
    <send-gift-log-dialog ref="sendGiftLogDialog" :types="videoTypeList" :countries="countryList" @done="getTableData()"></send-gift-log-dialog>
    <like-log-dialog ref="logDialog"></like-log-dialog>
  </div>
</template>

<script>
import {
  getVideoInfoList,
  freezeVideoInfo,
  unfreezeVideoInfo,
  deleteVideoInfo,
  makeVideoHot,
  cancelVideoHot,
  removeVideoTopic,
  DoCancelHotConfirm,
  makeVideoFeatured,
  cancelVideoFeatured
} from '../../api/video/video-info';
import { getAllCountryInfo } from '../../api/basic-data/country-info';
import { getAllVideoType } from '../../api/video/video-type';
import {
  searchMusicListByName,
  searchVideoTopicListByName
} from '../../api/fuzzy-search';
import { debounce } from 'lodash';
import VideoInfoEditDialog from './dialogs/VideoInfoEditDialog';
import VideoInfoCreateDialog from './dialogs/VideoInfoCreateDialog';
import VideoInfoTopicAddDialog from './dialogs/VideoInfoTopicAddDialog';
import VideoGiftSendLogDialog from './dialogs/VideoGiftSendLogDialog';
import { getAllLoginAdminVest } from '../../api/sys/sys-user-vest';
import { getAllSysUser } from '../../api/sys/sys-user';
import {
  VIDEO_PRIVACY_STATUS_LIST,
  VIDEO_STATUS_LIST
} from '../../utils/constants';
import VideoLikeLogDialog from './dialogs/VideoLikeLogDialog';
export default {
  name: 'video-info-page',

  components: {
    'edit-dialog': VideoInfoEditDialog,
    'create-dialog': VideoInfoCreateDialog,
    'topic-add-dialog': VideoInfoTopicAddDialog,
    'send-gift-log-dialog': VideoGiftSendLogDialog,
    'like-log-dialog': VideoLikeLogDialog
  },

  data() {
    return {
      operationBtns: {
        cancelHotConfirmBatch: {
          label: '批量取消热门视频',
          type: 'danger',
          needPerm: true,
          permission: 'user:info:delete',
          icon: 'fa fa-trash',
          enable: false,
          onClick: payload => {
            this.CancelHotConfirmBatch();
          }
        },
        deleteBatch: {
          label: '批量删除',
          type: 'danger',
          needPerm: true,
          permission: 'user:info:delete',
          icon: 'fa fa-trash',
          enable: false,
          onClick: payload => {
            this.deleteBatch();
          }
        },
        save: {
          label: '新增',
          type: 'success',
          needPerm: true,
          permission: 'video:info:save',
          icon: 'fa fa-plus',
          enable: true,
          onClick: payload => {
            this.showCreateDialog();
          }
        }
      },

      sysList: [],

      countryList: [],

      videoTypeList: [],

      videoTopicList: [],

      videoMusicList: [],

      videoStatusList: VIDEO_STATUS_LIST,

      videoPrivacyStatusList: VIDEO_PRIVACY_STATUS_LIST,

      selectedIds: [],

      loading: {
        table: true,
        select: {
          topic: false,
          music: false
        }
      },

      tableData: [],

      queryModel: {
        videoId: null,
        topicId: null,
        typeId: null,
        musicId: null,
        userId: '',
        nickname: '',
        username: '',
        country: null,
        vname: '',
        statues: null,
        isPrivate: null,
        source: null,
        hot: null,
        createTime: null,
        sysUserId: null,
        featured: null
      },

      pager: {
        page: 1,
        limit: 10,
        total: 0
      },

      sorter: {
        prop: null,
        order: null
      },

      defaultSorter: {
        prop: 'heatNum',
        order: 'descending'
      }
    };
  },

  filters: {
    parseTextIntro: function(introJsonStr) {
      let introArray = JSON.parse(introJsonStr);

      if (introArray && introArray.length > 0) {
        let textItem = introArray.filter(
          item => item.type === '1' || item.type === 1
        );
        if (textItem && textItem.length > 0) {
          return textItem[0].content;
        }
      }
      return '';
    },

    privacyStatus2TagType: function(privateStatus) {
      if (privateStatus === 1) {
        return 'success';
      } else if (privateStatus === 0) {
        return 'danger';
      } else {
        return 'info';
      }
    }
  },

  methods: {
    toCommentPage(row) {
      if (row.commentNum > 0) {
        this.$router.push({
          name: 'VideoCommentPage',
          query: {
            videoId: row.videoId
          }
        });
      }
    },

    showLikeLog(row) {
      this.$refs.logDialog.showDialog(row);
    },

    onTopicRemove(row, topicId, topicName) {
      this.$confirm(
        `此操作将移除所选择的视频话题 ${topicName} , 是否继续?`,
        '视频话题删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          removeVideoTopic(row.videoId, topicId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },

    showCreateDialog() {
      const userId =
        this.$store.state.user.userId | localStorage.getItem('userId');

      getAllLoginAdminVest(userId)
        .then(({ data }) => {
          if (data.list && data.list.length > 0) {
            this.$refs.createDialog.showDialog(data.list);
          } else {
            this.$message.error('没有可用的马甲账号, 请先添加马甲账号');
          }
        })
        .catch(error => {
          this.$message.error('无法获取关联的马甲账号');
        });
    },

    openTopicAddDialog(row) {
      this.$refs.topicAddDialog.showDialog(row);
    },

    toggleRowClassName({ row, rowIndex }) {
      if (row.hot === true) {
        return 'hot-video-row';
      } else {
        return '';
      }
    },

    openEditDialog(row) {
      this.$refs.editDialog.showDialog(row.videoId);
    },
    openSendGiftLogDialog(row) {
      this.$refs.sendGiftLogDialog.showDialog(row);
    },

    showMakeHotConfirm(row) {
      this.$confirm(
        `此操作将把用户 ${row.nickname} 在 ${
          row.createTime
        } 上传的视频设置为热门推荐, 是否继续?`,
        '推荐视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          makeVideoHot(row.videoId)
            .then(resp => {
              this.$message.success('推荐成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    showCancelHotConfirm(row) {
      this.$confirm(
        `此操作将取消用户 ${row.nickname} 在 ${
          row.createTime
        } 上传的视频的热门推荐, 是否继续?`,
        '取消推荐视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          cancelVideoHot(row.videoId)
            .then(resp => {
              this.$message.success('取消推荐成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    showMakeFeaturedConfirm(row) {
      this.$confirm(
        `此操作将把用户 ${row.nickname} 在 ${
          row.createTime
        } 上传的视频设置为精选视频, 是否继续?`,
        '设置精选视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          makeVideoFeatured(row.videoId)
            .then(resp => {
              this.$message.success('设置成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    showCancelFeaturedConfirm(row) {
      this.$confirm(
        `此操作将取消用户 ${row.nickname} 在 ${
          row.createTime
        } 上传的视频的精选状态, 是否继续?`,
        '取消精选视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          cancelVideoFeatured(row.videoId)
            .then(resp => {
              this.$message.success('取消成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    status2Description(status) {
      if (this.videoStatusList) {
        return this.videoStatusList.find(item => item.status === status)
          .description;
      }
      return '未知状态';
    },

    privacyStatus2Description(privacyStatus) {
      if (
        this.videoPrivacyStatusList &&
        this.videoPrivacyStatusList.length > 0
      ) {
        return this.videoPrivacyStatusList.find(
          item => item.status === privacyStatus
        ).description;
      }
      return '未知隐私状态';
    },

    source2Description(source) {
      if (this.videoSourceList && source) {
        return this.videoSourceList.find(item => item.source === source)
          .description;
      }
      return '未知来源';
    },

    remoteSearchVideoTopic: debounce(function(query) {
      // 搜索视频话题
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.topic = true;
      searchVideoTopicListByName(query.trim())
        .then(({ data }) => {
          this.videoTopicList = data.list;
          this.loading.select.topic = false;
        })
        .catch(error => {});
    }, 500),

    remoteSearchVideoMusic: debounce(function(query) {
      // 搜索音乐
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.music = true;
      searchMusicListByName(query.trim())
        .then(({ data }) => {
          this.videoMusicList = data.list;
          this.loading.select.music = false;
        })
        .catch(error => {});
    }, 500),

    showVideoPreviewDialog(row) {
      let options = {
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: row.url
          }
        ],
        poster: row.img
      };
      this.$refs.videoPreviewDialog.showDialog(options);
    },

    doDeleteSingle(row) {
      this.$confirm(
        `此操作将删除用户 ${row.nickname} 在 ${
          row.createTime
        } 发布的视频信息, 视频文件和封面图片文件也将一并删除且不可恢复, 是否继续?`,
        '视频信息删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteVideoInfo(row.videoId)
            .then(data => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },

    doFreezeSingle(row) {
      this.$confirm(
        `确定要冻结用户 ${row.nickname} 在 ${row.createTime} 发布的视频?`,
        '视频信息冻结',
        {
          type: 'warning'
        }
      )
        .then(() => {
          freezeVideoInfo(row.videoId)
            .then(data => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },

    doUnfreezeSingle(row) {
      this.$confirm(
        `确定要解冻用户 ${row.nickname} 在 ${row.createTime} 发布的视频 ?`,
        '视频信息解冻',
        {
          type: 'warning'
        }
      )
        .then(() => {
          unfreezeVideoInfo(row.videoId)
            .then(data => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },

    deleteBatch() {
      this.$confirm(
        `此操作将删除所选择的视频信息, 视频文件和封面图片文件也将一并删除且不可恢复, 是否继续?`,
        '视频信息批量删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteVideoInfo(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },

    CancelHotConfirmBatch() {
      this.$confirm(
        `此操作将取消所选中的视频的热门推荐, 是否继续?`,
        '取消推荐视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          DoCancelHotConfirm(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },

    freezeBatch() {
      this.$confirm(`确定要批量冻结选中的视频信息?`, '视频信息批量冻结', {
        type: 'warning'
      })
        .then(() => {
          freezeVideoInfo(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },

    unfreezeBatch() {
      this.$confirm(`确定要批量解冻选中的视频信息?`, '视频信息批量解冻', {
        type: 'warning'
      })
        .then(() => {
          unfreezeVideoInfo(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },

    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },

    onSelectionChange(rows) {
      if (rows && rows.length > 0) {
        this.operationBtns.deleteBatch.enable = true;
        this.operationBtns.cancelHotConfirmBatch.enable = true;
        this.selectedIds = rows.map(data => data.videoId);
      } else {
        this.operationBtns.deleteBatch.enable = false;
        this.operationBtns.cancelHotConfirmBatch.enable = false;
      }
    },

    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },

    query() {
      this.loading.table = true;
      this.getTableData();
    },

    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table = true;
      this.getTableData();
    },

    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },

    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getVideoInfoList({
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

    initVideoTypeSelectData() {
      getAllVideoType()
        .then(({ data }) => {
          this.videoTypeList = data.list;
        })
        .catch(msg => {});
    },

    initCountryInfoSelectData() {
      getAllCountryInfo()
        .then(({ data }) => {
          this.countryList = data.list;
        })
        .catch(errorMsg => {});
    },
    initGetALLSysSelectData() {
      getAllSysUser()
        .then(({ data }) => {
          this.sysList = data.list;
        })
        .catch(errorMsg => {});
    }
  },

  created() {
    this.initGetALLSysSelectData();
    this.initCountryInfoSelectData();
    this.initVideoTypeSelectData();
    this.getTableData();
  }
};
</script>

<style>
.el-table .hot-video-row {
  background: #ffebeb;
}
.cursor-pointer {
  cursor: pointer;
}
.color-red {
  color: red;
}
.color-blue {
  color: blue;
}
</style>
