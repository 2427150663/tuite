<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">账号解封</div>
        <div class="btns">
          <el-button type="danger" icon="el-icon-delete" @click="delAll()" plain>批量删除账号</el-button>
        </div>
      </el-breadcrumb>
      <div class="zhjfcont">以下账号为被已封禁贵单位私有账号，请通过境外直连通道，依次登录twitter网站，根据提示解封，对于永久封禁的账号建议删除！</div>
    </div>
    <div class="container">
      <div class="contw">
        <div class="tabSeach">
          <div style="width:420px">
            手机号/账号/备注
            <el-input
              v-model="select_word"
              placeholder="筛选关键词"
              class="handle-input mr10"
              style="width:260px"
            ></el-input>
          </div>
          <el-button
            size="medium"
            style="height:38px"
            type="primary"
            icon="el-icon-search"
            @click="chaXun()"
          >查询</el-button>
          <el-button
            size="medium"
            style="height:38px;margin-left:40px"
            type="primary"
            plain
            @click="select_word=''"
          >重置</el-button>
          <el-button
            size="medium"
            style="height:38px"
            class="shua"
            type="primary"
            @click="chaXun()"
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
          <el-table-column prop="phoneNumber" label="手机号" width="150"></el-table-column>
          <el-table-column prop="loginId" label="账号" width="200"></el-table-column>

          <el-table-column prop="nickName" label="昵称">
            <template slot-scope="scope">
              <span v-if="scope.row.nickName!=''&&scope.row.nickName!=null">{{scope.row.nickName}}</span>
              <span v-else>--</span>
              <!-- {{scope.row.nickName==null?'--':scope.row.nickName}} -->
            </template>
          </el-table-column>

          <el-table-column prop="loginPwd" label="密码"></el-table-column>
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <span
                :class="{yfj: scope.row.stateName === '已封禁', zzdr: scope.row.stateName === '正在导入',drsb: scope.row.stateName === '不可用',zc: scope.row.stateName === '正常'}"
              >{{scope.row.stateName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastErrorMessage" label="异常信息"></el-table-column>
          <el-table-column prop="remark" label="备注" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)">检查状态</el-button>
              <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      tableData: [],
      total: 0,
      pageSize: 5,
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      input1: "",
      input2: "",
      idx: ""
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
  computed: {},
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
    chaXun() {
      this.cur_page = 1;
      this.getData();
    },
    // 获取列表数据
    getData() {
      const rLoading = this.openLoading();
      this.$axios
        .get("/TwitterAccount/Search", {
          params: {
            key: this.select_word,
            state: 2,
            pageindex: this.cur_page,
            pagesize: this.pageSize
          }
        })
        .then(data => {
          rLoading.close();
          if (data.data.code == 0) {
            this.tableData = data.data.data.list;
            this.cur_page = data.data.data.pageIndex;
            this.total = data.data.data.count; //
          }
          if (data.data.code == 1000) {
            window.open(
              "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
              "_self"
            );
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
    handleEdit(index, row) {
      const rLoading = this.openLoading();
      this.$axios
        .get("/TwitterAccount/CheckTwitterAccount", {
          params: {
            TwitterAccountId: row.twitterAccountId
          }
        })
        .then(res => {
          rLoading.close();
          this.getData();
          this.$message.success(res.data.message);
        });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {
      this.$confirm(
        "此操作将永久删除 " +
          this.multipleSelection.length +
          " 条账户信息, 是否继续?",
        "提示",
        {
          type: "warning"
        }
      ).then(() => {
        this.$axios
          .post("/TwitterAccount/DeleteByIds", {
            twitterAccountIds: this.multipleSelection
          })
          .then(response => {
            this.$message.success("删除成功！");
            var len = this.total - this.multipleSelection.length;
            var num = this.pageSize;
            var brrNum =
              len % num === 0 ? len / num : Math.floor(len / num + 1);
            if (this.cur_page > brrNum) {
              this.cur_page = brrNum;
              this.$router.push({
                query: { page: this.cur_page, pageSize: this.pageSize }
              });
            }
            this.getData();
            //   this.multipleSelection = [];
          });
      });
    },
    handleSelectionChange(val) {
      var arr = [];
      val.forEach(x => {
        arr.push(x.twitterAccountId);
      });
      this.multipleSelection = arr;
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post("/TwitterAccount/DeleteByIds", {
          twitterAccountIds: this.tableData[this.idx].twitterAccountId
        })
        .then(response => {
          var len = this.total - 1;
          var num = this.pageSize;
          var brrNum = len % num === 0 ? len / num : Math.floor(len / num + 1);
          if (this.cur_page > brrNum) {
            this.cur_page = brrNum;
            this.$router.push({
              query: { page: this.cur_page, pageSize: this.pageSize }
            });
          }
          this.getData();
          this.$message.success("删除成功");
          this.delVisible = false;
        });
    }
  }
};
</script>

<style scoped lang="less">
.btns {
  float: right;
  margin: 14px 24px 14px 0;
}
.lineq {
  margin-top: 18px;
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
}
.zhjfcont {
  /* width:1071px; */
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
