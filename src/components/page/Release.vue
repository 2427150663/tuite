<template>
  <div class="bai">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <div class="lineq">发布twitter</div>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <div class="ftnrw">
          <div class="ftnr" v-for="(item,index) in sendContent" :key="item.id">
            <div class="bianji">发推内容</div>
            <span class="lists">{{index+1+'.'}}</span>
            <textarea
              maxlength
              @input="count(index)"
              :disabled="tijiao"
              @click="reset($event)"
              id="nrcont"
              class="nrcont"
              ref="groupName"
              :placeholder="placeholder"
              v-model="item.sendContent"
            ></textarea>
            <p class="ysr">
              可输入
              <span>{{item.max_str}}/256</span>个字符
            </p>
            <i
              @click="text1(index)"
              v-if="isSet"
              @change="checkname"
              class="iconfont iconguanbi"
            >&#xe60c;</i>
            <div class="tiaoshu">
              <span>本条推文发布数</span>
              <el-form>
                <el-form-item>
                  <el-input
                    @input="item.sendNumber=item.sendNumber.replace(/[^\d]/g,'')"
                    @blur="res(index)"
                    :disabled="tijiao"
                    placeholder="请输入数量"
                    type="text"
                    min="1"
                    :class="{hk:item.hk1}"
                    v-model="item.sendNumber"
                  ></el-input>
                  <span class="dw">{{item.hml}}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <el-button type="primary" @click="add" v-if="flag">再加一条</el-button>
        <h2></h2>
        <div class="ftzh">发帖账号</div>
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-radio-group v-model="form.resource">
              <el-radio
                @change="table_number()"
                :disabled="tijiao"
                :label="2"
              >私有账号 (今日剩余最大发帖{{isGive.privateAccount.tweetResidueCount}}条)</el-radio>
              <el-radio
                @change="table_number()"
                :disabled="tijiao"
                :label="1"
              >公有账号 (今日剩余最大发帖{{isGive.publicAccount.tweetResidueCount}}条)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="padding-bottom:24px">
            <el-button type="primary" icon="el-icon-view" v-if="flag" @click="onSubmit()">预览</el-button>
            <el-row v-if="flag1">
              <el-button icon="el-icon-back" type="primary" @click="onCallk()">返回上一步</el-button>
              <el-button icon="el-icon-check" @click="openCenter()">提交</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  name: "baseform",
  data() {
    return {
      sendContent: [
        { sendContent: "", sendNumber: "1", hk1: false, hml: "", max_str: 0 }
      ],
      form: {
        resource: 2,
        desc: "",
        input: "",
        sendNumber: ""
      },
      isGive: {
        publicAccount: {},
        privateAccount: {}
      },
      flag: true,
      flag1: false,
      isSet: false,
      hhh: "",
      tijiao: false,
      placeholder: "每个文本框为一条"
      // max_str:0
    };
  },
  created() {
    this.addzh();
    sessionStorage.clear();
  },
  methods: {
    getStringUTFLength(str) {
      var value = str.replace(/[\u4e00-\u9fa5]/g, "ss");
      //将汉字替换为两个空格
      return value.length;
    },
    leftUTFString(str, len) {
      if (this.getStringUTFLength(str) <= len) {
        return str;
      }
      var value = str.substring(0, len);
      while (this.getStringUTFLength(value) > len) {
        value = value.substring(0, value.length - 1);
      }
      return value;
    },
    count(index) {
      var len = 256;
      var value = this.sendContent[index].sendContent;
      if (this.getStringUTFLength(value) >= len) {
        this.sendContent[index].sendContent = this.leftUTFString(value, len);
      }
      this.sendContent[index].max_str =
        len - this.getStringUTFLength(this.sendContent[index].sendContent);
    },
    reset($event) {
      $event.target.style.border = "1px solid rgba(213, 215, 221, 1)";
      $event.target.setAttribute("placeholder", "每个文本框为一条");
    },
    res(index) {
      var numb;
      this.hhh = this.sendContent[index].sendNumber
        ? this.sendContent[index].sendNumber
        : 0; // 当前 失去焦点 input  vlue值
      if (this.form.resource == 2) {
        numb = this.isGive.privateAccount.tweetResidueCount;
      }
      if (this.form.resource == 1) {
        numb = this.isGive.publicAccount.tweetResidueCount;
      }
      var he = this.sendContent.reduce((r, s) => {
        // 所有列表下 发布推文 数量和
        return r * 1 + s.sendNumber * 1;
      }, 0);
      if (this.hhh <= 0) {
        this.sendContent[index].hml = "发布数量不能小于等于0";
        this.sendContent[index].hk1 = true;
        return false;
      } else {
        this.sendContent[index].hml = "";
        this.sendContent[index].hk1 = false;
        if (he > numb * 1) {
          this.sendContent[index].hml = "发布数量不能大于剩余数量";
          this.sendContent[index].hk1 = true;
          return false;
        } else if (he <= numb * 1) {
          this.sendContent[index].hml = "";
          this.sendContent[index].hk1 = false;
          return true;
        }
      }
    },
    add(index) {
      this.sendContent.push({
        sendContent: "",
        sendNumber: "1",
        hk1: false,
        hml: "",
        max_str: 0
      });
      this.isSet = true;
    },
    addzh() {
      this.$axios.get("/TwitterAccount/GetUserTaskResidueNumber").then(res => {
        if (res.data.isOk == true) {
          this.isGive = res.data.data;
        }
        if (res.data.code == 1000) {
          window.open(
            "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
            "_self"
          );
        }
      });
    },
    text1(index) {
      this.sendContent.splice(index, 1);
      if (this.sendContent.length <= 1) {
        this.isSet = false;
      }
    },
    checkname: function() {
      if (this.sendContent.trim() == "") {
        this.$message.error("发布数量不能为空");
      }
    },
    openCenter() {
      var data_content = [];
      for (var i = 0, p = this.sendContent.length; i < p; i++) {
        data_content.push({
          sendContent: this.sendContent[i].sendContent,
          sendNumber: this.sendContent[i].sendNumber
        });
      }
      this.$axios
        .post("/Twitter/Tweet", {
          twitterAccountType: this.form.resource,
          sendContentList: data_content
        })
        .then(res1 => {
          if (res1.data.code == 0) {
            this.$message({
              message: "发推任务提交成功！",
              type: "success",
              center: true
            });
            this.$router.push({ path: "/ReleaseExecuting" });
          } else if (!res1.data.code == 0) {
            let erro = res1.data.message;
            this.$message({
              message: "创建失败:" + erro,
              type: "error",
              center: true
            });
            return;
          } else {
            this.$message.error("发推内容不能为空");
            return false;
          }
        });
    },

    table_number() {
      var numb = "";
      if (this.form.resource == 2) {
        numb = this.isGive.privateAccount.tweetResidueCount;
      }
      if (this.form.resource == 1) {
        numb = this.isGive.publicAccount.tweetResidueCount;
      }
      var he = this.sendContent.reduce((r, s) => {
        return r * 1 + s.sendNumber * 1;
      }, 0);

      for (var i = 0, p = this.sendContent.length; i < p; i++) {
        this.hhh = this.sendContent[i].sendNumber
          ? this.sendContent[i].sendNumber
          : 0;
        if (this.hhh <= 0) {
          this.sendContent[i].hml = "发布数量不能小于等于0";
          this.sendContent[i].hk1 = true;
        } else {
          if (he > numb * 1) {
            this.sendContent[i].hml = "发布数量不能大于剩余数量";
            this.sendContent[i].hk1 = true;
          } else {
            this.sendContent[i].hml = "";
            this.sendContent[i].hk1 = false;
          }
        }
      }
    },
    onSubmit() {
      //
      for (var i = 0, p = this.sendContent.length, z = 0; i < p; i++) {
        // 便利所有列表
        if (!this.sendContent[i].hk1) {
          // 判断 发布推文 inpt 是否 有 错误
          if (!!this.sendContent[i].sendContent.trim()) {
            if (i == p - 1 && z == 0) {
              this.flag = false;
              this.flag1 = true;
              this.tijiao = true;
              this.isSet = false;
            }
          } else {
            z++;
            document.getElementsByClassName("nrcont")[i].style.border =
              "1px solid red";
            document
              .getElementsByClassName("nrcont")
              [i].setAttribute("placeholder", "内容不能为空");
          }
        } else {
          if (!!this.sendContent[i].sendContent.trim()) {
          } else {
            z++;
            document.getElementsByClassName("nrcont")[i].style.border =
              "1px solid red";
            document
              .getElementsByClassName("nrcont")
              [i].setAttribute("placeholder", "内容不能为空");
          }
          break;
        }
      }
    },
    onCallk() {
      this.isSet = false;
      this.flag = true;
      this.flag1 = false;
      this.tijiao = false;
      if (this.sendContent.length > 1) {
        this.isSet = true;
      }
    }
  }
};
</script>
<style scoped>
.ftzh {
  background: url(../../assets/img/ftzh.png) no-repeat left;
  text-indent: 30px;
  width: 100%;
  border-bottom: 1px solid #d5d7dd;
  padding: 12px 0 8px 0;
  margin: 30px 0 24px 0;
  line-height: 24px;
}
.bianji {
  background: url(../../assets/img/icons8.png) no-repeat left;
  text-indent: 30px;
  width: 200px;
  line-height: 24px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}
