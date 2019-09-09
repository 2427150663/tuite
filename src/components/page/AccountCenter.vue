<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">账号中心</div>
        <div class="btns">
          <el-button type="primary" plain icon="el-icon-download" @click="importData()">导入账号</el-button>
          <el-button type="primary" plain icon="el-icon-download" @click="download()">下载导入模版</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="del_all()" plain>批量删除账号</el-button>
        </div>
      </el-breadcrumb>
      <div class="handle-box">
        <h5>手机号/账号/备注</h5>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" clearable></el-input>
        <h5>状态</h5>
        <el-select v-model="select_cate" placeholder="全部" class="handle-select mr10">
          <el-option key="4" label="全部" value></el-option>
          <el-option key="1" label="导入中" value="1"></el-option>
          <el-option key="2" label="已封禁" value="2"></el-option>
          <el-option key="3" label="正常" value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="searchlOAD()">搜索</el-button>
      </div>
    </div>
    <div class="container">
      <div class="contw">
        <el-table
          :data="tableData"
          border
          class="tb-edit"
          highlight-current-row
          ref="filterTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" height="56"></el-table-column>
          <el-table-column label="手机号" prop="phoneNumber">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.phoneNumber"
                v-if="scope.row.isSet"
                placeholder="请输入内容"
              ></el-input>
              <span v-else>{{scope.row.phoneNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="loginId" label="账号" height="56" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.loginId"
                v-if="scope.row.isSet"
                placeholder="请输入内容"
              ></el-input>
              <span v-else>{{scope.row.loginId}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="nickName" label="昵称">
            <template slot-scope="scope">
              <span v-if="scope.row.nickName!=''&&scope.row.nickName!=null">{{scope.row.nickName}}</span>
              <span v-else>--</span>
              <!-- {{scope.row.nickName==null?'--':scope.row.nickName}} -->
            </template>
          </el-table-column>

          <el-table-column prop="loginPwd" label="密码" height="56">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.loginPwd"
                v-if="scope.row.isSet"
                placeholder="请输入内容"
              ></el-input>
              <span v-else>{{scope.row.loginPwd}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" height="56">
            <template slot-scope="scope">
              <span
                :class="{'yfj': scope.row.stateName === '已封禁', 'zzdr': scope.row.stateName === '导入中','drsb': scope.row.stateName === '不可用','zc': scope.row.stateName === '正常'}"
              >{{scope.row.stateName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastErrorMessage" label="异常信息" height="56"></el-table-column>
          <el-table-column prop="remark" label="备注" width="200" height="56" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.remark"
                v-if="scope.row.isSet"
                placeholder="请输入内容"
              ></el-input>
              <span v-else>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" height="56">
            <template slot-scope="scope">
              <el-row v-if="!scope.row.isSet">
                <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </el-row>
              <el-row v-else>
                <el-button
                  type="text"
                  v-if="scope.row.isSet"
                  @click="handleSave(scope.$index, scope.row)"
                >保存</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.isSet"
                  @click="handleCancel(scope.$index, scope.row)"
                >取消</el-button>
              </el-row>
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
    <!-- 导入账号 -->
    <el-dialog
      title="导入账号"
      :visible.sync="dialogImportVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="dialog-import"
    >
      <div :class="{'import-content': importFlag == 1, 'hide-dialog': importFlag != 1}">
        <el-upload
          class="upload-demo"
          :name="name"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :with-credentials="withCredentials"
          :http-request="ceshi"
        >
          <!-- 是否支持发送cookie信息 -->
          <h3 style="margin:30px 0 30px 0">选择要导入账号的文件</h3>
          <el-button size="small" type="primary" :disabled="processing">{{uploadTip}}</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
      </div>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="账户删除" :visible.sync="delVisible" width="300px" left>
      <div class="del-dialog-cnt">
        <img src="../../assets/img/delet.png" alt /> 此操作将会永久删除该数据，是否继续？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteRow()">确 定</el-button>
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
      // url: './vuetable.json',
      tableData: [],
      total: 0,
      pageSize: 5,
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      delVisible: false,
      name: "import",
      fileList: [],
      withCredentials: true,
      processing: false,
      uploadTip: "点击上传",
      importFlag: 1,
      dialogImportVisible: false,
      errorResults: []
    };
    idx: "";
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
    this.search();
    sessionStorage.clear();
  },
  computed: {},
  methods: {
    searchlOAD() {
      this.cur_page = 1;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.search();
    },
    ceshi(file) {
      var formFile = new FormData();
      var fileObj = file.file; // js 获取文件对象
      formFile.append("import", fileObj); //加入文件对象
      console.log(fileObj);
      var data = formFile;
      var _this = this;
      $.ajax({
        url: "http://jwp.yuqing.pro:89/TwitterAccount/Import",
        data: data,
        type: "Post",
        dataType: "json",
        /*  xhrFields: {
          withCredentials: true
        }, */
        cache: false, //上传文件无需缓存
        processData: false, //用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须
        success: function(result) {
          _this.uploadTip = "点击上传";
          _this.processing = false;
          if (result.code == -1) {
            _this.errorResults = result.data;
            if (_this.errorResults) {
              _this.importFlag = 2;
            } else {
              _this.fileList = [];
              _this.$message.error("上传失败，请重新上传");
            }
          } else {
            _this.importFlag = 3;
            _this.dialogImportVisible = false;
            console.log(result.data.allCount);
            _this.$message.info(
              `本次导入【共${result.data.allCount}条】【重复${result.data.existsCount}条】【失败${result.data.failCount}条】【成功${result.data.successCount}条】`
            );
            _this.search();
          }
        },
        error: function(error) {
          _this.uploadTip = "点击上传";
          _this.processing = false;
          _this.fileList = [];
          _this.$message.error("上传失败，请重新上传");
        }
      });
    },
    // 导出模板
    download() {
      this.downloadTemplate();
    },
    downloadTemplate(scheduleType) {
      this.$axios
        .get("/TwitterAccount/DownLoadImportTemplate", {
          params: {
            scheduleType: scheduleType
          },
          responseType: "arraybuffer"
        })
        .then(response => {
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "template.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function(error) {
          this.$message.error("下载失败！");
          alert(error);
        });
    },
    // 导入账号
    importData() {
      this.importFlag = 1;
      this.fileList = [];
      this.uploadTip = "点击上传";
      this.processing = false;
      this.dialogImportVisible = true;
    },
    outportData() {
      scheduleApi.downloadTemplate();
    },
    beforeUpload(file) {
      //上传前配置
      // this.importHeaders.cityCode='上海'//可以配置请求头
      let excelfileExtend = ".xls,.xlsx"; //设置文件格式
      let fileExtend = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error("文件格式错误");
        return false;
      }
      this.uploadTip = "正在处理中...";
      this.processing = true;
    },
    // 搜索
    search() {
      const rLoading = this.openLoading();
      this.$axios
        .get("/TwitterAccount/Search", {
          params: {
            key: this.select_word,
            state: this.select_cate,
            pageindex: this.cur_page,
            pagesize: this.pageSize
          }
        })
        .then(data => {
          if (data.data.code == 0) {
            rLoading.close();
            this.tableData = data.data.data.list;
            this.tableData.forEach((value, index) => {
              if (typeof value.isSet === "undefined") {
                this.$set(value, "isSet", false);
              } else {
                value.checked = true;
              }
            });
            this.cur_page = data.data.data.pageIndex;
            this.total = data.data.data.count;
          } else {
            rLoading.close();
          }
          if (data.data.code == 1000) {
            window.open(
              "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
              "_self"
            );
          }
        })
        .catch(error => {
          rLoading.close();
          this.$message.info({
            message: "出现异常!",
            duration: 800
          });
        });
    },
    handleSave(index, row, isSet) {
      //保存
      this.$axios
        .post("/TwitterAccount/Update", {
          TwitterAccountId: row.twitterAccountId,
          PhoneNumber: row.phoneNumber,
          LoginId: row.loginId,
          LoginPwd: row.loginPwd,
          Remark: row.remark
        })
        .then(res => {
          if (res.data.isOk) {
            this.$message.success(res.data.message);
          } else {
            this.$message.info(res.data.message);
          }
        })
        .then(() => {
          row.isSet = false;
          this.search();
        });
    },
    handleCancel(index, row) {
      //取消
      row.isSet = false;
      this.search();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.search();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.cur_page = 1;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.search();
    },
    // filterTag(value, row) {
    //   return row.state === value;
    // },
    handleEdit(index, row) {
      row.isSet = true;
    },
    // handleCurrentChange(row, event, column) {
    //    this.cur_page=row;
    //    this.search();
    // },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
      // _self.loadingData();
    },
    del_all() {
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
            this.search();
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
    // 编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.tableData.isSet = false;
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
          this.search();
          this.$message.success("删除成功");
        });
      // this.tableData.splice(this.twitterAccountId, 1);
      this.delVisible = false;
    }
  }
};
</script>
<style scoped>
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
  /* background: #fff; */
}
</style>
