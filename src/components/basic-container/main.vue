<template>
  <div :class="{'basic-container--block':block}" class="basic-container">
    <el-card ref="elCard">
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer',
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },
  mounted() {

    let dom = this.$refs['elCard'].$el
    let pnode = dom.parentNode
    let ht = 0

    while (pnode.className.indexOf('el-scrollbar__view') === -1) {
      pnode = pnode.parentNode
      const pd = getComputedStyle(pnode, null).paddingBottom

      if (pd) {
        ht += parseInt(pd, 10)
      }

      const md = getComputedStyle(pnode, null).marginBottom

      if (md) {
        ht += parseInt(md, 10)
      }
    }

    dom.style.minHeight = pnode.scrollHeight - ht + 'px'
  }
}
</script>

<style lang="scss">
.basic-container {
  padding: 8px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
