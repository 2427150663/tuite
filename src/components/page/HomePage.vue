<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <div class="lineq">系统首页</div>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="yft"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{data1.sendTwieetCount}}条</div>
                  <div>已发推</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="ygp"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{data1.replyLikeRetweetSumCount}}条</div>
                  <div>已跟评点赞转发</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="syzh"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{data1.twitterAccountCount.all}}个</div>
                  <div>私有twitter账号(可用{{data1.twitterAccountCount.useable}}个)</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="14">
        <div id="myChart" :style="{width: '100%', height: '438px'}" style="background:white"></div>
      </el-col>
      <el-col :span="10" style="float:right;">
        <h4>今日剩余数据</h4>
        <table style="width:100%;height:370px;background:white" cellpadding="0" cellspacing="0">
          <thead height="56">
            <tr height="56">
              <th>名称</th>
              <th>私有账户</th>
              <th>公有账户</th>
              <th>剩余总条数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="items in tableData" :key="items.id" height="68">
              <td>{{items.commandName}}</td>
              <td>{{items.privateCount}}</td>
              <td>{{items.publicCount}}</td>
              <td>{{items.sum}}</td>
            </tr>
            <div></div>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { isArray } from "util";
import { setInterval } from "timers";
export default {
  name: "dashboard",
  data() {
    return {
      data1: {
        twitterAccountCount: {}
      },
      typeObj: {
        tweet: "最大发帖",
        reply: "最大跟评",
        retweet: "最大转发",
        like: "最大点赞"
      },
      tableData: []
    };
  },
  mounted() {
    this.drawLine();
    this.$axios
      .get("/Home/Consumption")
      .then(data => {
        if (data.data.isOk == true) {
          this.data1 = data.data.data;
        }
        if (data.data.code == 1000) {
          window.open(
            "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
            "_self"
          );
        }
      })
      .catch(error => {
        // console.log(error);
      });
  },
  created() {
    this.$axios.get("http://jwp.yuqing.pro:89/Home/GetUserTaskResidueNumber").then(res => {
      let dat = res.data;
      if (dat.isOk) {
        this.tableData = dat.data.list;
      }
    });
    sessionStorage.clear();
  },
  methods: {
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 300);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // Home/GetEcharts
      // 绘制图表
      this.$axios.get(`Home/GetCommandChartData`).then(res => {
        let dat = res.data;
        if (dat.isOk) {
          let arr = [];
          arr = dat.data;
          let arrDate = [];
          let arrSum = [];
          arr.forEach(x => {
            arrDate.unshift(x.pushDate.substr(0, 10));
            arrSum.unshift(x.pushCount);
          });
          myChart.setOption({
            title: {
              text: "七日任务数量统计",
              textStyle: {
                fontSize: 14,
                color: "#606266",
                fontWeight: "bold"
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: {
              splitLine: {
                color: "#919398"
              },
              type: "category",
              data: arrDate,
              axisTick: {
                alignWithLabel: true
              },
              axisTick: {
                show: false
              },

              axisLine: {
                lineStyle: {
                  fontWeight: "bold",
                  color: "fff",
                  fontSize: 24
                }
              }
            },
            yAxis: {
              type: "value",
              height: 6,
              lineStyle: {
                height: 6
              },

              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            },
            series: [
              {
                type: "bar",
                barWidth: "12%",
                data: arrSum,
                itemStyle: {
                  normal: {
                    barBorderRadius: [10, 10, 0, 0],
                    color: "#66B1FF"
                  }
                }
              }
            ]
          });
          window.onresize = function() {
            myChart.resize();
          };
        }
      });
    },
    fun_date(aa) {
      var date1 = new Date(),
        time1 =
          date1.getFullYear() +
          "-" +
          (date1.getMonth() + 1) +
          "-" +
          date1.getDate(); //time1表示当前时间
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + aa);
      var time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return time2;
    }
  }
};
</script>


<style scoped>
thead tr {
  color: #303132;
  font-weight: 500;
}
table tr {
  border-spacing: 0;
}
table tr {
  text-align: center;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  vertical-align: middle;
}
h4 {
  background: rgba(255, 255, 255, 1);
  line-height: 68px;
  font-size: 14px;
  font-weight: 500;
  padding-left: 24px;
}

tr:hover td {
  background: rgba(102, 177, 255, 0.2);
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 148px;
}

.grid-cont-right {
  padding-left: 40px;
  font-size: 16px;
  line-height: 22px;
  color: rgba(96, 98, 102, 1);
}

.grid-num {
  color: rgba(48, 49, 50, 1);
  font-size: 28px;
  line-height: 40px;
}
.grid-content i {
  width: 64px;
  height: 64px;
  padding-left: 40px;
}
.yft {
  background: url(../../assets/img/分组8.png) no-repeat center;
}
.ygp {
  background: url(../../assets/img/分组11.png) no-repeat center;
}
.syzh {
  background: url(../../assets/img/分组12.png) no-repeat center;
}
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
}

.mgb20 {
  margin-bottom: 20px;
  margin-top: 24px;
}

.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: -10px 10px 20px 0px rgba(30, 30, 30, 0.05) !important;
}
</style>
