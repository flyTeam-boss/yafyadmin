<template>
  <div class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.resourceDtos,item)">
      <app-link v-if="onlyOneChild" :to="onlyOneChild.resourceDtos.length > 0?resolvePath(onlyOneChild.resourceUrl):resolvePath(onlyOneChild.resourceUrl)">
        <el-menu-item :index="resolvePath(onlyOneChild.resourceUrl)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- @click="rebtn(onlyOneChild.resourceDtos)" -->
          <item :icon="onlyOneChild.icon||(item&&item.icon)" :title="generateTitle(onlyOneChild.resourceName)" />
        </el-menu-item>
        <!-- onlyOneChild.resourceType === 1?resolvePath(onlyOneChild.resourceUrl)+onlyOneChild.resourceType:resolvePath(onlyOneChild.resourceUrl) -->
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.resourceUrl)" popper-append-to-body>
      <template slot="title">
        <item v-if="item" :icon="item && item.icon" :title="generateTitle(item.resourceName)" />
      </template>
      <template v-for="child in item.resourceDtos">
        <sidebar-item
          v-if="onlyOneChild.resourceType != 1"
          :key="child.resourceUrl"
          :is-nest="true"
          :item="child"
          class="nest-menu"
        />
      </template>
    <!-- :base-path="resolvePath(child.resourceUrl)" -->
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // rebtn(child) {
    //   var arr = []
    //   if (child) {
    //     child.map(item => {
    //       arr.push(item.resourceName)
    //     })
    //   }
    //   localStorage.btnPermissions = JSON.stringify(arr)
    // },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          if (item.resourceType === 1) {
            return false
          }
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      // if (showingChildren.length === 1) {
      //   return true
      // }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    generateTitle
  }
}
</script>
