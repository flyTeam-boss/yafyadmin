<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="item in permission_routes"
          :key="item.path"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { asyncRoutes, constantRoutes } from "@/router";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      permission_routes: [],
      route: []
    };
  },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      "sidebar"
    ]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    this.systemIndex();
    // console.log(constantRoutes);
    // this.permission_routes = constantRoutes
    // this.permission_routes = this.route
    // console.log(this.permission_routes)
  },
  methods: {
    systemIndex() {
      this.$API.system.systemIndex().then(Response => {
        // if(Response.data.object[0].resourceName == '首页'){
        //   this.$store.commit('user/SET_ISDB',true)
        // }else{
        //   this.$store.commit('user/SET_ISDB',false)
        // }
        var data = Response.data.object;
        this.permission_routes = data;
        var newArr = [];
        data.map((item, index) => {
          if (item.resourceDtos.length > 0) {
            item.resourceDtos.map(info => {
              newArr.push(info);
            });
          }
        });
        localStorage.btnPermissions = JSON.stringify(newArr);
      });
    }
  }
};
</script>
