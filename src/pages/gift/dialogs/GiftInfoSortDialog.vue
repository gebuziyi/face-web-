<template>
  <el-dialog width="800px" title="礼品信息排序" :close-on-click-modal="false" :visible.sync="show">
    <el-row class="tips">
      <p class="tip-text">
        <span class="inline-badge" style="background-color: #f56c6c; float: left">6</span>代表原排序值为6
      </p>
      <p class="tip-text">
        <span class="inline-badge" style="background-color: #67C23A; float: left">3</span>代表<strong>新排序值</strong>为3
      </p>
      <p class="tip-text">
        拖拽排序, 最终将会把新排序值更新到数据库中.
        <el-button @click="gifts = original" type="text" size="small" class="btn-operation">
          <i class="fa fa-undo"></i>
          <span>重置为初始顺序</span>
        </el-button>
      </p>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="4">
        <draggable class="list-group" element="ul" v-model="gifts" :options="dragOptions" @start="isDragging=true" @end="isDragging=false">
          <transition-group type="transition" :name="'flip-list'">
            <li class="list-group-item" v-for="item in gifts" :key="item.sort">
              <img :src="item.img" :alt="item.gname" class="type-img" />
              <span class="type-name">{{item.gname}}</span>
              <span class="type-name">{{item.price}}</span>
              <span class="inline-badge" style="background-color: #67C23A; margin-left: 1em">{{ calculateNewSort(item) }}</span>
              <span class="inline-badge" style="background-color: #f56c6c">{{ item.sort }}</span>
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
  updateGiftInfoSort,
  getAllGiftInfoDetail
} from '../../../api/gift/gift-info';
import draggable from 'vuedraggable';
import { findIndex } from 'lodash';

export default {
  name: 'music-type-sort-dialog',
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      show: false,
      original: [],
      gifts: [],
      isDragging: false,
      delayedDragging: false
    };
  },
  methods: {
    showDialog() {
      this.loading = true;
      this.show = true;
      getAllGiftInfoDetail()
        .then(({ data }) => {
          this.original = data.list;
          this.gifts = data.list;
          this.loading = false;
        })
        .catch(error => {
          this.show = false;
        });
    },

    doSort() {
      this.$confirm(
        '是否按新排序值对礼品信息进行排序?',
        '更新礼品信息排序值确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true;
          const data = this.gifts.map((item, index) => {
            return {
              giftId: item.giftId,
              gname: item.gname,
              sort: index
            }
          });
          console.log(data);
          updateGiftInfoSort(data)
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

    calculateNewSort(info) {
      return findIndex(this.gifts, item => item.sort === info.sort);
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
  width: 400px;
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
  padding-left: 1em;
}
</style>
