<template>
  <el-dialog width="800px" title="热门视频话题排序" :close-on-click-modal="false" :visible.sync="show">
    <el-row class="tips">
      <p class="tip-text">
        鼠标拖拽进行排序操作
        <el-button @click="hotTopics = original" type="text" size="small" class="btn-operation">
          <i class="fa fa-undo"></i>
          <span>重置为初始顺序</span>
        </el-button>
      </p>
    </el-row>
    <el-row v-loading="loading">
      <el-col :span="8" :offset="4">
        <draggable class="list-group" element="ul" v-model="hotTopics" :options="dragOptions" @start="isDragging=true" @end="isDragging=false">
          <transition-group type="transition" :name="'flip-list'">
            <li class="list-group-item" v-for="item in hotTopics" :key="item.topicId">
              <img :src="item.img" class="type-img" />
              <span class="type-name">{{item.tname}}</span>
            </li>
          </transition-group>
        </draggable>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doSort" size="small" :disabled="!(original && original.length > 1)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  updateVideoTopicSort,
  getAllHotTopic
} from '../../../api/video/video-topic';
import draggable from 'vuedraggable';

export default {
  name: 'hot-video-topic-sort-dialog',
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      show: false,
      original: [],
      hotTopics: [],
      isDragging: false,
      delayedDragging: false
    };
  },
  methods: {
    showDialog() {
      this.loading = true;
      this.show = true;
      getAllHotTopic()
        .then(({ data }) => {
          this.original = data.list;
          this.hotTopics = data.list;
          this.loading = false;
        })
        .catch(error => {
          this.show = false;
        });
    },

    doSort() {
      this.$confirm('是否按新排序规则对热门话题进行排序?', '更新热门话题排序', {
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          const data = this.hotTopics.map((item, index) => {
            return {
              topicId: item.topicId,
              sort: this.original.length - index
            };
          });
          updateVideoTopicSort(data)
            .then(resp => {
              this.$message.success('排序成功!');
              this.loading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        })
        .catch(() => {});
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
  width: 500px;
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
  padding-left: 2em;
  width: 30em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
