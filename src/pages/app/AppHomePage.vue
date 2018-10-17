<template>
  <div>
    <transition mode="out-in" name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app-home-page',
  data() {
    return {};
  }
};
</script>

<style scoped>

</style>
