<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="name">
        <el-input v-model.trim="queryModel.name" placeholder="挂饰名称"></el-input>
      </el-form-item>
     <el-form-item prop="isDeleted">
        <el-select v-model="queryModel.isDeleted" clearable placeholder="状态">
          <el-option :value="0" label="未删除"></el-option>
          <el-option :value="1" label="已删除"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('gift:type:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('gift:type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="挂件名称"></el-table-column>
       <el-table-column prop="introduction" label="挂件介绍"></el-table-column>
      <el-table-column prop="url" label="挂件图片">
         <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.url" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="挂件优先级"></el-table-column>
      <el-table-column prop="module" label="挂饰所属模块">
        <template slot-scope="scope">
            <option v-if="scope.row.module ===1">直播</option>
            <option v-if="scope.row.module ===2">短视频</option>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="username" label="创建人" ></el-table-column>
      <el-table-column prop="editTime" label="修改时间" ></el-table-column>
      <el-table-column prop="editname" label="修改人" ></el-table-column>
      <el-table-column prop="isDeleted" label="状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.isDeleted === 0">正常</icon-tag>
          <icon-tag type="warning" v-if="scope.row.isDeleted === 1">已删除</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('gift:type:update') && scope.row.isDeleted === 1 === false" >
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
            </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('gift:type:delete') && scope.row.isDeleted === 1 === false">
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
    <!-- 修改礼品类型 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改礼品类型" width="1000px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="200px" ref="editForm">
            <el-form-item label="挂件名称" prop="name">
            <el-input v-model.trim="dialog.edit.model.name"></el-input>
          </el-form-item>
           <el-form-item label="挂件介绍" prop="introduction">
            <el-input type="textarea" v-model.trim="dialog.edit.model.introduction"></el-input>
          </el-form-item>
           <el-form-item label="挂件优先级" prop="priority">
            <el-input-number v-model.trim="dialog.edit.model.priority" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item  label="挂饰所属模块">
                <option v-if="dialog.edit.model.module ===1">直播</option>
                <option v-if="dialog.edit.model.module ===2">短视频</option>
          </el-form-item>
          <el-form-item label="头像挂饰图片">
            <el-upload :action="dialog.edit.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建礼品类型 -->
    <el-dialog :visible.sync="dialog.create.show" title="新增挂饰" width="1000px">
      <div v-loading="dialog.create.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="200px" ref="createForm">
          <el-form-item label="挂件名称" prop="name">
            <el-input v-model.trim="dialog.create.model.name"></el-input>
          </el-form-item>
          <el-form-item label="挂件介绍" prop="introduction">
            <el-input type="textarea" v-model.trim="dialog.create.model.introduction"></el-input>
          </el-form-item>
          <el-form-item label="挂件优先级" prop="priority">
            <el-input-number v-model.trim="dialog.create.model.priority" :min="1"></el-input-number>
          </el-form-item>
       <el-form-item label="挂饰所属模块" prop="module">
        <el-select  v-model="dialog.create.model.module" clearable placeholder="挂饰所属模块">
          <el-option :value="1" label="直播">直播</el-option>
          <el-option :value="2" label="短视频">短视频</el-option>
        </el-select>
      </el-form-item>
          <el-form-item label="头像挂饰图片" prop="url">
            <el-upload :action="dialog.create.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
              <el-button size="small" type="primary">点击选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'头像图片预览: '">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  getDetail,
  update,
  remove,
  create
} from '../../api/user/avatar-accessory-info';

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
        edit: {
          model: emptyUserAvatarAccessory(),
          rules: {
            name: [
              { required: true, trigger: 'change', message: '挂饰名称不能为空' }
            ],
            url: [
              { required: true, trigger: 'change', message: '挂饰图片不能为空' }
            ],
            introduction: [
              { required: true, trigger: 'change', message: '挂饰介绍不能为空' }
            ],
            priority: [
              { required: true, trigger: 'change', message: '挂饰优先级不能为空' }
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
            new Date().getTime(),
          // 上传文件时请求的header
          headers: {
            token: token
          }
        },
        create: {
          model: emptyUserAvatarAccessory(),
          rules: {
            name: [
              { required: true, trigger: 'change', message: '挂饰名称不能为空' }
            ],
            url: [
              { required: true, trigger: 'change', message: '挂饰图片不能为空' }
            ],
            introduction: [
              { required: true, trigger: 'change', message: '挂饰介绍不能为空' }
            ],
            priority: [
              { required: true, trigger: 'change', message: '挂饰优先级不能为空' }
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
        name: null,
        isDeleted: null
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
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          create(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
              this.$refs['create-upload'].clearFiles();
              this.dialog.create.btnLoading = false;
              this.dialog.create.show = false;
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
    deleteSingleGift(row) {
      this.$confirm('此操作将删除此挂饰: ' + row.name, '删除确认')
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
        if (this.dialog.create.show === true) {
          this.$refs['create-upload'].clearFiles();
          this.dialog.create.model.url = null;
          this.imgFileList = [];
        } else {
          this.imgFileList = [].concat({ url: this.dialog.edit.model.url });
        }
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      if (this.dialog.edit.show === true) {
        this.dialog.edit.model.url = response;
      } else {
        this.dialog.create.model.url = response;
      }
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!')
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
          update(this.dialog.edit.model)
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
      getDetail(row.id)
        .then(({ data }) => {
          this.dialog.edit.model = data.list;
          this.imgFileList = [].concat({ url: data.list.url });
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
      this.dialog.create.model = emptyUserAvatarAccessory();
      this.imgFileList = [];
      getList({
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
