<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="groupName">
        <el-input v-model.trim="queryModel.groupName" placeholder="群组名称"></el-input>
      </el-form-item>
      <el-form-item prop="imId">
        <el-input v-model.trim="queryModel.imId" placeholder="IM ID"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="群主用户名"></el-input>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="群组类型" clearable>
          <el-option v-for="(item, index) in groupTypeList" :key="index" :value="item.groupTypeId" :label="item.groupTypeName"></el-option>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('im:group-info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="newsletterId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="imId" label="群组IM ID"></el-table-column>
      <el-table-column prop="groupName" label="群组名称"></el-table-column>
      <el-table-column prop="img" label="群头像">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="activity" label="活跃度" sortable="custom"></el-table-column>
      <el-table-column prop="username" label="群主用户名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="groupTypeName" label="群组类型"></el-table-column>
      <el-table-column prop="introduction" label="群简介" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="cements" label="群公告" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="shutUpAllMember" label="禁言状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.shutUpAllMember === 'Off' ? 'success' : 'danger'">{{ scope.row.shutUpAllMember === 'Off' ? '未禁言' : '全体禁言' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('im:group-info:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('im:group-info:delete')">
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
    <!-- 修改群组信息 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改群组信息" width="600px" @close="onDialogClose($refs.editForm)">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="群组名称" prop="groupName">
            <el-input v-model.trim="dialog.edit.model.groupName"></el-input>
          </el-form-item>
          <el-form-item label="群头像" prop="img">
            <el-upload :action="dialog.edit.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="群公告" prop="cements">
            <el-input v-model.trim="dialog.edit.model.cements" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="群简介" prop="introduction">
            <el-input v-model.trim="dialog.edit.model.introduction" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="活跃度" prop="activity">
            <el-input-number v-model="dialog.edit.model.activity" placeholder="群组活跃度: 0-100" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="禁言状态" prop="shutUpAllMember">
            <el-switch style="display: block" v-model="dialog.edit.model.shutUpAllMember" active-color="#13ce66" inactive-color="#ff4949" active-text="不禁言" inactive-text="全体禁言" :active-value="'Off'" :inactive-value="'On'">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'群头像图片预览: ' + dialog.picPreview.groupName">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupInfoList,
  getGroupInfoDetail,
  updateGroupInfo,
  removeGroupInfo
} from '../../api/im/group-info';
import { getAllGroupType } from '../../api/im/group-type';

import { emptyGroupInfo } from '../../utils/empty-model';

export default {
  name: 'group-info-page',
  data() {
    const token = this.$store.state.user.token;
    return {
      groupTypeList: [],
      imgFileList: [],
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          groupName: null
        },
        edit: {
          model: emptyGroupInfo(),
          rules: {
            groupName: [
              {
                required: true,
                trigger: 'change',
                message: '群组名称不能为空'
              }
            ],
            img: [
              {
                required: true,
                trigger: 'change',
                message: '群头像图片不能为空'
              }
            ],
            shutUpAllMember: [
              { required: true, trigger: 'change', message: '禁言状态不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false,
          // 文件上传的url
          uploadAction:
            '/faceshow-admin/api/fileupload?token=' +
            token +
            '&temp=' +
            new Date().getTime()
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        groupName: null,
        imId: null,
        username: null,
        typeId: null,
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
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.groupName = row.groupName;
      this.dialog.picPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.newsletterId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除(解散)所选择的群组', '群组批量删除(解散)确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeGroupInfo(this.selectedIds)
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
    deleteSingleGift(row) {
      this.$confirm(
        '此操作将删除(解散)群组: ' + row.groupName,
        '群组删除(解散)确认'
      )
        .then(() => {
          this.loading.table = true;
          removeGroupInfo(row.newsletterId)
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
      this.dialog.create.show = true;
    },
    onFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.$message({
        type: 'warning',
        message: '图片文件不可为空!'
      });
      return false;
    },
    onUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '图片上传失败: ' + response.msg
        });

        this.imgFileList = [].concat({ url: this.dialog.edit.model.img });

        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.dialog.edit.model.img = response;

      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '新图片上传失败!'
      });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateGroupInfo(this.dialog.edit.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.edit.btnLoading = false;
              this.dialog.edit.show = false;
              this.getTableData();
            })
            .catch(error => {
              // do something
            });
        } else {
          return false;
        }
      });
    },
    openEditDialog(row) {
      // 打开对话框
      this.dialog.edit.show = true;
      getGroupInfoDetail(row.newsletterId)
        .then(({ data }) => {
          this.dialog.edit.model = data.group;
          this.imgFileList = [].concat({ url: data.group.img });
          // 取消对话框表单loading状态
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {});
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
      getGroupInfoList({
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
    initGroupTypeSelectData() {
      getAllGroupType()
        .then(({ data }) => {
          this.groupTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initGroupTypeSelectData();
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
  max-width: 600px;
  max-height: 600px;
  margin: auto auto;
}

.icon-color-fire {
  color: #e21d0f;
  padding-right: 0.25em;
}
</style>
