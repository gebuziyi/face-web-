<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <!-- 礼品名称 -->
      <el-form-item prop="gname">
        <el-input v-model.trim="queryModel.gname" placeholder="礼品名称"></el-input>
      </el-form-item>
      <!-- 礼品类型 -->
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" clearable placeholder="礼品类型">
          <template v-for="(type, index) in musicTypes">
            <el-option :label="type.gname" :value="type.typeId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <!-- 礼品价格区间 -->
      <el-form-item prop="priceStart">
        <!-- 如果用el-button-number, 则无法显示占位符 -->
        <el-input v-model="queryModel.priceStart" placeholder="起始价格(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="priceEnd">
        <el-input v-model="queryModel.priceEnd" placeholder="终止价格(含)" type="number"></el-input>
      </el-form-item>
      <!-- 创建时间区间 -->
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>

    </el-form>
    <!-- 查询表单 end-->
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <!-- 批量删除按钮 -->
      <!-- 如果没有选择任何一行, 则按钮无效 -->
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('gift:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <!-- 新增礼品信息按钮 -->
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('gift:info:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="giftId" label="ID" sortable></el-table-column>
      <el-table-column prop="gname" label="礼品名称"></el-table-column>
      <el-table-column prop="typeName" label="礼品类型"></el-table-column>
      <el-table-column prop="price" label="礼品价格" sortable="custom"></el-table-column>
      <el-table-column prop="img" label="礼品图片">
        <template slot-scope="scope">
          <table-img-previewer :option="scope.row | row2ImgPreviewOption"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="exclusive" label="等级专属">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.exclusive === true">{{ scope.row.levelId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="disabled" label="礼品状态">
        <template slot-scope="scope">
          <el-tag size="small" type="success" v-if="scope.row.disabled === 1">正在使用</el-tag>
          <el-tag size="small" type="warning" v-else>已经停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('gift:info:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.giftId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <!-- 移除删除按钮, 防止误操作 -->
            <el-tooltip class="item" effect="dark" content="停用" placement="top" v-if="scope.row.disabled === 1">
              <el-button type="danger" size="mini" @click="disableSingleGift(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="启用" placement="top" v-if="scope.row.disabled === 0">
              <el-button type="success" size="mini" @click="doEnableSingleGift(scope.row)">
                <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <create-dialog ref="createDialog" :musicTypes="musicTypes" @done="getTableData"></create-dialog>
    <edit-dialog ref="editDialog" :musicTypes="musicTypes" @done="getTableData"></edit-dialog>
  </div>
</template>

<script>
import {
  getGiftInfoList,
  removeGiftInfoById,
  disableGiftInfo,
  enableGiftInfo
} from '../../api/gift/gift-info';
import { getAllGiftType } from '../../api/gift/gift-type';
import GiftInfoCreateDialog from './dialogs/GiftInfoCreateDialog';
import GiftInfoEditDialog from './dialogs/GiftInfoEditDialog';

export default {
  name: 'gift-info-page',

  components: {
    'create-dialog': GiftInfoCreateDialog,
    'edit-dialog': GiftInfoEditDialog
  },

  filters: {
    row2ImgPreviewOption(row) {
      return {
        title: `礼品信息图片预览: ${row.gname}`,
        imgSrc: row.img
      };
    }
  },

  data() {
    return {
      selectedIds: [],
      musicTypes: [],
      loading: {
        table: true
      },
      tableData: [],
      // 查询表单
      queryModel: {
        gname: null,
        typeId: null,
        priceStart: null,
        priceEnd: null,
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
    disableSingleGift(row) {
      this.$confirm(
        `此操作将停用礼品: ${
          row.gname
        }, 用户将不可继续使用该礼物进行赠送或打赏, 是否继续?`,
        '礼品信息停用',
        {
          type: 'warning'
        }
      )
        .then(() => {
          disableGiftInfo(row.giftId)
            .then(resp => {
              this.$message.success(`礼品: ${row.gname} 已停用`);
              this.query();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    doEnableSingleGift(row) {
      this.$confirm(
        `此操作将启用礼品: ${
          row.gname
        }, 用户可以使用该礼物进行赠送或打赏, 是否继续?`,
        '礼品信息启用',
        {
          type: 'warning'
        }
      )
        .then(() => {
          enableGiftInfo(row.giftId)
            .then(resp => {
              this.$message.success(`礼品: ${row.gname} 已启用`);
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

    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },

    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.giftId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的礼品信息列表', '批量删除确认')
        .then(() => {
          // 用户点击了确定, 执行批量删除操作
          // 表格loading
          this.loading.table = true;
          removeGiftInfoById(this.selectedIds)
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
    deleteSingleGift(row) {
      this.$confirm('此操作将删除礼品信息: ' + row.gname, '删除确认')
        .then(() => {
          // 用户点击了确定, 执行删除操作
          // 表格loading
          this.loading.table = true;
          removeGiftInfoById(row.giftId)
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
    openEditDialog(giftId) {
      this.$refs.editDialog.showDialog(giftId);
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
      getGiftInfoList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          // 设置总数量
          this.pager.total = data.page.totalCount;
          // 取消loading状态
          this.loading.table = false;
        })
        .catch(error => {});
    },
    initGiftTypeSelectData() {
      getAllGiftType()
        .then(({ data }) => {
          this.musicTypes = data.list;
          this.loading.musicTypes = false;
        })
        .catch(error => {});
    }
  },
  created() {
    this.initGiftTypeSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
