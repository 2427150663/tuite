<template>
  <div class="table">
    <div class="xian"></div>
    <div class="container">
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
      <div class="contw">
        <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="autoTaskId" label="任务Id" width="150" align="center"></el-table-column>
          <el-table-column prop="title" label="任务标题" width="400"></el-table-column>
          <!-- <el-table-column prop="url" label="任务地址" width="400">
            <template slot-scope="scope">
              <a v-if="scope.row.url!=''" :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
              <span v-else>---</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="count" label="数量" align="center"></el-table-column>
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <span
                :class="{yfj: scope.row.state === 'Pause',zbks: scope.row.state === 'Running',zxz: scope.row.state=== 'Waitting',zc: scope.row.state=== 'Complate'}"
              >{{transAutoTaskState(scope.row.state)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text">
                <router-link
                  :to="{ path: '/Details',query:{id:scope.row.autoTaskId,state:'/ReleaseExecuting'}}"
                >详情</router-link>
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.state=== 'Waitting'||scope.row.state=== 'Running'||scope.row.state=== 'NotComplate'"
                @click="handleSuspend(scope.$index, scope.row)"
              >终止</el-button>
              <el-button
                type="text"
                v-if="scope.row.state=== 'Pause'||scope.row.state=== 'NotComplate'"
                @click="handleImplement(scope.$index,scope.row)"
              >启动</el-button>
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
</template>

<script>
import home from "./Home";
import { isArray } from "util";
export default {
  name: "basetable",
  data() {
    return {
      input1: "",
      value7: "",
      activeName: "second",
      total: 0,
      pageSize: 5,
      cur_page: 1,
      tableData: [],
      cur_page: 1,
      multipleSelection: []
    };
  },
  created() {
    if (sessionStorage.getItem("releingPageSize")) {
      this.pageSize = sessionStorage.getItem("releingPageSize") * 1;
    }
    if (sessionStorage.getItem("releingCur_page")) {
      this.cur_page = sessionStorage.getItem("releingCur_page") * 1;
    }
    this.getData();
  },
  computed: {},
  methods: {
    //查询
    chaSecah() {
      this.cur_page = 1;
      sessionStorage.setItem("releingCur_page", this.cur_page);
      this.update();
    },
    //刷新列表
    update() {
      const rLoading = this.openLoading();
      if (this.value7 == null || this.value7 == "") {
        this.value7 = ["", ""];
      }
      let sttr = "";
      sttr = this.input1.trim().replace(/[\ \"]/g, "%");
      this.$axios
        .post(`/AutoTask/GetCommentList`, {
          CommandType: 1,
          State: 2,
          PageIndex: this.cur_page,
          PageSize: this.pageSize,
          KeyWord: sttr,
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
              message: "暂无数据",
              duration: 800
            });
          }
        })
        .catch(() => {
          rLoading.close();
          this.$message({
            type: "info",
            message: "暂无数据",
            duration: 800
          });
        });
    },
    //枚举转换
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
      sessionStorage.setItem("releingCur_page", this.cur_page);
      sessionStorage.setItem("releingPageSize", this.pageSize);
      this.getData();
    },
    handleSizeChange(val) {
      this.cur_page = 1;
      this.pageSize = val;
      sessionStorage.setItem("releingCur_page", this.cur_page);
      sessionStorage.setItem("releingPageSize", this.pageSize);
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.update();
    },
    handleClick(tab, event) {},
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 暂停
    handleSuspend(index, row) {
      this.$confirm("此操作将暂停此任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("AutoTask/Control", {
              CommandType: 1,
              AutoTaskId: row.autoTaskId,
              ControlType: 1
            })
            .then(res1 => {
              if (res1.data.isOk) {
                this.$message({
                  message: "已暂停",
                  type: "success",
                  center: true,
                  duration: 800
                });
                this.getData();
              } else {
                this.$message({
                  type: "info",
                  message: "已取消",
                  duration: 800
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            duration: 800
          });
        });
    },
    // 执行
    handleImplement(index, row) {
      this.$confirm("此操作将开始执行此任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("AutoTask/Control", {
              CommandType: 1,
              AutoTaskId: row.autoTaskId,
              ControlType: 2,
              pageindex: this.cur_page,
              pagesize: this.pageSize
            })
            .then(res1 => {
              if (res1.data.isOk) {
                this.$message({
                  message: "已执行",
                  type: "success",
                  center: true,
                  duration: 800
                });
                this.getData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
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
  min-width: 1511px;
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
