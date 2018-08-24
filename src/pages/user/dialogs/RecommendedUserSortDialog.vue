<template>
  <el-dialog width="600px" title="推荐用户排序" :close-on-click-modal="false" :visible.sync="show">
    <el-row class="tips">
      <p class="tip-text">
        鼠标拖拽进行排序操作
        <el-button @click="users = original" type="text" size="small" class="btn-operation">
          <i class="fa fa-undo"></i>
          <span>重置为初始顺序</span>
        </el-button>
      </p>
    </el-row>
    <el-row v-loading="loading">
      <el-col :span="8" :offset="4">
        <draggable class="list-group" element="ul" v-model="users" :options="dragOptions" @start="isDragging=true" @end="isDragging=false">
          <transition-group type="transition" :name="'flip-list'">
            <li class="list-group-item" v-for="item in users" :key="item.recommendId">
              <img :src="item.img" :alt="item.nickname" class="type-img" />
              <span class="type-name">{{item.nickname}}</span>
            </li>
          </transition-group>
        </draggable>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doSort" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  updateUserRecommendSort,
  getAllRecommendedUsers
} from '../../../api/user/user-recommend';
import draggable from 'vuedraggable';
import { findIndex } from 'lodash';

export default {
  name: 'recommended-user-sort-dialog',
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      show: false,
      original: [],
      users: [],
      isDragging: false,
      delayedDragging: false
    };
  },
  methods: {
    showDialog() {
      this.loading = true;
      this.show = true;
      getAllRecommendedUsers()
        .then(({ data }) => {
          this.original = data.list;
          this.users = data.list;
          this.loading = false;
        })
        .catch(error => {
          this.show = false;
        });
    },

    doSort() {
      this.$confirm(
        '是否按新排序规则对推荐用户进行排序?',
        '更新推荐用户排序',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true;
          const data = this.users.map((item, index) => {
            return {
              recommendId: item.recommendId,
              sort: this.original.length - index
            }
          });
          updateUserRecommendSort(data)
            .then(resp => {
              this.$message.success('排序成功!');
              this.loading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    calculateNewSort(user) {
      return findIndex(this.users, item => item.recommendId === user.recommendId);
    }
  },

  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        ghostClass: 'ghost'
      };
    }
  },

  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  }
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  list-style-type: none;
  border-radius: 2px;
}

.list-group-item {
  padding: 5px;
  width: 300px;
  cursor: move;
  min-height: 30px;
}

.list-group-item:hover {
  background-color: #c8ebfb;
}

.inline-badge {
  float: right;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}

.type-img {
  vertical-align: middle;
  height: 30px;
  width: 30px;
}

.type-name {
  float: right;
}
</style>
