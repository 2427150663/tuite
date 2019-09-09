<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :collapse="collapse"
      text-color="#C0C4CC"
      active-text-color="#FFFFFF"
      unique-opened
      router
      :default-active="defaultActive"
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "iconfont iconhome",
          index: "/HomePage",
          title: "系统首页"
        },
        {
          icon: "iconfont icondaohang",
          index: "2",
          title: "发布管理",
          subs: [
            {
              index: "/Release",
              title: "发布twitter"
            },
            {
              index: "/ReleaseList",
              title: "发布列表"
            }
          ]
        },
        {
          icon: "el-icon-edit-outline",
          index: "3",
          title: "跟评管理",
          subs: [
            {
              index: "/Commentary",
              title: "Twitter跟评"
            },
            {
              index: "/Collection",
              title: "推文采集"
            },
            {
              index: "/CommentaryList",
              title: "跟评列表"
            }
          ]
        },
        {
          icon: "iconfont iconsettings",
          index: "6",
          title: "账户维护",
          subs: [
            {
              index: "/AccountCenter",
              title: "账号中心"
            },
            {
              index: "/AccountCancellation",
              title: "账号解封"
            },
            {
              index: "/Operationlog",
              title: "操作日志"
            }
          ]
        },
        {
          icon: "el-icon-edit",
          index: "/Yucai",
          title: "舆材管理"
        }
      ]
    };
  },
  methods: {},
  computed: {
    defaultActive() {
      let pathLength = this.$route.path;
      if (
        pathLength == "/ReleaseFinished" ||
        pathLength == "/ReleaseExecuting" ||
        pathLength == "/Details"
      ) {
        return "/ReleaseList";
      }
      if (
        pathLength == "/CommentaryExecuting" ||
        pathLength == "/CommentaryFinished" ||
        pathLength == "/CommentaryDetails"
      ) {
        return "/CommentaryList";
      }
      return pathLength;
    }
  }
};
</script>

<style scoped>
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0 !important;
  color: #fff !important;
  background: rgba(100, 185, 252, 0) !important;
}
ul ul li.el-menu-item.is-active {
  background: linear-gradient(
    267deg,
    rgba(100, 185, 252, 0) 0%,
    rgba(140, 197, 255, 1) 100%
  ) !important;
  opacity: 0.9;
  border-left: 3px solid #66b1ff !important;
  padding-left: 37px !important;
}
ul li.el-menu-item.is-active {
  border-left: 3px solid #66b1ff !important;
  padding-left: 17px !important;
}
.el-menu-item:hover {
  color: #ffffff !important;
  background: #394372 !important;
}

.el-menu--inline.is-active,
.el-menu {
  color: #ffffff !important;
  background: none !important;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 64px;
  bottom: 0;
  height: 1100px;
  width: 225px;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 224px;
}
.el-menu {
  background-color: none !important;
}
</style>
