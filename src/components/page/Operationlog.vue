<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">操作日志</div>
      </el-breadcrumb>
      <div class="handle-box">
        <div class="block">
          <span class="demonstration">日期</span>
          <el-date-picker
            style="width:240px;margin:0 32px 0 16px;"
            v-model="value6"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button type="primary" icon="el-icon-search" @click="getData()">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="contw">
        <el-table :data="tableData" border class="table">
          <el-table-column prop="id" align="center" label="操作人" width="150"></el-table-column>
          <el-table-column prop="clientIp" label="操作IP" align="center" width="120"></el-table-column>
          <el-table-column prop="logContent" label="内容" align="center"></el-table-column>
          <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" width="180" align="center"></el-table-column>
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
export default {
  name: "basetable",
  data() {
    return {
      value6: [],
      tableData: [],
      total: 0,
      cur_page: 1,
      pageSize: 5,
      multipleSelection: []
    };
  },
  created() {
    if (this.$route.query.page) {
      this.cur_page = this.$route.query.page * 1;
      this.pageSize = this.$route.query.pageSize * 1;
    } else {
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
    }
    this.getData();
    sessionStorage.clear();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.getData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.cur_page = 1;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.getData();
    },
    // 获取列表数据
    getData() {
      const rLoading = this.openLoading();
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      let timre = this.value6;
      if (timre == null || timre.length < 1) {
        timre = ["1/1/1753 12:00:00 AM", "12/31/9999 11:59:59 PM"];
      }
      this.$axios
        .get("/SysLog/Serch", {
          params: {
            StartTime: timre[0],
            EndTime: timre[1],
            pageindex: this.cur_page,
            pagesize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.isOk == true) {
            rLoading.close();
            this.tableData = res.data.data.list;
            this.cur_page = res.data.data.pageIndex;
            this.total = res.data.data.count;
          } else {
            rLoading.close();
          }
          if (res.data.code == 1000) {
            window.open(
              "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
              "_self"
            );
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
  }
};
</script>

<style scoped>
.lineq {
  margin-top: 18px;
  margin-bottom: 14px;
}
.demonstration {
  margin-left: 24px;
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
}
</style>
