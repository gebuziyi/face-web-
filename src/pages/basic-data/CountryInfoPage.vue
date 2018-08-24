<template>
  <div>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="coding">
        <el-input v-model.trim="queryModel.coding" placeholder="2字母国家代码(CN,US,...)"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('country:info:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="countryId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="logo" label="国旗">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.logo" class="logo-thumb" @click="showLogoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="名称"></el-table-column>
      <el-table-column prop="coding" label="国家代码(2字母)"></el-table-column>
      <el-table-column prop="codingISO" label="国家代码(3字母)"></el-table-column>
      <el-table-column prop="countryNum" label="电话区号"></el-table-column>
      <el-table-column prop="language" label="语言"></el-table-column>
      <el-table-column prop="memo" label="描述"></el-table-column>
      <el-table-column prop="nums" label="排序值"></el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('country:info:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="停用" placement="top" v-if="hasPermission('country:info:disable')">
              <el-button type="danger" size="mini" @click="disableSingleCountry(scope.row)">
                <i class="fa fa-ban"></i>
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
    <!-- 修改国家信息 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改国家信息" width="800px" @close="onDialogClose">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="130px" ref="editForm">
          <el-form-item label="国家名称" prop="cname">
            <el-input v-model.trim="dialog.edit.model.cname"></el-input>
          </el-form-item>
          <el-form-item label="国家代码(2字母)" prop="coding">
            <el-input v-model.trim="dialog.edit.model.coding"></el-input>
          </el-form-item>
          <el-form-item label="国家代码(3字母)" prop="codingISO">
            <el-input v-model.trim="dialog.edit.model.codingISO"></el-input>
          </el-form-item>
          <el-form-item label="电话区号" prop="countryNum">
            <el-input v-model.trim="dialog.edit.model.countryNum"></el-input>
          </el-form-item>
          <el-form-item label="语言" prop="language">
            <el-input v-model.trim="dialog.edit.model.language"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="memo">
            <el-input v-model.trim="dialog.edit.model.memo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="国旗图片">
            <el-upload :action="dialog.edit.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="排序值" prop="nums">
            <el-input-number v-model="dialog.edit.model.nums" :min="0" :step="1" :max="999"></el-input-number>
            <span style="padding-left: 1em; color: grey;">0-999, 数值越大越靠前</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建国家信息 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建国家信息" width="800px" @close="onDialogClose">
      <div v-loading="dialog.create.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="130px" ref="createForm">
          <el-form-item label="国家名称" prop="cname">
            <el-input v-model.trim="dialog.create.model.cname"></el-input>
          </el-form-item>
          <el-form-item label="国家代码(2字母)" prop="coding">
            <el-input v-model.trim="dialog.create.model.coding"></el-input>
          </el-form-item>
          <el-form-item label="国家代码(3字母)" prop="codingISO">
            <el-input v-model.trim="dialog.create.model.codingISO"></el-input>
          </el-form-item>
          <el-form-item label="电话区号" prop="countryNum">
            <el-input v-model.trim="dialog.create.model.countryNum"></el-input>
          </el-form-item>
          <el-form-item label="语言" prop="language">
            <el-input v-model.trim="dialog.create.model.language"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="memo">
            <el-input v-model.trim="dialog.create.model.memo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="国旗图片" prop="logo">
            <el-upload :action="dialog.create.uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
              <el-button size="small" type="primary">点击选择新图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="排序值" prop="nums">
            <el-input-number v-model="dialog.create.model.nums" :min="0" :step="1" :max="999"></el-input-number>
            <span style="padding-left: 1em; color: grey;">0-999, 数值越大越靠前</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 国旗图片预览 -->
    <el-dialog :visible.sync="dialog.logoPreview.show" :title="'国旗图片预览: ' + dialog.logoPreview.countryName">
      <img :src="dialog.logoPreview.logoSrc" class="logo-preview" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getCountryInfoList,
  getCountryInfoDetail,
  updateCountryInfo,
  createCountryInfo,
  disableCountryInfo
} from '../../api/basic-data/country-info';

import { emptyCountryInfo } from '../../utils/empty-model';
import {
  isCountryNumValid,
  isCountryCodeValid,
  isCountryCodeIsoValid
} from '../../utils/coding-utils';

export default {
  name: 'country-info-page',
  data() {
    const token = this.$store.state.user.token;
    const countryNumValidator = (rule, value, callback) => {
      if (!isCountryNumValid(value)) {
        callback(new Error('请输入正确, 合法的电话区号'));
      } else {
        callback();
      }
    };

    const countryCodeValidator = (rule, value, callback) => {
      if (!isCountryCodeValid(value)) {
        callback(new Error('请输入正确, 合法的2(大写)字母国家代码'));
      } else {
        callback();
      }
    };

    const countryCodeIsoValidator = (rule, value, callback) => {
      if (value && value.length > 0 && !isCountryCodeIsoValid(value)) {
        callback(new Error('请输入正确, 合法的3(大写)字母国家代码'));
      } else {
        callback();
      }
    };

    return {
      imgFileList: [],
      dialog: {
        logoPreview: {
          show: false,
          logoSrc: null,
          countryName: ''
        },
        edit: {
          model: emptyCountryInfo(),
          rules: {
            cname: [
              { required: true, trigger: 'change', message: '国家名称不能为空' }
            ],
            countryNum: [
              {
                required: true,
                trigger: 'change',
                message: '国际电话区号不能为空'
              },
              {
                validator: countryNumValidator,
                triggger: 'change'
              }
            ],
            coding: [
              {
                required: true,
                validator: countryCodeValidator,
                triggger: 'change'
              }
            ],
            codingISO: [
              {
                validator: countryCodeIsoValidator,
                triggger: 'change'
              }
            ],
            language: [
              { required: true, trigger: 'change', message: '语言不能为空' }
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
          model: emptyCountryInfo(),
          rules: {
            cname: [
              { required: true, trigger: 'change', message: '国家名称不能为空' }
            ],
            logo: [
              { required: true, trigger: 'blur', message: '国旗图片不能为空' }
            ],
            coding: [
              {
                required: true,
                validator: countryCodeValidator,
                triggger: 'change'
              }
            ],
            codingISO: [
              {
                validator: countryCodeIsoValidator,
                triggger: 'change'
              }
            ],
            countryNum: [
              {
                required: true,
                trigger: 'change',
                message: '国际电话区号不能为空'
              },
              {
                validator: countryNumValidator,
                triggger: 'change'
              }
            ],
            language: [
              { required: true, trigger: 'change', message: '语言不能为空' }
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
        coding: null
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
    disableSingleCountry(row) {
      this.$confirm(
        `此操作将停用国家信息: ${
          row.cname
        }, 是否继续?`,
        '停用国家信息',
        {
          type: 'warning'
        }
      )
        .then(() => {
          disableCountryInfo(row.countryId)
            .then(resp => {
              this.$message.success(`国家信息: ${row.cname} 已停用`);
              this.query();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onDialogClose() {
      this.imgFileList = [];
    },
    showLogoPreviewDialog(row) {
      this.dialog.logoPreview.logoSrc = row.logo;
      this.dialog.logoPreview.countryName = row.cname;
      this.dialog.logoPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createCountryInfo(this.dialog.create.model)
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
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    onFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      if (fileList && fileList.length <= 1) {
        this.$message({
          type: 'warning',
          message: '图片文件不可为空!'
        });
        return false;
      }
      return true;
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
          this.dialog.create.model.logo = null;
          this.imgFileList = [];
        } else {
          this.imgFileList = [].concat({ url: this.dialog.edit.model.logo });
        }
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的logo属性值
      if (this.dialog.edit.show === true) {
        this.dialog.edit.model.logo = response;
      } else {
        this.dialog.create.model.logo = response;
      }
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      });
      this.$refs['create-upload'].clearFiles();
      if (this.dialog.create.show === true) {
        this.dialog.create.model.logo = null;
      }
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateCountryInfo(this.dialog.edit.model)
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
      getCountryInfoDetail(row.countryId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          this.imgFileList = [].concat({ url: data.detail.logo });
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
      this.dialog.create.model = emptyCountryInfo();
      this.imgFileList = [];
      getCountryInfoList({
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
.logo-thumb {
  cursor: pointer;
  width: 60px;
  height: 60px;
  overflow: hidden;
}

.logo-preview {
  display: block;
  margin: auto auto;
  width: 50%;
}
</style>
