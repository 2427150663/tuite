<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">
          <span
            class="el-icon-back"
            style="font-size:20px; cursor: pointer;margin-right:4px;font-weight: 700;"
            v-on:click="back"
          ></span>
          <span style="font-size:15px;font-weight:400">发布列表</span>
          /任务详情
          <div class="fr frLeft" v-if="chanGeUrl=='/ReleaseFinished'">
            <el-button type="primary" plain icon="el-icon-download" @click="downloadExcel()">下载电子表格</el-button>
            <el-button type="primary" plain icon="el-icon-download" @click="downLoadImg()">下载任务截图</el-button>
          </div>
        </div>
      </el-breadcrumb>
      <div class="container">
        <div class="xiangqing">
          <h2
            style="word-break: keep-all; overflow-wrap: break-word; padding-right:20px;"
          >{{transAutoTaskState(show.state)}}任务:{{show.title}}</h2>
          <a :href="show.url" class="lianjie" target="_blank">{{show.url}}</a>
          <div class="plist">
            <p>提交时间：{{show.createTime}}</p>
            <p>条目数：{{show.count}}</p>
            <p>开始时间：{{show.startTime}}</p>
            <p>完成时间：{{show.complateTime}}</p>
            <p>间隔时间：1条/{{show.sleep*60}}秒钟</p>
            <!-- <p v-if="show.url!=''">
              推文地址：
              <a :href="show.url" target="_blank">{{show.url}}</a>
            </p>
            <p v-else style="display:flex">推文地址：---</p>-->
          </div>
        </div>
        <div class="contw">
          <div class="xian"></div>
          <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="autoTaskItemCommandId" label="任务Id" width="150" align="center"></el-table-column>
            <el-table-column prop="content" label="发布内容" width="380"></el-table-column>
            <el-table-column prop="createTime" label="提交时间" width="140"></el-table-column>
            <el-table-column prop="twitterAccountName" label="评论昵称"></el-table-column>
            <el-table-column prop="state" label="评论状态">
              <template slot-scope="scope">
                <span
                  :class="{yfj: scope.row.state === 'Fail',drsb: scope.row.state === 'Cancle',zbks: scope.row.state === 'WattingSelectTwitterAccount',zc: scope.row.state=== 'Success'}"
                >{{transAutoTaskCommandItemState(scope.row.state)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Message" label="推文地址">
              <template slot-scope="scope">
                <a :href="scope.row.url" class="lianjie" target="_blank">{{scope.row.url}}</a>
              </template>
            </el-table-column>
            <el-table-column label="操作类型" align="center">
              <template slot-scope="scope">
                <span>{{leiXin[scope.row.commandType]}}</span>
                <!-- <el-button v-if="scope.row.state === 'Success'" type="text" class="red">---</el-button>
                <el-button v-if="scope.row.state === 'Fail'" type="text" class="red">取消评论</el-button>
                <el-button
                  v-if="scope.row.state === 'WattingSelectTwitterAccount'"
                  type="text"
                  class="red"
                >取消评论</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.state === 'Cancle'"
                  @click="handleCancel(scope.$index, scope.row)"
                >恢复评论</el-button>-->
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.state === '评论失败'"
                  @click="handleEdit(scope.$index, scope.row)"
                >恢复评论</el-button>
                <el-button                
                  v-if="scope.row.state=== 'Fail'"                  
                      type="text"
                      class="red"                     
                    >取消评论</el-button>
                    <el-button                
                  v-if="scope.row.state=== 'WattingSelectTwitterAccount'"                  
                      type="text"
                      class="red"                     
                >取消评论</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.state=== 'Cancle'"
                  @click="handleCancel(scope.$index, scope.row)"
                >恢复评论</el-button>
              </template>
            </el-table-column>-->
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
    <!-- 发布任务详情 -->
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
      leiXin: {
        Tweet: "发推",
        ReTweet: "转发",
        Like: "关注",
        Reply: "回复",
        Comment: "跟评"
      },
      activeName: "second",
      show: {},
      tableData: [],
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      cur_page: 1,
      pageSize: 10,
      total: 0,
      chanGeUrl: ""
    };
  },
  created() {
    this.chanGeUrl = this.$route.query.state;
    if (this.$route.query.page) {
      this.cur_page = this.$route.query.page * 1;
      this.pageSize = this.$route.query.pageSize * 1;
    }
    this.getData();
    this.getlist();
  },
  computed: {},
  methods: {
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
    transAutoTaskCommandItemState(val) {
      if (val === "WattingSelectTwitterAccount") {
        return "待评论";
      } else if (val === "Running") {
        return "执行中";
      } else if (val === "Success") {
        return "评论成功";
      } else if (val === "Fail") {
        return "评论失败";
      } else if (val === "Cancle") {
        return "已取消";
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      let id = this.$route.query.id;
      this.cur_page = val;
      this.$router.push({
        query: {
          id: id,
          PageIndex: this.cur_page,
          pageSize: this.pageSize,
          state: this.chanGeUrl
        }
      });
      this.getlist();
    },
    handleSizeChange(val) {
      let id = this.$route.query.id;
      this.cur_page = 1;
      this.pageSize = val;
      this.$router.push({
        query: {
          id: id,
          PageIndex: this.cur_page,
          pageSize: this.pageSize,
          state: this.chanGeUrl
        }
      });
      this.getlist();
    },
    getlist() {
      let id = this.$route.query.id;
      this.$axios
        .post("/AutoTask/ItemList", {
          CommandType: 1,
          AutoTaskId: id,
          PageIndex: this.cur_page,
          PageSize: this.pageSize
        })
        .then(res => {
          if (res.data.code == "0") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.count;
          }
          if (res.data.code == 1000) {
            window.open(
              "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
              "_self"
            );
          }
        });
    },
    back() {
      this.$router.push({ path: this.$route.query.state });
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      let id = this.$route.query.id;
      this.$axios
        .post("/AutoTask/Get", {
          CommandType: 1,
          AutoTaskId: id
        })
        .then(res => {
          this.show = res.data.data;
        });
    },
    // tab切换
    handleClick(tab, event) {},

    // 恢复评论
    handleCancel(index, row) {
      let id = this.$route.query.id;
      this.$axios
        .post("/AutoTask/ItemControl", {
          CommandType: 1,
          AutoTaskId: id,
          AutoTaskItemId: row.tweetCommandId,
          ControlType: 2
        })
        .then(res => {
          this.getData();
        });
    },
    // 取消评论
    handleDelete(index, row) {
      let id = this.$route.query.id;
      this.$axios
        .post("/AutoTask/ItemControl", {
          CommandType: 1,
          AutoTaskId: id,
          AutoTaskItemId: row.tweetCommandId,
          ControlType: 1
        })
        .then(res => {
          this.getData();
        });
    },
    // 下载电子表格
    downloadExcel(scheduleType) {
      let id = this.$route.query.id;
      const rLoading = this.openLoading();
      this.$axios
        .get("AutoTask/DownLoadExcel", {
          params: {
            taskIds: id
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
          downloadElement.download = "网评任务表.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
          rLoading.close();
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
      let id = this.$route.query.id;
      const rLoading = this.openLoading();
      this.$axios
        .get("Images/DownLoadScreenshot", {
          params: {
            autoTaskId: id
          }
        })
        .then(res => {
          let success = res.data.message;
          let datUrl = res.data.data;
          if (res.data.data != null) {
            this.$axios.get(`${res.data.data}`).then(res => {
              window.location.href = datUrl;
            });
          }
          rLoading.close();
          this.$message.info(success);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
.router-link-active {
  color: #409eff;
  font-size: 14px;
}
.fr {
  float: right;
  margin-right: 24px;
}
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
.lineq i {
  cursor: pointer;
}
h5 {
  font-weight: 500;
  color: #303431;
  display: inline;
  padding: 0 12px 0 24px;
}
a {
  font-size: 14px !important;
  color: #66b1ff !important;
  margin-bottom: 14px !important;
  display: block;
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
.crumbs {
  position: relative;
}
.frLeft {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
