<template>
  <div class="bai">
    <div class="container">
      <div class="form-box">
        <div class="ftnrw">
          <div class="bianji">
            反馈标题
            <i>*</i>
          </div>
          <input type="text" placeholder class="rwbt" />
          <div class="ftnr">
            <div class="bianji">
              反馈内容
              <i>*</i>
              <span>(请您详细说明遇到的情况和申请原因，500汉字以内)</span>
            </div>
            <span></span>
            <textarea name id="nrcont"></textarea>
          </div>
          <div class="bianji">
            联系电话
            <i>*</i>
            <span>(留下您的联系电话，以便我们将处理结果通知给您，我们会严格保密)</span>
          </div>
          <input type="text" placeholder class="rwbt" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "baseform",
  data: function() {
    return {};
  },
  methods: {
    openCenter() {
      this.$message({
        message: "创建成功",
        type: "success",
        center: true
        // iconClass:iconguanbi
      });
    },
    sousuo() {
      if (this.val != "") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    onSubmit() {
      this.flag = true;
      this.flag1 = true;
      this.flag2 = false;
      this.b = true;

      this.$message.success("提交成功！");
    },
    onCallk() {
      this.flag = true;
      this.flag1 = false;
      this.flag2 = true;
      this.b = false;
    }
  },
  created(){}
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
span {
  color: #919398;
  font-size: 14px;
}
#zwq {
  width: 465px !important;
  height: 27px;
  border-radius: 2px;
  border: 1px solid rgba(213, 215, 221, 1);
  font-size: 14px;
  color: #606266;
  padding: 8px;
  border-right: none;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.btn {
  width: 100px !important;
  height: 46px !important;
  font-size: 16px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.rwbt {
  width: 584px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid rgba(220, 222, 227, 1);
  padding: 8px;
  color: #606266;
}
.a {
  border: 1px solid rgba(213, 215, 221, 1) !important;
}
.c {
  border: none !important;
}
h5 {
  width: 100%;
  background: url(../../assets/img/Bitmap.png) no-repeat left;
  height: 16px;
  color: #919398;
  font-size: 12px;
  font-weight: 500;
  margin-top: 12px;
}
h5 span {
  font-size: 12px;
  color: rgba(102, 177, 255, 1);
  margin: 0 0 0 102px;
}
i {
  color: #f56c6c;
  font-size: 18px;
  font-style: normal;
  padding: 0 8px;
  position: relative;
  top: 5px;
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
  background: url(../../assets/img/icons8.png) no-repeat left;
  text-indent: 30px;
  line-height: 24px;
  margin-bottom: 8px;
  font-size: 14px;
  margin-top: 24px;
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
}
.sub-title {
  font-size: 14px;
  margin-bottom: 8px;
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
  margin: 30px 0 20px 0;
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
</style>