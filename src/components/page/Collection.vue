<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">推文采集</div>
      </el-breadcrumb>
      <div class="zhjfcont">1.可添加20个账号进行推文采集；2.系统每次更新数据时，默认采集twitter账号最新5条推文；</div>
    </div>
    <div class="container">
      <div class="bai">
        <div class="left">
          <div class="lists">
            <div style="margin:0 16px;position: relative;">
              <div id="poos">
                <div class="rmTui" @click="rmtui()">
                  <span class="el-icon-error"></span> 删除
                </div>
                <div class="addTui" @click="adduser()">
                  <span class="el-icon-circle-plus-outline"></span> 新增账号
                </div>
              </div>
              <el-table
                :data="tableData"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
                style="width: 100%"
              >
                <el-table-column type="selection" width="20"></el-table-column>
                <el-table-column label="全选" width="65">
                  <template slot-scope="scope">
                    <img
                      width="48"
                      height="48"
                      v-lazy="scope.row.headImg"
                      :key="scope.row.headImg"
                      @click="toggleSelection([scope.row])"
                      style="cursor: pointer;"
                    />
                  </template>
                </el-table-column>
                <el-table-column width="190">
                  <template slot-scope="scope">
                    <a
                      class="jcu aurl"
                      style="font-size:14px;font-weight: 600; cursor: pointer"
                      :href="scope.row.hostUrl"
                      target="_blank"
                    >{{scope.row.nickName}}</a>
                    <p class="jcu" style="font-size:13px;color:#bcc4ca;">@{{scope.row.accountName}}</p>
                    <p class="pbtom" style="font-size:12px">{{scope.row.introduction}}</p>
                  </template>
                </el-table-column>
              </el-table>
              <div id="fig" v-show="tabFlag">
                <div class="el-icon-loading"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="sx">
            已选账号获取最新推特条数：
            <el-radio-group v-model="radio2">
              <el-radio :label="1">1</el-radio>
              <el-radio :label="2">2</el-radio>
              <el-radio :label="3">3</el-radio>
              <el-radio :label="4">4</el-radio>
              <el-radio :label="5">5</el-radio>
            </el-radio-group>
            <el-button
              type="primary"
              icon="el-icon-search"
              style="margin-left:20px"
              @click="souSuo()"
            >搜索</el-button>
            <el-button type="primary" @click="xYc()" style="margin-left:20px">选舆材</el-button>
          </div>
          <div class="rightcont flex" v-for="(item,index) in rightcont" :key="index">
            <div class="Cleft">
              <div>
                <div class="flex">
                  <div class="ccLeft">
                    <img
                      width="48"
                      class="img2"
                      height="48"
                      v-lazy="item.headImg"
                      :key="item.headImg"
                    />
                  </div>
                  <div class="ccRight">
                    <div class="cT1">
                      <a
                        class="jcu aurl"
                        style="font-size:14px;font-weight: 600; cursor: pointer"
                        :href="item.hostUrl"
                        target="_blank"
                      >{{item.nickName}}</a>
                      <span
                        style="font-size:13px;color:#bcc4ca;margin-left:8px"
                      >{{item.accountName}}</span>
                    </div>
                    <div class="ct2" style="width: 500px;overflow-wrap: break-word;">
                      {{item.content}}
                      <br />
                      <a :href="item.url" target="_blank">{{item.url}}</a>
                    </div>
                  </div>
                </div>
                <div class="clear"></div>
                <div class="ccbottom" style="font-size:13px;color:#bcc4ca">{{item.publishTime}}</div>
              </div>
            </div>
            <div class="Cright">
              <div class="ccTop">评论内容：</div>
              <div class="flex">
                <textarea
                  :disabled="item.tijiao"
                  @input="changeText(item.groupName,index)"
                  @click="reset($event)"
                  ref="groupName1"
                  v-model="item.groupName"
                  id="nrcont"
                  class="nrcont"
                ></textarea>
                <div class="an">
                  <el-button plain icon="el-icon-check" @click="ti(item)" v-if="!item.tijiao">提交</el-button>
                  <span v-if="item.tijiao" style="font-size:50px">{{item.num1}}</span>
                </div>
              </div>
              <div v-show="!item.tijiao" style="margin-top:10px;float:right;margin-right:120px">
                <p class="ysr" v-if="!item.ysr">
                  {{item.tips}}
                  <span>{{item.max_str}}/256</span>个字符
                </p>
                <p class="ysr" v-if="item.ysr">{{item.tips}}256个字符</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增账号提示框 -->
    <el-dialog
      :visible.sync="addVisible"
      width="300px"
      :close-on-click-modal="false"
      :lock-scroll="false"
      left
    >
      <div id="box3">
        <div class="add">新增账号</div>
        <div class="tt t1 flex">
          <div class="lieLeft">主页链接搜索</div>
          <div class="lieZhong">
            <el-input v-model="boxIpt1" placeholder="主页链接" clearable></el-input>
          </div>
          <div class="sou">
            <el-button type="primary" icon="el-icon-search" @click="seach()">搜索</el-button>
          </div>
        </div>
        <div class="tt t2" v-show="searchl">
          <div class="top">搜索结果:</div>
          <div class="lie flex">
            <div class="lieLeft">账号名称:</div>
            <div class="lieRight flex atm" style="padding-top:2px">{{seachObj.accountName}}</div>
          </div>
          <div class="lie flex">
            <div class="lieLeft">账号头像:</div>
            <div class="lieRight">
              <div id="img">
                <div id="imgPreview"></div>
                <div id="ks">
                  <div id="ksapp">
                    <img
                      width="48"
                      class="img2"
                      height="48"
                      v-lazy="seachObj.headImg"
                      :key="seachObj.headImg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lie flex">
            <div class="lieLeft">账号简介:</div>
            <div class="lieRight" style="width:300px;padding-top:10px">{{seachObj.introduction}}</div>
          </div>
          <div class="di">
            <el-button size="medium" type="primary" @click="newAdd(seachObj.accountName)">确认添加</el-button>
          </div>
        </div>
        <div v-show="seachLoad" id="jiaLoad">
          <div class="el-icon-loading" style="font-size:30px;"></div>
          <div>加载中</div>
        </div>
        <div v-show="seachNull" id="jiaNull">暂无此账号，请查证后重新输入</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  name: "basetable",
  data() {
    return {
      tabFlag: false,
      seachNull: false,
      seachLoad: false,
      load: true,
      PageIndex: 1,
      searchl: false,
      ysr: false,
      seachObj: {},
      boxIpt1: "",
      boxIpt2: "",
      boxIpt3: "",
      text: "",
      xian: false,
      radio2: 1,
      pics: false,
      num: false,
      num1: "",
      tableData: [],
      rightcont: [],
      del_list: [],
      is_search: false,
      addVisible: false,
      val: "",
      multipleSelection: [],
      idx: "",
      rmInx: [],
      tijiao1: false,
      placeholder: "评论内容,每行一个",
      tips: "已输入",
      max_str: 0,
      xiuFlag: true,
      addFlag: false,
      seachUrl: false,
      addNum: 0,
      addUserUrl: ""
    };
  },
  created() {
    sessionStorage.clear();
  },
  computed: {},
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    ti(val) {
      if (val.groupName.trim() == "") {
        this.$message({
          message: "内容不能为空",
          type: "info",
          center: true,
          duration: 800
        });
        return false;
      }
      if (!this.xiuFlag) {
        this.$alert("舆材内容超出不可添加", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (val.groupName.split(/[(\r\n)\r\n]+/).length > 0) {
        val.tijiao = true;
        let arr = [];
        val.groupName.split(/[(\r\n)\r\n]+/).forEach(x => {
          if (x.trim() != "") {
            arr.push(x);
          }
        });
        val.num1 = arr.length;
        this.$axios
          .post("/Twitter/Comment", {
            twitterAccountType: 2,
            Sleep: 2,
            ReTweetCount: 0,
            likeCount: 0,
            sendContentList: arr,
            tweetId: val.tweetId,
            tweetUrl: val.url,
            title: val.content.substr(0, 128)
          })
          .then(res1 => {
            if (res1.data.code == 0) {
              this.$message({
                message: "创建成功",
                type: "success",
                center: true,
                duration: 800
              });
            } else if (!res1.data.code == 0) {
              let erro = res1.data.message;
              this.$message({
                message: "创建失败:" + erro,
                type: "error",
                center: true,
                duration: 800
              });
              return;
            } else if (this.form.biaoti && this.form.conts === "") {
              this.$message({
                message: "创建内容不能为空",
                type: "success",
                center: true,
                duration: 800
              });
            }
          });
      } else {
        return false;
      }
    },
    reset($event) {
      $event.target.style.border = "1px solid rgba(213, 215, 221, 1)";
      $event.target.setAttribute("placeholder", "评论内容,每行一个");
    },
    // 验证发推内容不超过256个字符
    changeText(str, inx) {
      if (str.trim() == "") {
        this.rightcont[inx].max_str = 0;
        return false;
      }
      // 将textare中的内容已换行符切割成数组
      let contsarr = str.split(/[(\r\n)\r\n]+/);
      for (let i = 0, p = contsarr.length; i < p; i++) {
        let leng = this.validateTextLength2(contsarr[i]);
        if (leng > 256) {
          this.rightcont[inx].ysr = true;
          this.rightcont[inx].tips = "第" + (i + 1) + "行已超过";
          this.xiuFlag = false;
          document.getElementsByClassName("ysr")[inx].style.color = "red";
          return false;
        } else {
          this.rightcont[inx].ysr = false;
          this.rightcont[inx].max_str = leng;
          this.rightcont[inx].tips = "已输入";
          this.xiuFlag = true;
          document.getElementsByClassName("ysr")[inx].style.color = "#606266";
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
    //推文条目搜索
    souSuo() {
      let ids = [];
      this.multipleSelection.forEach(x => {
        ids.push(x.followId);
      });
      if (ids.length < 1) {
        this.$message({
          message: "请选择账号",
          type: "warning",
          duration: 800
        });
        return false;
      }
      const rLoading = this.openLoading();
      this.rightcont = [];
      ids.forEach((x, i) => {
        this.$axios
          .post(`Follow/GetLastTweet`, {
            FollowId: x,
            Count: this.radio2
          })
          .then(res => {
            if (res.data.isOk) {
              let arr = [];
              arr = res.data.data;
              arr.forEach(x => {
                x.valtit = "";
                x.tijiao = false;
                x.tiOver = false;
                (x.placeholder = ""),
                  (x.ysr = false),
                  (x.max_str = 0),
                  (x.tips = "已输入"),
                  (x.groupName = ""),
                  (x.num1 = "");
                x.state = false;
              });
              arr.forEach(x => {
                this.rightcont.push(x);
              });
              if (i == ids.length - 1) {
                if (this.rightcont.length < 1) {
                  this.$message({
                    type: "info",
                    message: "已选账号无最新推特条数",
                    duration: 800
                  });
                }
                rLoading.close();
              }
            } else {
              if (i == ids.length - 1) {
                if (this.rightcont.length < 1) {
                  this.$message({
                    type: "info",
                    message: "已选账号无最新推特条数",
                    duration: 800
                  });
                }
                rLoading.close();
              }
            }
          })
          .catch(() => {
            if (i == ids.length - 1) {
              if (this.rightcont.length < 1) {
                this.$message({
                  type: "info",
                  message: "已选账号无最新推特条数",
                  duration: 800
                });
              }
              rLoading.close();
            }
          });
      });
    },
    //获取账户信息
    getUser() {
      this.tabFlag = true;
      this.load = false;
      this.$axios
        .post(`Follow/List`, {
          PageIndex: 1,
          PageSize: 20
        })
        .then(res => {
          if (res.data.isOk) {
            this.load = true;
            let arr = [];
            arr = res.data.data.list;

            this.tableData = arr;
            this.tabFlag = false;
            document.querySelector(".el-table__empty-text").style.display =
              "block";
          } else {
            this.tabFlag = false;
            document.querySelector(".el-table__empty-text").style.display =
              "block";
          }
        })
        .catch(() => {
          this.tabFlag = false;
          document.querySelector(".el-table__empty-text").style.display =
            "block";
        });
    },
    xYc() {
      window.open("http://jwp.yuqing.pro:89/Index.html#/Yucai?page=1&pageSize=10", "_blank");
    },
    //新增账号添加
    newAdd() {
      if (this.addFlag) {
        return false;
      }
      this.addFlag = true;
      const rLoading = this.openLoading();
      this.$axios
        .post(`Follow/Add`, {
          HostUrl: this.addUserUrl
        })
        .then(res => {
          rLoading.close();
          this.addFlag = false;
          if (res.data.isOk) {
            this.addVisible = false;
            this.PageIndex = 1;
            this.tableData = [];
            this.getUser();
            this.$message({
              type: "success",
              message: res.data.message,
              duration: 800
            });
          } else {
            this.$message({
              type: "info",
              message: res.data.message,
              duration: 800
            });
            return false;
          }
        });
    },
    //新增账号搜索
    seach() {
      this.addNum = 0;
      var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      if (reg.test(this.boxIpt1)) {
        this.seachLoad = true;
        this.searchl = false;
        this.seachNull = false;
        if (this.seachUrl) {
          return false;
        }
        this.seachUrl = true;
        this.addUserUrl = this.boxIpt1;
        this.addSeach();
      } else {
        this.$message.info({
          message: "请输入正确网址!",
          duration: 500
        });
        return false;
      }
    },
    addSeach() {
      let over;
      if (this.addNum == 5) {
        this.seachLoad = false;
        this.searchl = false;
        this.seachNull = true;
        return false;
      }
      if (!this.addVisible) {
        this.seachLoad = false;
        this.searchl = false;
        this.seachNull = false;
        if (over) {
          over.abort();
        }
        return false;
      }
      over = this.$axios
        .get(`Follow/GetHost`, {
          params: {
            HostUrl: this.boxIpt1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.accountName == "") {
              this.seachUrl = false;
              this.addNum++;
              this.addSeach();
            } else {
              this.searchl = true;
              this.seachNull = false;
              this.seachObj = res.data.data;
              this.seachLoad = false;
              this.seachUrl = false;
              this.addNum = 5;
            }
          } else {
            this.seachUrl = false;
            this.addNum++;
            this.addSeach();
          }
        });
    },
    //删除可选用户
    rmtui() {
      let ids = [];
      this.multipleSelection.forEach(x => {
        ids.push(x.followId);
      });
      if (this.multipleSelection.length < 1) {
        return false;
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ids.forEach((x, i) => {
            this.$axios
              .post(`Follow/Delete`, {
                id: x
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.PageIndex = 1;
                  this.tableData = [];
                  if (i == ids.length - 1) {
                    this.getUser();
                  }
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                    duration: 800
                  });
                }
              });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 800
          });
        });
    },
    // 添加账号
    adduser() {
      if (this.tableData.length == 20) {
        this.$message({
          type: "info",
          message: "最多只能添加20个账号",
          duration: 800
        });
      } else {
        this.addVisible = true;
        this.searchl = false;
        this.seachLoad = false;
        this.seachNull = false;
        this.boxIpt1 = "";
      }
    },
    //左侧选择的id集合
    handleSelectionChange(val) {
      // 全选 和 单选 事件  返回  被选DOM
      this.multipleSelection = val;
      //获取选择的id
      console.log(val);
      //this.lists();
    }
  },
  mounted() {
    this.getUser();
    document.querySelector(".el-table__empty-text").style.display = "none";
  }
};
</script>
<style scoped lang="less">
.aurl {
  color: #303132 !important;
}
.aurl:hover {
  text-decoration: underline;
}
img {
  border-radius: 50%;
}
#jiaLoad {
  height: 200px;
  padding-top: 80px;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