.ysr {
  font-size: 14px;
  position: absolute;
  right: 10px;
  bottom: 50px;
  color: #303132;
}
.el-input {
  width: 130px !important;
}
.lineq {
  margin-top: 21px;
  margin-bottom: 14px;
}
.ftnr i:hover {
  cursor: pointer;
  display: block;
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
}
.tiaoshu {
  display: flex;
  margin-top: 14px;
}
.tiaoshu span {
  color: #606266;
  font-size: 14px;
  margin: 6px 8px 0px 0;
}
.form-box {
  margin: 0 auto;
}
.hk {
  border: 1px solid red;
  border-radius: 4px;
  z-index: 999;
}
input {
  outline: none;
}
.fwnrw {
  overflow-y: scroll;
  min-height: 200px;
}
.ftnr {
  margin-bottom: 10px;
  position: relative;
  width: 600px;
}
.el-breadcrumb {
  border-bottom: 1px solid rgba(213, 215, 221, 1);
}
.tiaoshu .dw {
  position: absolute;
  top: 30px;
  left: 0px;
  margin: 0;
  width: 200px;
  /* text-align: center; */
  color: red;
}
i {
  color: #f56c6c;
  position: absolute;
  top: 23px;
  right: -9px;
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
.yuanshi {
  position: absolute;
  top: 40px;
  left: -20px;
}
.ftnrw {
  position: relative;
  /* max-height: 500px; */
  width: 640px;
  /* overflow-y: scroll */
}
.yuanshi,
.lists {
  color: #606266;
  font-size: 14px;
}
.lists {
  position: absolute;
  top: 40px;
  left: -20px;
}
</style>