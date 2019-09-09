<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq" style="font-size:14px;border-left: 2px solid #66B1FF;">跟评列表</div>
      </el-breadcrumb>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="执行中任务" name="/CommentaryExecuting"></el-tab-pane>
        <el-tab-pane label="已完成任务" name="/CommentaryFinished"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
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
      activeName: "/CommentaryExecuting",
      multipleSelection: [],
      delVisible: false
    };
  },
  components: {},
  created() {
    this.activeName = this.$router.history.current.fullPath;
    this.getData();
    if (sessionStorage.getItem("activeNameCommentary")) {
      this.activeName = sessionStorage.getItem("activeNameCommentary");
    }
    sessionStorage.setItem("releingCur_page", 1);
    sessionStorage.setItem("releCur_page", 1);
  },
  computed: {},
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      //   this.getData();
    },
    handleSizeChange(val) {},
    // 获取 easy-mock 的模拟数据
    getData() {},
    handleClick(tab, event) {
      this.$router.push({ path: tab.name });
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
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

<style scoped>
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
</style>
