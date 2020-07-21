<template>
  <div class="top-menu">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      text-color="#333333" active-text-color="#000000">
      <template v-for="(item,index) in items">
        <el-menu-item
          :index="item.id+''"
          :key="index"
          @click.native="openMenu(item)">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopMenu',
  data() {
    return {
      activeIndex: '1',
      items: [/*
        {
          parentId: -1,
          id: 1,
          label: '项目管理',
          icon: 'el-icon-s-shop',
          // path: '/user'
        },
        {
          parentId: -1,
          id:2,
          label: '数据监控',
          icon: 'el-icon-video-camera',
          // path: '/admin'
        },
        {
          parentId: -1,
          id: 3,
          label: '元数据管理',
          icon: 'el-icon-s-grid',
          // path: '/daemon'
        },
        {
          parentId: -1,
          id: 4,
          label: '系统设置',
          icon: 'el-icon-s-tools',
          // path: '/sys'
        }*/
      ]
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['tagCurrent', 'menu'])
  },
  methods: {
    openMenu(item) {
      this.$store.dispatch('GetMenu', item.parentId).then(data => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true)
        }
        let itemActive,
          childItemActive = 0

        /** 如果有 path属性，直接选当前的 item */
        if (item.path) {
          itemActive = item
        } else {
          /** 如果侧边菜单没有子菜单了，直接选当前 menu 中的第一个 */
          if (this.menu[childItemActive].length == 0) {
            itemActive = this.menu[childItemActive]
          } else {
            /** 有子菜单，选第一个子菜单 */
            itemActive = this.menu[childItemActive].children[childItemActive]
          }
        }
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: itemActive.label,
            src: itemActive.path
          })
        })
      })
    }
  }
}
</script>
