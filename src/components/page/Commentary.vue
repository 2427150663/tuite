<template>
  <div class="bai">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <div class="lineq">Twitter跟评</div>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="handle-box">
        <h5></h5>
        <div class="flex">
          <input :disabled="tijiao1" placeholder="请输入需要跟评的推文URL或者搜索关键字" id="zwq" v-model="form.val" />
          <el-button
            type="primary"
            icon="el-icon-search"
            :disabled="tijiao1"
            class="btn"
            @click="sousuo()"
          >搜索</el-button>
          <el-button type="primary" @click="xYc()" style="margin-left:20px">选舆材</el-button>
        </div>

        <p>请输入您要搜索的关键字或反制任务标题链接</p>
        <p>例如：https://twitter.com/CCTV/status/1119173669446504449</p>
      </div>
    </div>
    <div class="container">
      <div class="form-box" v-if="flag">
        <div class="ftnrw">
          <p>{{form.biaoti1}}</p>
          <div class="bianji">任务标题</div>
          <!-- <input type="text" v-model="groupName" class="edit-input" ref="groupName"
          @input="changeValue()" maxLength="">-->
          <input
            type="text"
            @click="reset1($event)"
            :placeholder="placeholder1"
            :disabled="tijiao1"
            @input="changeValue()"
            maxlength
            ref="groupName"
            v-model="groupName"
            class="rwbt"
          />
          <div class="ftzh shuliang" style="margin:26px 0 24px; ">任务数量</div>
          <el-row class="tanxing" :span="24">
            <el-col :span="8">
              <div class="sub-title">评论间隔(单位分钟,最小2分钟)</div>
              <el-input
                class="inline-input"
                @input="form.state1=form.state1.replace(/[^\d]/g,'')"
                v-model="form.state1"
                min="2"
                max="999"
                type="text"
                placeholder="请输入内容"
                @blur="res()"
                :disabled="tijiao1"
              ></el-input>
              <span class="dw">{{hml}}</span>
            </el-col>
            <el-col :span="8">
              <div class="sub-title">转发数</div>
              <el-input
                min="1"
                max="333"
                class="inline-input"
                @input="form.state2=form.state2.replace(/[^\d]/g,'')"
                v-model="form.state2"
                :disabled="tijiao1"
                type="text"
                placeholder="请输入内容"
                @blur="res1()"
              ></el-input>
              <span class="dw1">{{hml1}}</span>
            </el-col>
            <el-col :span="8">
              <div class="sub-title">点赞数</div>
              <el-input
                class="inline-input"
                @input="form.state3=form.state3.replace(/[^\d]/g,'')"
                v-model="form.state3"
                type="text"
                :disabled="tijiao1"
                @blur="res2()"
              ></el-input>
              <span class="dw2">{{hml2}}</span>
            </el-col>
          </el-row>
          <div class="ftnr">
            <div class="bianji neir">任务内容</div>
            <textarea
              :disabled="tijiao1"
              maxlength
              @input="changeText()"
              @click="reset($event)"
              ref="groupName1"
              v-model="form.conts"
              :placeholder="placeholder"
              id="nrcont"
              class="nrcont"
            ></textarea>
            <p class="ysr" v-if="!ysr">
              {{tips}}
              <span>{{max_str}}/256</span>个字符
            </p>
            <p class="ysr" v-if="ysr">{{tips}}256个字符</p>
          </div>
        </div>
        <div class="ftzh">发帖账号</div>
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-form-item>
              <el-radio-group v-model="form.resource">
                <el-radio
                  :label="2"
                  :disabled="tijiao1"
                >私有账号 (今日剩余最大跟评{{isGive.privateAccount.replyResidueCount}}条)</el-radio>
                <br />
                <el-radio
                  :label="1"
                  :disabled="tijiao1"
                >公有账号 (今日剩余最大跟评{{isGive.publicAccount.replyResidueCount}}条)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="flag2" style="padding-bottom:24px">
            <el-button type="primary" icon="el-icon-view" @click="onSubmit">预览</el-button>
            <el-button icon="el-icon-refresh" @click="empty()">重置</el-button>
          </el-form-item>
          <el-row v-if="flag1" style="padding-bottom:24px">
            <el-button icon="el-icon-back" type="primary" @click="onCallk()">返回上一步</el-button>
            <el-button icon="el-icon-check" @click="openCenter()">提交</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "baseform",
  data: function() {
    return {
      tijiao1: false,
      b: false,
      xs: true,
      tips: "已输入",
      groupName: "",
      max_str: 0,
      form: {
        resource: 2,
        input: "",
        input1: "",
        state1: "2",
        state2: "0",
        state3: "0",
        val: "",
        tweetId: "",
        biaoti1: "",
        biaoti: "",
        conts: ""
      },
      ysr: false,
      hml: "",
      hml1: "",
      hml2: "",
      hk1: false,
      placeholder: "评论内容,每行一个",
      placeholder1: "",
      isGive: {
        publicAccount: {},
        privateAccount: {}
      },
      // 改
      flag: false,
      flag1: false,
      flag2: true
    };
  },
  created() {
    this.addzh();
    sessionStorage.clear();
  },
  methods: {
    xYc() {
      window.open("http://jwp.yuqing.pro:89/Index.html#/Yucai?page=1&pageSize=10", "_blank");
    },
    reset($event) {
      $event.target.style.border = "1px solid rgba(213, 215, 221, 1)";
      $event.target.setAttribute("placeholder", "评论内容,每行一个");
    },
    reset1($event) {
      $event.target.style.border = "1px solid rgba(213, 215, 221, 1)";
      $event.target.setAttribute("placeholder", "");
    },
    xiaoshi() {
      this.xs = false;
    },
    // 验证标题字符
    changeValue() {
      let leng = this.validateTextLength(this.groupName);
      if (leng >= 40) {
        this.$refs.groupName.maxLength = leng;
      } else {
        this.$refs.groupName.maxLength = 80;
      }
    },
    // 验证发推内容不超过256个字符
    changeText() {
      // 将textare中的内容已换行符切割成数组
      let contsarr = this.form.conts.trim().split(/[(\r\n)\r\n]+/);
      for (let i = 0, p = contsarr.length; i < p; i++) {
        let leng = this.validateTextLength2(contsarr[i]);
        if (leng > 256) {
          this.ysr = true;
          this.tips = "第" + (i + 1) + "行已超过";
          document.getElementsByClassName("ysr")[0].style.color = "red";
          return false;
        } else {
          this.ysr = false;
          this.max_str = leng;
          this.tips = "已输入";
          document.getElementsByClassName("ysr")[0].style.color = "#606266";
        }
      }
    },
    validateTextLength2(value) {
      //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = value.match(cnReg);
      let length = 0;
      if (mat) {
        return (length = mat.length * 2 + (value.length - mat.length) * 1);
      } else {
        return (length = value.length * 1);
      }
    },
    validateTextLength(value) {
      //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = value.match(cnReg);
      let length = 0;
      if (mat) {
        return (length = mat.length + (value.length - mat.length) * 0.5);
      } else {
        return (length = value.length * 0.5);
      }
    },
    res() {
      if (this.form.state1 === "") {
        this.hml = "评论数量不能为空";
        this.tijiao = true;
        // this.$message.error("评论数量不能为空");
      } else if (this.form.state1 < 2) {
        this.hml = "评论间隔时间不能小于2";
      } else if (this.form.state1 > 999) {
        this.hml = "评论间隔时间不能大于999";
      } else {
        this.hml = "";
        // this.$message.error("评论数量不能为空");
      }
    },
    res1() {
      if (this.form.state2 === "") {
        this.hml1 = "评论数量不能为空";
        //  this.$message.error("转发数量不能为空");
      } else if (this.form.state2 < 0) {
        this.hml1 = "转发数量不能小于0";
      } else if (this.form.state2 > 999) {
        this.hml1 = "转发数量不能大于999";
      } else {
        this.hml1 = "";
      }
    },
    res2() {
      if (this.form.state3 === "") {
        this.form.state3 = 0;
      }
    },
    addzh() {
      this.$axios.get("/TwitterAccount/GetUserTaskResidueNumber").then(res => {
        if (res.data.isOk == true) {
          this.isGive = res.data.data;
        }
        if (res.data.code == 1000) {
          window.open("http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html", "_self");
        }
      });
    },
    empty() {
      this.form.input = "";
      this.form.input1 = "";
      this.form.state1 = "";
      this.form.state2 = "";
      this.form.state3 = 0;
      this.form.biaoti = "";
      this.form.conts = "";
    },
    openCenter() {
      if (this.form.resource == 2) {
        if (this.isGive.privateAccount.replyResidueCount < 1) {
          this.$message({
            message: `剩余私有发帖数为${this.isGive.privateAccount.replyResidueCount}暂时不能发帖`,
            type: "error",
            center: true
          });
          return false;
        }
        if (this.form.state3 > this.isGive.privateAccount.likeResidueCount) {
          this.$message({
            message: `点赞数${this.form.state3}超过今日最大点赞,今日可用私有点赞数${this.isGive.privateAccount.likeResidueCount}`,
            type: "error",
            center: true
          });
          return false;
        }
        if (this.form.state2 > this.isGive.privateAccount.retweetResidueCount) {
          this.$message({
            message: `转发数${this.form.state2}超过今日最大转发数量,今日可用私有转发数${this.isGive.privateAccount.retweetResidueCount}`,
            type: "error",
            center: true
          });
          return false;
        }
      } else {
        if (this.isGive.publicAccount.replyResidueCount < 1) {
          this.$message({
            message: `剩余共有发帖数为${this.isGive.publicAccount.replyResidueCount}暂时不能发帖`,
            type: "error",
            center: true
          });
          return false;
        }
        if (this.form.state3 > this.isGive.publicAccount.likeResidueCount) {
          this.$message({
            message: `点赞数${this.form.state3}超过今日最大点赞,今日可用共有点赞数${this.isGive.publicAccount.likeResidueCount}`,
            type: "error",
            center: true
          });
          return false;
        }
        if (this.form.state2 > this.isGive.publicAccount.retweetResidueCount) {
          this.$message({
            message: `转发数${this.form.state2}超过今日最大转发数量,今日可用共有转发数${this.isGive.publicAccount.retweetResidueCount}`,
            type: "error",
            center: true
          });
          return false;
        }
      }
      const rLoading = this.openLoading();
      this.$axios
        .post("/Twitter/Comment", {
          twitterAccountType: this.form.resource,
          Sleep: this.form.state1,
          ReTweetCount: this.form.state2,
          likeCount: this.form.state3,
          sendContentList: this.form.conts.trim().split(/[(\r\n)\r\n]+/),
          tweetId: this.form.tweetId,
          tweetUrl: this.form.val,
          title: this.groupName
        })
        .then(res1 => {
          let total = res1.data.message;
          if (res1.data.code == 0) {
            rLoading.close();
            this.$message({
              message: total,
              type: "success",
              center: true
            });
            this.$router.push({
              path: "/CommentaryExecuting",
              query: {
                redirect: location.hostname // 防止从外部进来登录
              }
            });
          } else {
            rLoading.close();
            this.$message({
              message: total,
              type: "error",
              center: true
            });
            return;
          }
        });
    },
    sousuo() {
      if (this.form.val.trim() == "") {
        this.$message.info({
          message: "请输入内容!",
          duration: 800
        });
        return false;
      }
      var urllink = document.getElementById("zwq").value;
      var reg = /^https:\/\/twitter\.com\/.*?\/status\/\d*?$/;
      if (!reg.test(urllink)) {
        this.flag = false;
        this.flag = false;
        var int = document.getElementById("zwq").value;
        var arr = `https://twitter.com/search?q=${int}`;
        window.open(arr);
      } else if (reg.test(urllink)) {
        const rLoading = this.openLoading();
        this.$axios
          .get("/Twitter/Get?Url=" + this.form.val)
          .then(texs => {
            if (texs.data.code == 0) {
              this.flag = true;
              rLoading.close();
              this.form.biaoti1 = texs.data.data.text;
              this.groupName = texs.data.data.text.slice(0, 80);
              this.form.tweetId = texs.data.data.tweetId;
            } else {
              rLoading.close();
              this.$message.info({
                message: "请求失败!",
                duration: 800
              });
            }
          })
          .catch(e => {
            rLoading.close();
            this.$message.info({
              message: "请求超时!",
              duration: 800
            });
          });
      }
    },
    onSubmit() {
      this.res1();
      this.res();
      if (this.groupName.trim() != "") {
        if (this.form.conts.trim() != "") {
          if (this.hml == "" && this.hml1 == "") {
            this.flag = true;
            this.flag1 = true;
            this.flag2 = false;
            this.b = true;
            this.tijiao1 = true;
          }
        } else {
          document.getElementsByClassName("nrcont")[0].style.border =
            "1px solid red";
          document
            .getElementsByClassName("nrcont")[0]
            .setAttribute("placeholder", "内容不能为空");
        }
      } else {
        document.getElementsByClassName("rwbt")[0].style.border =
          "1px solid red";
        document
          .getElementsByClassName("rwbt")[0]
          .setAttribute("placeholder", "内容不能为空");
      }

      if (this.form.conts.trim() != "") {
        console.log(111111);
        if (this.hml == "" && this.hml1 == "") {
          this.flag = true;
          this.flag1 = true;
          this.flag2 = false;
          this.b = true;
          this.tijiao1 = true;
        }
      } else {
        document.getElementsByClassName("nrcont")[0].style.border =
          "1px solid red";
        document
          .getElementsByClassName("nrcont")[0]
          .setAttribute("placeholder", "内容不能为空");
      }
    },
    onCallk() {
      this.flag = true;
      this.flag1 = false;
      this.flag2 = true;
      this.b = false;
      this.tijiao1 = false;
    }
  }
};
</script>
<style scoped>
.tanxing {
  display: flex !important;
  justify-content: space-around !important;
}
p {
  font-size: 20px;
  color: #303132;
}
.ysr {
  font-size: 14px;
  position: absolute;
  right: 10px;
  bottom: -25px;
  color: #606266;
}
#zwq {
  width: 465px !important;
  height: 27px;
  border-radius: 2px;
  border: 1px solid #66b1ff;
  box-shadow: 0px 2px 5px 1px rgba(65, 157, 255, 0.19);
  font-size: 14px;
  color: #606266;
  padding: 8px;
  border-right: none;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.btn {
  width: 100px !important;
  height: 45px !important;
  font-size: 16px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  position: relative;
  top: 1px;
}
.rwbt {
  width: 584px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid rgba(220, 222, 227, 1);
  padding: 8px;
  color: #606266;
}
.flex {
  display: flex;
}
.a {
  border: 1px solid rgba(213, 215, 221, 1) !important;
}
.c {
  border: none !important;
}
h5 {
  width: 78px;
  background: url(../../assets/img/Bitmap.png) no-repeat left;
  height: 16px;
  position: absolute;
  top: 15px;
  left: -100px;
}
.handle-box p {
  color: #919398;
  padding-top: 14px;
  font-size: 14px;
}
h5 span {
  font-size: 12px;
  color: rgba(102, 177, 255, 1);
  margin: 0 0 0 102px;
}
.handle-box {
  width: 582px;
  margin: 0 auto;
  margin-top: 24px;
  position: relative;
}
.ftzh {
  background: url(../../assets/img/ftzh.png) no-repeat left;
  text-indent: 30px;
  width: 100%;
  border-bottom: 1px solid #d5d7dd;
  padding: 12px 0 8px 0;
  line-height: 24px;
  color: #606266;
}
.ftnrw {
  color: #606266;
}
.bianji {
  background: url(../../assets/img/renw.png) no-repeat left;
  text-indent: 30px;
  width: 200px;
  line-height: 24px;
  margin-bottom: 8px;
  font-size: 14px;
  margin-top: 36px;
}
.shuliang {
  background: url(../../assets/img/shijian.png) no-repeat left !important;
}
.neir {
  background: url(../../assets/img/icons8.png) no-repeat left !important;
}
.el-input {
  width: 114px !important;
}
.lineq {
  margin-top: 21px;
  margin-bottom: 14px;
}
#nrcont {
  width: 582px;
  height: 120px;
  border-radius: 2px;
  border: 1px solid rgba(213, 215, 221, 1);
  padding: 8px;
  resize: none;
  color: #c0c4cc;
  font-size: 14px;
  outline: none;
}
.sub-title {
  font-size: 14px;
  margin-bottom: 8px;
  position: relative;
}
.dw,
.dw1,
.dw2 {
  font-size: 12px;
  color: red;
}
.dw {
  position: absolute;
  top: 70px;
  left: 5px;
}
.dw2 {
  position: absolute;
  top: 70px;
  left: 410px;
}
.dw1 {
  position: absolute;
  top: 70px;
  left: 210px;
}
.tiaoshu {
  font-size: 14px;
  margin: 14px 0 24px 0;
}
.form-box {
  margin: 0 auto;
}
.fwnrw {
  overflow-y: scroll;
  min-height: 200px;
}
.content-box {
  height: 1194px !important;
}
.el-breadcrumb {
  border-bottom: 1px solid rgba(213, 215, 221, 1);
}
.el-radio {
  margin-top: 24px;
}
.ftnr {
  margin: 26px 0 20px 0;
  position: relative;
}
.ftnr input {
  width: 114px;
  margin-left: 16px;
  font-size: 14px;
  color: #c0c4cc;
  height: 36px;
  padding-left: 6px;
  border-radius: 2px;
  border: 1px solid rgba(213, 215, 221, 1);
}
.content-box {
  height: 940px !important;
}
.hk {
  border: 1px solid red;
  border-radius: 4px;
  z-index: 999;
}
</style>