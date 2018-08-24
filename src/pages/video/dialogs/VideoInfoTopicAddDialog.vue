<template>
  <el-dialog :visible.sync="show" title="添加视频话题" width="800px" @close="onDialogClose('theForm')" :close-on-click-modal="false">
    <el-row>
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="80px" ref="theForm">
        <el-form-item label="视频话题" prop="topicIds">
          <el-select v-model.trim="model.topicIds" placeholder="键入搜索视频话题, 可多选" multiple filterable remote :remote-method="remoteSearchVideoTopic" :loading="loading.select.topic">
            <template v-for="(item, index) in videoTopicList">
              <el-option :label="item.tname" :value="item.topicId" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <p>已参与话题列表:</p>
      <el-table :data="originalTopics" border>
        <el-table-column label="话题ID" prop="topicId" width="150"></el-table-column>
        <el-table-column label="话题名称" prop="tname"></el-table-column>
      </el-table>
    </el-row>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doTopicAdd" size="small" :loading="loading.btn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { debounce, findIndex } from 'lodash';
import { searchVideoTopicListByName } from '../../../api/fuzzy-search';
import { addTopics } from '../../../api/video/video-info';

export default {
  name: 'video-info-topic-add-dialog',

  data() {
    return {
      originalTopics: [],
      show: false,
      loading: {
        btn: false,
        select: {
          topic: false
        }
      },
      model: {
        topicIds: []
      },
      videoTopicList: [],
      rules: {
        topicIds: [
          {
            type: 'array',
            required: true,
            trigger: 'change',
            message: '视频话题不能为空'
          }
        ]
      },
      row: null
    };
  },

  methods: {
    showDialog(row) {
      this.row = row;
      this.originalTopics = row.topics;
      this.show = true;
    },

    doTopicAdd() {
      this.$refs.theForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.loading.btn = true;
        addTopics(this.row.videoId, this.model.topicIds)
          .then(resp => {
            this.$message.success('话题添加成功');
            this.loading.btn = false;
            this.show = false;
            this.$emit('done');
          })
          .catch(error => {})
      })
    },

    remoteSearchVideoTopic: debounce(function(query) {
      // 搜索视频话题
      if (query === null || query.trim() === '') {
        return;
      }

      this.videoTopicList = [];
      this.loading.select.topic = true;
      searchVideoTopicListByName(query.trim())
        .then(({ data }) => {
          // 过滤已参与的话题, 只有搜索结果中不属于已参与话题列表中的话题, 才可以在下拉框中选择
          this.videoTopicList = data.list.filter(resultItem => {
            const idx = findIndex(
              this.originalTopics,
              item => item.topicId === resultItem.topicId
            );
            return idx === -1;
          });
          this.loading.select.topic = false;
        })
        .catch(error => {});
    }, 500),

    onDialogClose(formRef) {
      this.videoTopicList = [];
      this.$refs[formRef].resetFields();
    }
  }
};
</script>
