<template>
  <div class="project">
    <basic-container>
      <h3>task</h3>

      <flow-chart />
    </basic-container>
  </div>
</template>

<script>
import flowChart from '@/components/flowchart'

export default {
  name: 'taskManageIndex',
  components: {
    'flow-chart': flowChart
  },
  data() {
    return {
      list: []
    }
  },
  created() {},
  mounted() {},

  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
</style>
