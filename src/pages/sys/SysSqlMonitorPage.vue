<template>
  <div id="sys-sql-monitor">
    <iframe :src="druidSqlHtmlPath" frameborder="0" width="100%" height="800px" id="druid-sql-iframe"></iframe>
  </div>
</template>

<script>
import { CONTEXT_PATH } from '../../utils/constants';

export default {
  name: 'sys-sql-monitor-page',
  data() {
    return {
      druidSqlHtmlPath: CONTEXT_PATH + '/druid/sql.html'
    };
  }
};
</script>

<style scoped>
.druid-sql-monitor {
  width: 100%;
  min-height: 960px;
}
#druid-sql-iframe::-webkit-scrollbar {
  display: none
}
</style>
