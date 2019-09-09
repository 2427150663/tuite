<template>
  <div class="header">
    <div class="logo"></div>
    <div class="header-right">
      <div class="zhong">
        <span class="s1">专项反制工作系统</span>
        <span class="s2">——</span>
        <span class="s3">{{agencyName}}</span>
      </div>
      <div class="right">
        <span class="s1"></span>
        <span class="s2" @click="dakai()" title="返回大厅"></span>
        <span class="s3" @click="logOut()" title="退出登录"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      agencyName: ""
    };
  },
  created() {
    this.$axios.get("/UserAccount/GetUserInfo").then(res => {
      if (res.data.code == 0) {
        this.agencyName = res.data.data.agencyName;
        window.localStorage.setItem("agencyId", res.data.data.agencyId);
      } else if (res.data.code == 1000) {
        window.open("http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html", "_self");
      } else if (res.data.code == 1003) {
        this.$alert("该账号没有权限", "小提示", {
          confirmButtonText: "确定",
          callback: action => {
            window.open("http://www.yuqing.pro", "_self");
          }
        });
      } else {
        this.$alert(`${res.data.message}`, "小提示", {
          confirmButtonText: "确定",
          callback: action => {
            window.open("http://www.yuqing.pro", "_self");
          }
        });
      }
    });
  },
  methods: {
    dakai() {
      window.location.href = "http://www.yuqing.pro";
    },
    logOut() {
      window.location.href = "http://login.yuqing.pro/Logout.ashx?ajax=0&redirect=http://jwp.yuqing.pro:89/Index.html";
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  font-size: 22px;
  color: #fff;
  min-width: 750px;
  overflow: hidden;
}
.header .logo {
  float: left;
  width: 96px;
  height: 23px;
  background: url(../../assets/img/log.png) no-repeat center;
  margin: 21px 0 0 64px;
}
.right .s1,
.s3 {
  cursor: pointer;
}
.zhong {
  line-height: 64px;
  float: left;
  font-weight: 500;
  color: #ffffff;
}
.zhong .s1 {
  padding-left: 150px;
  font-size: 20px;
  color: #ffffff;
}
.zhong .s2 {
  padding-left: 30px;
  padding-right: 30px;
}
.zhong .s3 {
  width: 19px;
  height: 22px;
}
.right {
  line-height: 64px;
  float: right;
  font-size: 14px;
  color: #c0c4cc;
  font-weight: 500;
  padding-right: 24px;
  padding-top: 6px;
}
.right span {
  display: inline-block;
}
.right .s1 {
  background: url(../../assets/img/one.png) no-repeat center;
  width: 20px;
  height: 22px;
}
.right .s2 {
  background: url(../../assets/img/two.png) no-repeat center;
  width: 22px;
  height: 21px;
  /* padding: 0 24px; */
  margin: 0 24px;
  cursor: pointer;
}
.right .s3 {
  background: url(../../assets/img/three.png) no-repeat center;
  width: 19px;
  height: 22px;
}
</style>
