<template>
  <div class="table">
    <div class="crumbs">
      <div class="h64">
        <el-button type="primary" plain icon="el-icon-download" @click="downloadExcel()">下载电子表格</el-button>
        <el-button type="primary" plain @click="downLoadImg()" icon="el-icon-download">下载任务截图</el-button>
      </div>
      <div class="xian"></div>
      <div class="container">
        <div class="contw">
          <div class="tabSeach">
            <div style="white-space: nowrap;">
              任务标题
              <el-input v-model="input1" placeholder="标题" style="width:220px;" clearable></el-input>
            </div>
            <div style="width:360px">
              创建时间
              <el-date-picker
                style="width:240px;margin:0 32px 0 16px;"
                v-model="value7"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <el-button
              size="medium"
              style="height:38px"
              type="primary"
              icon="el-icon-search"
              @click="chaSecah()"
            >查询</el-button>
            <el-button
              size="medium"
              style="height:38px;margin-left:40px"
              type="primary"
              plain
              @click="value7='',input1=''"
            >重置</el-button>
            <el-button
              size="medium"
              style="height:38px"
              class="shua"
              type="primary"
              @click="update()"
            >刷新列表</el-button>
          </div>
          <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="autoTaskId" label="任务Id" width="100"></el-table-column>
            <el-table-column prop="title" label="任务标题" width="400"></el-table-column>
            <el-table-column prop="url" label="任务地址" width="400">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
            <el-table-column prop="sate" label="状态">
              <template slot-scope="scope">
                <span
                  :class="{yfj: scope.row.state === 'Pause',zxz: scope.row.state === 'Running',zbks: scope.row.state=== 'Waitting',zc: scope.row.state=== 'Complate'}"
                >{{transAutoTaskState(scope.row.state)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="handleEdit(scope.$index, scope.row)">下载</el-button> -->
                <el-button type="text" class="red">
                  <router-link
                    :to="{ path: '/CommentaryDetails',query:{id:scope.row.autoTaskId,state:'/CommentaryFinished'} }"
                  >详情</router-link>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="cur_page"
              :page-sizes="[5,10,30,50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除提示框 -->
    <el-dialog title="账户删除" :visible.sync="delVisible" width="300px" left>
      <div class="del-dialog-cnt">
        <img src="../../assets/img/delet.png" alt /> 此操作将会永久删除该数据，是否继续？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteRow">确 定</el-button>
        <el-button plain @click="delVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      input1: "",
      value7: "",
      activeName: "second",
      tableData: [],
      total: 100,
      cur_page: 1,
      pageSize: 5,
      multipleSelection: [],
      delVisible: false
    };
  },
  created() {
    if (sessionStorage.getItem("secPageSize")) {
      this.pageSize = sessionStorage.getItem("secPageSize") * 1;
    }
    if (sessionStorage.getItem("secCur_page")) {
      this.cur_page = sessionStorage.getItem("secCur_page") * 1;
    }
    this.getData();
  },
  computed: {},
  methods: {
    //查询
    chaSecah() {
      this.cur_page = 1;
      sessionStorage.setItem("secCur_page", this.cur_page);
      this.update();
    },
    //刷新列表
    update() {
      const rLoading = this.openLoading();
      if (this.value7 == null || this.value7 == "") {
        this.value7 = ["", ""];
      }
      let strttt = "";
      strttt = this.input1.trim().replace(/[\ \"]/g, "%");
      this.$axios
        .post(`/AutoTask/GetCommentList`, {
          CommandType: 2,
          State: 1,
          PageIndex: this.cur_page,
          PageSize: this.pageSize,
          KeyWord: strttt,
          StartTime: this.value7[0],
          EndTime: this.value7[1]
        })
        .then(res3 => {
          rLoading.close();
          if (res3.data.isOk == true) {
            this.tableData = res3.data.data.list;
            this.total = res3.data.data.count * 1;
          } else {
            rLoading.close();
            this.$message({
              type: "info",
              message: "获取失败",
              duration: 800
            });
          }
        })
        .catch(() => {
          rLoading.close();
          this.$message({
            type: "info",
            message: "获取失败",
            duration: 800
          });
        });
    },
    transAutoTaskState(val) {
      if (val === "Waitting") {
        return "准备开始";
      } else if (val === "Running") {
        return "执行中";
      } else if (val === "Pause") {
        return "暂停中";
      } else if (val === "Complate") {
        return "已完成";
      } else if (val === "NotComplate") {
        return "未完成";
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      sessionStorage.setItem("secCur_page", this.cur_page);
      sessionStorage.setItem("secPageSize", this.pageSize);
      this.getData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.cur_page = 1;
      sessionStorage.setItem("secCur_page", this.cur_page);
      sessionStorage.setItem("secPageSize", this.pageSize);
      this.getData();
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      var arr = [];
      val.forEach(x => {
        arr.push(x.autoTaskId);
      });
      this.multipleSelection = arr;
      console.log(this.multipleSelection);
    },
    getData() {
      this.update();
    },
    // 下载电子表格
    downloadExcel(scheduleType) {
      if (this.multipleSelection.length < 1) {
        this.$message.info("请选择任务");
        return false;
      }
      const rLoading = this.openLoading();
      this.$axios
        .get("AutoTask/DownLoadTaskDetail", {
          params: {
            taskIds: this.multipleSelection.join(",")
          },
          responseType: "arraybuffer"
        })
        .then(response => {
          rLoading.close();
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "网评任务表.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function(error) {
          rLoading.close();
          _this.$message({
            message: "下载失败",
            type: "info",
            center: true,
            duration: 800
          });
        });
    },
    //  下载图片
    downLoadImg() {
      if (this.multipleSelection.length < 1) {
        this.$message.info("请选择任务");
        return false;
      }
      const rLoading = this.openLoading();
      this.$axios
        .get("Images/DownLoadScreenshot", {
          params: {
            autoTaskId: this.multipleSelection.join(",")
          }
        })
        .then(res => {
          let success = res.data.message;
          let url = res.data.data;
          if (res.data.data != null) {
            this.$axios.get(`${res.data.data}`).then(res => {
              window.location.href = url;
            });
          }
          rLoading.close();
          this.$message.info(success);
        });
    },
    handleClick(tab, event) {},

    handleEdit(index, row) {},
    // 恢复任务
    handleDelete(index, row) {
      let id = this.$route.query.id;
      this.$axios
        .post("/AutoTask/ItemControl", {
          CommandType: 2,
          AutoTaskId: id,
          AutoTaskItemId: row.tweetCommandId,
          ControlType: 2
        })
        .then(res => {
          this.getData();
        });
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success("删除成功");
      this.delVisible = false;
    }
  }
};
</script>
<style scoped lang="less">
/* 发布任务详情 */
.xiangqing {
  padding-left: 24px;
}
.xiangqing h2 {
  font-size: 20px;
  color: #303132;
  margin: 24px 0;
}
.lianjie {
  font-size: 14px;
  color: #66b1ff;
  margin-bottom: 14px;
}
.plist {
  display: flex;
  margin-bottom: 24px;
}
.plist p {
  margin-right: 40px;
  color: #606266;
}
.btns {
  float: right;
  margin: 14px 24px 14px 0;
}
.lineq {
  margin-top: 18px;
  margin-bottom: 18px;
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  border-left: 0;
}
h5 {
  font-weight: 500;
  color: #303431;
  display: inline;
  padding: 0 12px 0 24px;
}
.h64 {
  line-height: 64px;
  padding-left: 24px;
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
  padding-top: 0px;
}
.hong {
  color: "red";
}
.xian {
  height: 20px;
  background: rgba(243, 246, 247, 1);
}

.cen {
  display: flex;
  align-items: center;
}
.tabSeach {
  .cen;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  div {
    width: 300px;
    padding-left: 20px;
    .cen;
  }
  .shua {
    position: absolute;
    top: 12px;
    right: 40px;
  }
}
</style>
