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
      <el-form-item prop="type">
        <el-select v-model="queryModel.type" placeholder="朋友圈类型" clearable>
          <el-option v-for="(item, index) in friendRingTypeList" :key="index" :value="item.type" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="shield">
        <el-select v-model="queryModel.shield" placeholder="屏蔽类型" clearable>
          <el-option v-for="(item, index) in shieldTypeList" :key="index" :value="item.type" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="checked">
        <el-select v-model="queryModel.checked" placeholder="审核状态" clearable>
          <el-option :value="0" label="未通过"></el-option>
          <el-option :value="1" label="审核通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发布时间" end-placeholder="发布时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('friend:ring:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="friendId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="content" label="文字内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="发布地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="发布时间"></el-table-column>
      <el-table-column prop="likeNum" label="点赞数" sortable="custom"></el-table-column>
      <el-table-column prop="type" label="朋友圈类型">
        <template slot-scope="scope">
          <el-tag :type="type2IconTagOption(scope.row.type).tagType" size="mini">
            <i :class="type2IconTagOption(scope.row.type).iconClass" style="padding-right: 0.5em"></i>
            <span>{{ type2IconTagOption(scope.row.type).description }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shield" label="屏蔽类型">
        <template slot-scope="scope">
          <el-tag size="mini" type="info">{{ shield2IconTagOption(scope.row.shield).description }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="checked" label="审核状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.checked === true ? 'success' : 'danger'">
            {{ scope.row.checked === true ? '审核通过' : '未通过'}}
          </icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="更多信息" placement="top" v-if="hasPermission('friend:ring:list')">
              <el-button type="info" size="mini" @click="openDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核不通过" placement="top" v-if="hasPermission('friend:ring:check') && scope.row.checked === true">
              <el-button type="warning" size="mini" @click="doCheckFailed(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('friend:ring:delete')">
              <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
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
    <!-- 弹窗 -->
    <!-- 查看用户更多详情 -->
    <el-dialog :visible.sync="dialog.detail.show" :title="`${dialog.detail.username}, ${dialog.detail.createTime} 朋友圈详情: `" width="1000px">
      <div v-loading="dialog.detail.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
          <el-form-item label="文字内容">
            <span class="detail-span" v-text="dialog.detail.content" v-if="dialog.detail.content !== ''"></span>
            <el-tag type="warning" size="mini" v-else>无文字内容</el-tag>
          </el-form-item>
          <!-- 轮播图 -->
          <el-form-item label="图片列表" v-if="dialog.detail.type === 1">
            <el-carousel :interval="4000" height="300px">
              <el-carousel-item v-for="(item, index) in dialog.detail.model.fileList" :key="index" class="pic-bg">
                <img :src="item.fileUrl" class="friend-ring-pic-item" />
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
          <el-form-item label="视频文件" v-if="dialog.detail.type === 2">
            <video :src="dialog.detail.model.fileList[0].fileUrl" class="friend-ring-video-item" controls />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialog.detail.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFriendRingList,
  checkFailed,
  getFileListByFriendId,
  getAllShieldType,
  getAllFriendRingType,
  removeFriendRing
} from '../../api/friend/friend-ring';

export default {
  name: 'friend-ring-page',
  data() {
    return {
      selectedIds: [],
      friendRingTypeList: [],
      shieldTypeList: [],
      dialog: {
        detail: {
          username: null,
          createTime: null,
          content: null,
          type: null,
          model: {
            fileList: []
          },
          show: false,
          formLoading: true,
          btnLoading: false
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
        type: null,
        shield: null,
        checked: null,
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
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.friendId);
      }
    },
    deleteBatch() {
      this.$confirm('是否删除所选择的朋友圈信息(相关的评论&回复&点赞以及图片或视频文件也将一并删除, 无法恢复)', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeFriendRing(this.selectedIds)
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
    doDeleteSingle(row) {
      this.$confirm(
        `是否删除用户: ${row.nickname} 在 ${
          row.createTime
        } 发布的朋友圈信息(相关的评论&回复&点赞以及图片或视频文件也将一并删除, 无法恢复)?`,
        '删除朋友圈信息',
        {
          type: 'warning'
        }
      )
        .then(() => {
          removeFriendRing(row.friendId)
            .then(resp => {
              this.query();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    shield2IconTagOption(shield) {
      let result = {
        shield: null,
        description: null
      };
      let temp = this.shieldTypeList.find(item => item.type === shield);

      if (temp) {
        return temp;
      }

      result.shield = shield;
      result.description = '未知类型';

      return result;
    },
    type2IconTagOption(type) {
      let result = {
        type: null,
        description: null,
        tagType: null,
        iconClass: null
      };
      let temp = this.friendRingTypeList.find(item => item.type === type);

      if (temp === null || typeof temp === 'undefined') {
        result.description = '未知类型';
        result.type = type;
        return result;
      }

      if (type === 3) {
        result.tagType = 'info';
        result.iconClass = 'fa fa-font';
      } else if (type === 1) {
        result.tagType = '';
        result.iconClass = 'fa fa-picture-o';
      } else {
        result.tagType = 'success';
        result.iconClass = 'fa fa-video-camera';
      }

      result.type = temp.type;
      result.description = temp.description;

      return result;
    },
    doCheckFailed(row) {
      this.$confirm(
        `此操作将屏蔽用户 ${row.username} 在 ${
          row.createTime
        } 发表的朋友圈, 是否继续?`,
        '屏蔽朋友圈',
        {
          type: 'warning'
        }
      )
        .then(() => {
          checkFailed(row.friendId)
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
    openDetailDialog(row) {
      this.dialog.detail.username = row.username;
      this.dialog.detail.createTime = row.createTime;
      this.dialog.detail.type = row.type;
      this.dialog.detail.content = row.content;

      // type = 3为纯文字, 无需获取文件列表
      if (row.type === 3) {
        this.dialog.detail.show = true;
      } else {
        this.dialog.detail.formLoading = true;
        getFileListByFriendId(row.friendId)
          .then(({ data }) => {
            this.dialog.detail.model.fileList = data.list;
            this.dialog.detail.formLoading = false;
            this.dialog.detail.show = true;
          })
          .catch(error => {
            this.$message.error('无法获取朋友圈对应的文件(图片/视频)列表');
            this.dialog.detail.show = false;
          });
      }
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
      getFriendRingList({
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
    initFriendRingTypeList() {
      getAllFriendRingType()
        .then(({ data }) => {
          this.friendRingTypeList = data.list;
        })
        .catch(error => {
          this.$message.error('无法获取朋友圈类型列表');
        });
    },
    initShieldTypeList() {
      getAllShieldType()
        .then(({ data }) => {
          this.shieldTypeList = data.list;
        })
        .catch(error => {
          this.$message.error('无法获取屏蔽类型列表');
        });
    }
  },
  created() {
    this.initFriendRingTypeList();
    this.initShieldTypeList();
    this.getTableData();
  }
};
</script>

<style scoped>
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
.pic-bg {
  background-color: gray;
}
.friend-ring-pic-item {
  display: block;
  margin: auto auto;
  height: 100%;
  max-height: 300px;
}
.friend-ring-video-item {
  display: block;
  margin: auto auto;
  width: 100%;
  max-width: 400px;
}
</style>
