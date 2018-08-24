<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="typeName">
        <el-input v-model.trim="queryModel.typeName" placeholder="群组类型名称"></el-input>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('im:group-type:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('im:group-type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="typeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="typeName" label="类型名称"></el-table-column>
      <el-table-column prop="typeImg" label="类型图片">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.typeImg" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="heatRe" label="热度值"  sortable="custom">
        <template slot-scope="scope">
          <i class="fa fa-fire icon-color-fire"></i>
          <span>{{ scope.row.heatRe }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('im:group-type:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('im:group-type:delete')">
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
    <!-- 修改群组类型 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改群组类型" width="600px" @close="onDialogClose($refs.editForm)">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="群组类型名称" prop="typeName">
            <el-input v-model.trim="dialog.edit.model.typeName"></el-input>
          </el-form-item>
          <el-form-item label="群组类型图片" prop="typeImg">
            <el-upload :action="dialog.edit.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="热度值" prop="heatRe">
            <el-input-number v-model="dialog.edit.model.heatRe" placeholder="群组热度值: 0-100" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建群组类型 -->
    <el-dialog :visible.sync="dialog.create.show" title="新增群组类型" width="600px" @close="onDialogClose($refs.createForm)">
      <div v-loading="dialog.create.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="120px" ref="createForm">
          <el-form-item label="群组类型名称" prop="typeName">
            <el-input v-model.trim="dialog.create.model.typeName"></el-input>
          </el-form-item>
          <el-form-item label="群组类型图片" prop="typeImg">
            <el-upload :action="dialog.create.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="热度值" prop="heatRe">
            <el-input-number v-model="dialog.create.model.heatRe" placeholder="群组热度值: 0-100" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="'群组类型图片预览: ' + dialog.picPreview.typeName">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupTypeList,
  getGroupTypeDetail,
  updateGroupType,
  removeGroupType,
  createGroupType
} from '../../api/im/group-type';

import { emptyGroupType } from '../../utils/empty-model';

export default {
  name: 'group-type-page',
  data() {
    const token = this.$store.state.user.token;
    return {
      imgFileList: [],
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          typeName: null
        },
        edit: {
          model: emptyGroupType(),
          rules: {
            typeName: [
              {
                required: true,
                trigger: 'change',
                message: '群组类型名称不能为空'
              }
            ],
            typeImg: [
              {
                required: true,
                trigger: 'change',
                message: '群组类型图片不能为空'
              }
            ],
            heatRe: [
              { required: true, trigger: 'change', message: '热度值不能为空' }
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
        },
        create: {
          model: emptyGroupType(),
          rules: {
            typeName: [
              {
                required: true,
                trigger: 'change',
                message: '群组类型名称不能为空'
              }
            ],
            typeImg: [
              {
                required: true,
                trigger: 'change',
                message: '群组类型图片不能为空'
              }
            ],
            heatRe: [
              { required: true, trigger: 'change', message: '热度值不能为空' }
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
        typeName: null,
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
      this.dialog.picPreview.picSrc = row.typeImg;
      this.dialog.picPreview.typeName = row.typeName;
      this.dialog.picPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.typeId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的群组类型', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeGroupType(this.selectedIds)
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
          createGroupType(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
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
      this.$confirm('此操作将删除群组类型: ' + row.gname, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeGroupType(row.typeId)
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
          this.dialog.create.model.typeImg = null;
          this.imgFileList = [];
        } else {
          this.imgFileList = [].concat({ url: this.dialog.edit.model.typeImg });
        }
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      if (this.dialog.edit.show === true) {
        this.dialog.edit.model.typeImg = response;
      } else {
        this.dialog.create.model.typeImg = response;
      }
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
          updateGroupType(this.dialog.edit.model)
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
      getGroupTypeDetail(row.typeId)
        .then(({ data }) => {
          this.dialog.edit.model = data.type;
          this.imgFileList = [].concat({ url: data.type.typeImg });
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
      this.dialog.create.model = emptyGroupType();
      this.imgFileList = [];
      getGroupTypeList({
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
.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
}

.img-preview {
  display: block;
  margin: auto auto;
}

.icon-color-fire {
  color: #e21d0f;
  padding-right: 0.25em
}
</style>
