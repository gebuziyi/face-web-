<template>
  <div>
    <div>
      <span class="position"  style="font-size:25px;font-weight:bold">腾讯云脏字管理</span>
    <!-- 批量删除按钮 -->
     <!-- 如果没有选择任何一行, 则按钮无效 -->
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('gift:info:delete')" class="btn-operation1" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    <el-button @click="openCreateDialog" type="success" size="small"  class="btn-operation" >
        <i class="fa fa-plus"></i>
        <span>新增脏字</span>
    </el-button>
    </div>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 95%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange"  @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="dirtyWord" label="腾讯云脏字" show-overflow-tooltip>
      </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
         <!-- 创建系统参数 -->
    <el-dialog :visible.sync="dialog.create.show" title="新增脏字" width="600px">
      <span>
        <font color="red" size="2.5px">*批量新增,中间加英文逗号-例如
          <span>
          <font size="5px" color="#000000">(ok,yeah,beach,yes,I`m)</font>
          </span>
        </font>
      </span>
      <p class="text">*脏字不能超过 50 个</p>
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="脏字名称" prop="dirtyWord">
            <el-input v-model.trim="dialog.create.model.dirtyWord"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createNewWords,
  postDirtyWords,
  removeSysConfig
} from '../../../api/sys/sys-repair';
import { tencentCloud } from '../../../utils/empty-model';

export default {
  name: 'sys-config-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        create: {
          model: tencentCloud(),
          rules: {
            dirtyWord: [
              { required: true, trigger: 'change', message: '脏字不能为空' }
            ]
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
        sname: null,
        del: null
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
        this.selectedIds = rows.map(data => data.dirtyWord);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的列表', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysConfig(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.$emit('done');
              // this.getTableData();
              this.initGetALLSysSelectData();
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
          createNewWords(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
              this.$emit('done');
              this.dialog.create.btnLoading = false;
              this.dialog.create.show = false;
              this.initGetALLSysSelectData();
              // this.getTableData();
            })
            .catch(errorMsg => {});
        } else {
          return false;
        }
      });
    },
    doDeleteSingle(row) {
      this.$confirm('此操作将删除脏字: ' + row.dirtyWord, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysConfig(row.dirtyWord)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.$emit('done');
              // this.getTableData();
              this.initGetALLSysSelectData();
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
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    initGetALLSysSelectData() {
      postDirtyWords()
        .then(({ data }) => {
          let dirtyWordsList = JSON.parse(data.list).DirtyWordsList;
          this.tableData = dirtyWordsList.map(word => {
            return {
              dirtyWord: word
            };
          });
          this.loading.table = false;
          console.log(this.tableData);
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initGetALLSysSelectData();
  }
};
</script>

<style scoped>
.text{
  color: red;
}
.activity-form {
  margin-top: 20px;
  width: 60%;
  min-height: 300px;
}
.activity-form-wrapper {
  border-bottom: 1px solid #dcdfe6;
}
.tab-wrapper {
  margin-top: 10px;
}
.tab-wrapper h4 {
  color: grey;
  margin-bottom: 10px;
}
.btn-operation{
  float: right;
  /* margin-right:80px; */
}
.btn-operation1{
  float: right;
  margin-right:110px;
}
.position{
  float: left;
  height:80px;
}
</style>
