<template>
  <div class="live-console">
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="主播用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="主播昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="主播用户名"></el-input>
      </el-form-item>
      <el-form-item prop="anchorNo">
        <el-input v-model.trim="queryModel.anchorNo" placeholder="主播编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="refreshHomeList" type="primary" size="small">
          <i class="fa fa-search"></i>
          <span>搜索</span>
        </el-button>
        <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-row class="living-anchor-card-list-wrapper" v-loading="loading.home" element-loading-text="正在加载直播列表" v-if="pager.total > 0" type="flex">
        <!-- 这里必须span最小设置为6, 如果小于6则不会自动播放 -->
        <el-col class="card-col" :span="6" v-for="(home, index) in homes" :key="home.liveId" :offset="cardOffset(index)">
          <living-card :model="home" @status-change="onLiveStatusChange"></living-card>
        </el-col>
      </el-row>
      <el-row v-else>
        <span class="empty-string">
          暂无数据
        </span>
      </el-row>
    </template>
    <!-- 分页 -->
    <el-pagination class="align-center" @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[8, 10, 15]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import LivingCard from './component/LivingCard';
import { getLivingHomeList } from '../../api/live/live-console';

export default {
  name: 'live-console',
  components: {
    'living-card': LivingCard
  },
  data() {
    return {
      loading: {
        home: true
      },
      homes: [],
      pager: {
        page: 1,
        limit: 8,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      },
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        anchorNo: null
      }
    };
  },
  methods: {
    onLiveStatusChange({ infoId }) {
      this.refreshHomeList();
    },
    cardOffset(index) {
      if (index > 0) {
        if (index % 4 === 0) {
          return 0;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.refreshHomeList();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.refreshHomeList();
    },
    refreshHomeList() {
      // 显示表格loading
      this.loading.home = true;
      getLivingHomeList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.homes = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.home = false;
        })
        .catch(error => {});
    }
  },
  created() {
    this.refreshHomeList();
  }
};
</script>

<style scoped>
.console-title {
  padding-bottom: 1em;
}
.living-anchor-card-list-wrapper {
  min-height: 400px;
  width: 100%;
  flex-wrap: wrap;
}
.image {
  width: 100%;
  display: block;
}
.align-center {
  display: block;
  padding-top: 1em;
  margin: auto auto;
}
.live-card {
  margin-top: 20px;
}
.is-hover-shadow:hover {
  box-shadow: 1px 1px 20px green;
}
.live-home-name {
  font-size: large;
  display: block;
  padding: 10px;
}
.anchor-name {
  color: grey;
}
.open-time {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: smaller;
  color: grey;
}
.empty-string {
  display: inline-block;
  margin: auto auto;
  color: grey
}
</style>
