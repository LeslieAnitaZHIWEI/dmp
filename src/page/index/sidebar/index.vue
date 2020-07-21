<template>
  <div class="avue-sidebar">
    <logo/>
    <el-scrollbar style="height:100%">
      <div
        v-if="validatenull(menu)"
        class="avue-sidebar--tip">没有发现菜单</div>
      <el-menu
        :default-active="nowTagValue"
        :show-timeout="200"
        :collapse="keyCollapse"
        unique-opened
        mode="vertical">
        <sidebar-item
          :menu="menu"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '../logo'
import sidebarItem from './sidebarItem'
export default {
  name: 'Sidebar',
  components: { sidebarItem, logo },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen']),

    /** 从当前的路由中获得当前对应的 path 值 */
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route)
    }
  },
  created() {
    this.$store.dispatch('GetMenu').then(data => {
      if (data.length === 0) return

      /** 动态路由 */
      this.$router.$avueRouter.formatRoutes(data, true)
    })
  },
  
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>