#jiazai {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    cursor: pointer;
  }
}
.flex {
  display: flex;
}
.atm {
  align-items: center;
}
#poos {
  position: absolute;
  top: 18px;
  left: 60px;
  z-index: 9999;
  display: flex;
}
#poos div {
  margin-left: 20px;
  cursor: pointer;
}
.tjia,
.qxiao {
  height: 36px !important;
  line-height: 10px !important;
}
.picsr {
  margin-left: 16px;
}
.pics {
  display: flex;
  margin-left: 152px;
  margin-top: 28px;
}
#zwq {
  width: 237px;
  height: 32px;
  margin-left: 16px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.btns {
  width: 68px;
  height: 36px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  position: relative;
  top: 1px;
  left: -1px;
  padding: 0;
}
.plnr {
  position: relative;
  top: -80px;
}
.jcu {
  // padding-top: 10px;
  color: #303132;
  font-size: 14px;
  // font-weight: 600;
}
.pbtom {
  padding-bottom: 10px;
  color: #1e1e1e;
  font-size: 14px;
}
.el-table thead {
  background: #66b1ff !important;
}
.plist {
  margin-bottom: 24px;
  p {
    line-height: 40px;
  }
}
.conts textarea::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.25);
}
.conts textarea {
  height: 88px;
  width: 468px;
  border-radius: 4px;
  color: #606266;
  padding: 5px 0 0 12px;
  font-size: 14px;
  border: 1px solid rgba(217, 217, 217, 1);
  resize: none;
}
.conts b {
  font-size: 58px;
  font-weight: 800;
  color: rgba(145, 147, 152, 1);
}
.rightcont {
  // height: 204px;
  border-bottom: 1px solid #d5d7dd;
}
.rightcont h3 {
  color: #303132;
  font-size: 16px;
  margin: 24px 0;
  font-weight: normal;
}
.nrcont {
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
#fig {
  height: 80px;
  font-size: 40px;
  color: gainsboro;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -70px;
}
.plist p {
  margin-right: 40px;
  color: #606266;
  font-size: 12px;
}
.lineq {
  margin: 18px 0;
}
.btn {
  margin: 28px 0 28px 24px;
}
.bai {
  display: flex;
  // min-height: 512px;
  // height: 70vh;
  padding-bottom: 25px;
}
.left {
  // overflow-y: scroll;
  border-right: 1px solid #d5d7dd;
}
.right {
  /* width: 781px; */
  width: 100%;
  margin: 0 16px;
}
.sx {
  line-height: 67px;
  border-bottom: 1px solid #d5d7dd;
  font-size: 14px;
  color: #606266;
  padding-left: 8px;
}
.clear {
  clear: both;
}
h5 {
  font-weight: 500;
  color: #303431;
  display: inline;
  padding: 0 12px 0 24px;
}
.crumbs {
  background: #fff;
  box-sizing: border-box;
}
.el-breadcrumb {
  border-bottom: 1px solid rgba(213, 215, 221, 1);
}
.handle-box {
  margin-top: 24px;
  padding-bottom: 24px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #66b1ff;
}
.mr10 {
  margin-right: 10px;
}
.container {
  padding-left: 0px;
  margin-bottom: 20px;
}
.zhjfcont {
  width: 100%;
  box-sizing: border-box;
  line-height: 56px;
  background: rgba(102, 177, 255, 0.2);
  color: #66b1ff;
  font-size: 14px;
  padding-left: 24px;
}
.hong {
  color: "red";
}
/* .content{
    padding: 0 0 0 0!important;
} */
.cen {
  text-align: center;
}
.flex {
  display: flex;
}
.conts p {
  padding-left: 4 00px;
}
#box3 {
  .add {
    font-size: 22px;
    margin-bottom: 10px;
    .cen;
  }
  input {
    outline: none;
  }
  .tt {
    align-items: center;
    .lieLeft {
      width: 97px;
      height: 40px;
      line-height: 40px;
      text-align: right;
      padding-right: 10px;
    }
    .lie {
      margin-bottom: 15px;
    }
  }
  .t1 {
    .sou {
      margin-left: 10px;
    }
  }
  .t2 {
    margin-top: 20px;
    .top {
      padding-left: 12px;
    }
    .di {
      margin: auto;
      button {
        display: block;
        margin: auto;
        margin-top: 5px;
      }
    }
  }
}

#ks {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  position: relative;
}

#ksapp {
  width: 80px;
  height: 80px;
  z-index: 99;
  font-size: 32px;
  position: absolute;
  text-align: center;
  line-height: 80px;
  top: 0;
  left: 0;
  .img2 {
    width: 80px;
    height: 80px;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }
}

#upImg #chooseImage {
  width: 70px;
  height: 80px;
  opacity: 1;
  z-index: 100;
  position: absolute;
  cursor: pointer;
  left: 130px;
}
#jiaNull {
  height: 300px;
  line-height: 300px;
  text-align: center;
}
.rightcont {
  padding: 20px;
  .Cleft {
    display: flex;
    align-items: center;
    img {
      margin: 15px;
    }
  }
  .Cright {
    .ccTop {
      margin-bottom: 10px;
    }
    .an {
      width: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.Cleft,
.Cright {
  width: 600px;
  padding: 0px 20px;
  box-sizing: border-box;
}
</style>
