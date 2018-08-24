<template>
  <div class="table-btn-wrapper">
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="resetQueryForm">重置</el-button>
      <slot name="btns">
      </slot>
      <template v-if="btns !== null && typeof btns !== 'undefined'">
        <template v-for="btnId in Object.keys(btns)">
          <el-button @click="handleClick(btns[btnId])" :type="btns[btnId].type" size="small" v-if="!btns[btnId].needPerm || hasPermission(`${btns[btnId].permission}`)" :key="btnId" class="btn-operation" :disabled="btns[btnId].enable ? false : true" :style="{ 'margin-left': $slots.btns ? '10px' : ''}">
            <i :class="btns[btnId].icon"></i>
            <span>{{ btns[btnId].label }}</span>
          </el-button>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-btns',
  data() {
    return {};
  },
  props: {
    formRef: {
      type: String,
      default: 'queryForm'
    },
    btns: {
      type: Object
    }
  },
  methods: {
    handleClick(btn) {
      if (btn.onClick && typeof btn.onClick === 'function') {
        btn.onClick();
      } else {
        this.$emit(btn.event);
      }
    },
    onQueryBtnClick() {
      this.$emit('query');
    },
    resetQueryForm() {
      this.$parent.$refs[this.formRef].resetFields();
    }
  },
  created() {
    this.formModel = this.model;
  }
};
</script>

<style scoped>

</style>
