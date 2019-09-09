<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <div class="lineq">舆材管理</div>
      </el-breadcrumb>
    </div>
    <div class="container flex" style="margin-top:0px;">
      <div class="conLeft">
        <div class="conTop">舆材列表</div>
        <div class="conGuan flex flcen pdd" style="padding-left:0px">
          <div class="zi flex">
            舆材内容关键字:
            <el-input
              placeholder="请输入内容"
              v-model="input1"
              clearable
              style="width:240px;margin-left:10px"
            ></el-input>
          </div>
          <div class="zi flex flcen" style="width:320px;">
            舆材类型:
            <el-select
              v-model="value"
              filterable
              placeholder="请选择"
              clearable
              style="margin-left:8px"
            >
              <el-option
                v-for="item in options"
                :key="item.materialTypeId"
                :label="item.materialTypeName"
                :value="item.materialTypeId"
              ></el-option>
            </el-select>
          </div>
          <div class="chaCon">
            <el-button size="medium" type="primary" icon="el-icon-search" @click="yuSeach()">查询</el-button>
          </div>
          <div class="chaCon" style="margin-left:30px;">
            <el-button
              size="medium"
              type="primary"
              plain
              @click="input1='',value='',alterMaterialTypeId=''"
            >重置</el-button>
          </div>
          <div class="chaCon">
            <el-button
              size="medium"
              type="primary"
              @click="delVisible2=true,add1='',add2='',add3='',materialId='',max_str='',ysr=false,tips='已输入'"
              style="margin-left:28px"
            >添加舆材</el-button>
          </div>
        </div>
        <div class="contw">
          <table style="width:100%" cellspacing="0">
            <tr>
              <td>
                <el-checkbox v-model="checked" @change="boxAll(checked)"></el-checkbox>
              </td>
              <td>序号</td>
              <td>舆材内容</td>
              <td>舆材类型</td>
              <td>共有/私有</td>
              <td>创建时间</td>
              <td>操作</td>
            </tr>
            <tr v-for="(val,index) in tableData" v-if="tableData.length>0" :key="index">
              <td>
                <el-checkbox v-model="val.checked" @change="boxDan(index,val.checked)"></el-checkbox>
              </td>
              <td>{{(cur_page-1)*pageSize+index+1}}</td>
              <td
                style="max-width: 20vw; word-break: keep-all; overflow-wrap: break-word;"
              >{{val.materialContent}}</td>
              <td>{{val.materialTypeName}}</td>
              <td>{{val.materialAttribute}}</td>
              <td>{{val.createTime}}</td>
              <td v-if="val.materialAttribute=='公有'">
                <el-button type="text" class="disal">修改</el-button>
                <el-button type="text" class="disal">删除</el-button>
              </td>
              <td v-else>
                <el-button type="text" @click="xiugai1=true,handleUped(val)">修改</el-button>
                <el-button type="text" @click="openRm(val.materialId)">删除</el-button>
              </td>
            </tr>
          </table>
          <!-- checkAll -->
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
      <div class="conRight">
        <div class="top" id="topYu">已选舆材</div>
        <div class="copy">
          <el-button size="small" @click="copy()" type="primary">复制到粘贴板</el-button>
        </div>
        <div class="sel">
          <div class="tt">
            <div class="tou">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-button
                size="small"
                @click="checkAll=false,checkAllNull()"
                style="margin-left:55%"
                type="danger"
              >清空</el-button>
            </div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
              v-if="rigthARR.length>0"
            >
              <div class="tie" v-for="(val,index) in rigthARR">
                <div class="zhong flex">
                  <div class="tieLeft">
                    <el-checkbox :label="val" :key="val.materialId">{{''}}</el-checkbox>
                  </div>
                  <div
                    class="tieRight"
                    style="width:60%;word-break: keep-all; overflow-wrap: break-word;padding-right:4%"
                  >{{val.materialContent}}</div>
                  <el-button
                    size="small"
                    type="danger"
                    @click="rigthARR.splice(index,1),cheRem(val)"
                  >移除</el-button>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加舆材 -->
    <el-dialog
      :visible.sync="delVisible2"
      width="300px"
      :lock-scroll="false"
      left
      :close-on-click-modal="false"
    >
      <div id="box">
        <div class="boxTop">添加舆材</div>
        <div class="addbox">添加舆材</div>
        <textarea
          :disabled="tijiao1"
          maxlength
          @input="changeText(add1)"
          v-model="add1"
          style="width: calc(100% - 20px);"
          id="nrcont"
          placeholder="舆材内容，每行一条"
          class="nrcont"
        ></textarea>
        <p :class="{'black':!ysr}" v-if="!ysr">
          {{tips}}
          <span>{{max_str}}/256</span>个字符
        </p>
        <p :class="{'red':ysr}" v-if="ysr">{{tips}}256个字符</p>
        <div class="addbox">舆材类型</div>
        <el-select
          v-model="add2"
          filterable
          placeholder="请选择"
          clearable
          style="width: calc(100% - 20px);"
        >
          <el-option
            v-for="item in options"
            :key="item.materialTypeId"
            :label="item.materialTypeName"
            :value="item.materialTypeName"
          ></el-option>
        </el-select>
        <div class="di">
          <el-button size="medium" @click="boxYes()" type="primary">确认添加</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改舆材 -->
    <el-dialog
      :visible.sync="xiugai1"
      width="300px"
      left
      :lock-scroll="false"
      :close-on-click-modal="false"
    >
      <div id="box">
        <div class="boxTop">修改舆材</div>
        <div class="addbox">修改舆材</div>
        <textarea
          :disabled="tijiao1"
          maxlength
          @input="count(xiu1)"
          v-model="xiu1"
          style="width: calc(100% - 20px);"
          id="nrcont"
          placeholder="舆材内容，每行一条"
          autofocus="autofocus"
          class="nrcont"
        ></textarea>
        <div v-if="xiuXian">
          <p :class="{'black':!ysr}" v-if="!ysr">
            可输入
            <span>{{max_str}}/256</span>个字符
          </p>
        </div>
        <div class="addbox">舆材类型</div>
        <el-select
          v-model="xiu2"
          filterable
          placeholder="请选择"
          clearable
          style="width: calc(100% - 20px);"
        >
          <el-option
            v-for="item in options"
            :key="item.materialTypeId"
            :label="item.materialTypeName"
            :value="item.materialTypeName"
          ></el-option>
        </el-select>
        <div class="di">
          <el-button size="medium" @click="xiuYes()" type="primary">确认修改</el-button>
        </div>
      </div>
    </el-dialog>
    <textarea cols="20" rows="10" id="biao1">用户定义的代码区域</textarea>
    <div id="bg" v-show="delVisible||delVisible2||xiugai1"></div>
  </div>
</template>
<script>
export default {
  name: "basetable",
  data() {
    return {
      xiuXian: false,
      ysr: false,
      tijiao1: false,
      b: false,
      xs: true,
      tips: "已输入",
      max_str: 0,
      boxText: "",

      add1: "",
      add2: "",
      restaurants: [],
      xiu2: "",
      xiu1: "",
      xiugai1: false,
      rigthARR: [],
      checkAll: false,
      checkedCities: [],
      boxText: "",
      delVisible2: false,

      //全选
      checked: false,
      value2: "0",
      //关键字
      input1: "",
      tableData: [],
      multipleSelection: [],
      total: 0,
      pageSize: 10,
      cur_page: 1,
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      isIndeterminate: false,
      editVisible: false,
      delVisible: false,
      options: [],
      value: "",
      idx: "",
      rightArr: [],
      xiuMaterialId: "",
      xiuChecked: "",
      organizationId: "",
      materialId: "", //舆材ID
      alterMaterialTypeId: "", //舆材类型ID,
      agencyId: "", //机构ID
      xiuFlag: true
    };
  },
  created() {
    this.agencyId = localStorage.getItem("agencyId");
    if (this.$route.query.page) {
      this.cur_page = this.$route.query.page * 1;
      this.pageSize = this.$route.query.pageSize * 1;
    }
    this.getData();
    sessionStorage.clear();
  },
  computed: {},
  methods: {
    getStringUTFLength(str) {
      var value = str.replace(/[\u4e00-\u9fa5]/g, "ss");
      //将汉字替换为两个空格
      return value.length;
    },
    leftUTFString(str, len) {
      if (this.getStringUTFLength(str) <= len) {
        return str;
      }
      var value = str.substring(0, len);
      while (this.getStringUTFLength(value) > len) {
        value = value.substring(0, value.length - 1);
      }
      return value;
    },
    count(strText) {
      this.xiuXian = true;
      var len = 256;
      var value = strText;
      if (this.getStringUTFLength(value) >= len) {
        this.xiu1 = this.leftUTFString(strText, len);
      }
      this.max_str = len - this.getStringUTFLength(this.xiu1);
    },

    // 验证发推内容不超过256个字符
    changeText(str) {
      // 将textare中的内容已换行符切割成数组
      let contsarr = str.split(/[(\r\n)\r\n]+/);
      for (let i = 0, p = contsarr.length; i < p; i++) {
        let leng = this.validateTextLength2(contsarr[i]);
        if (leng > 256) {
          this.ysr = true;
          this.tips = "第" + (i + 1) + "行已超过";
          this.xiuFlag = false;
          return false;
        } else {
          this.ysr = false;
          this.max_str = leng;
          this.tips = "已输入";
          this.xiuFlag = true;
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
    // 舆材类型 模糊查询
    handleSelect(item) {
      if (item.materialTypeId == "") {
        this.value = "";
        this.xiu2 = "";
        this.add2 = "";
      }
      this.alterMaterialTypeId = item.materialTypeId;
    },
    querySearch(queryString, cb) {
      let restaurants = [];
      fetch("http://jwp.yuqing.pro:89/Material/GetMaterialList", {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.data.length == 0) {
            restaurants = [{ materialTypeId: "", value: "未搜索到该舆材类型" }];
          } else {
            restaurants = data.data;
            for (let i = 0; i < restaurants.length; i++) {
              restaurants[i].value = restaurants[i].materialTypeName;
            }
          }
          // 调用 callback 返回建议列表的数据
          cb(restaurants);
        })
        .catch(e => {});
    },
    //舆材修改
    handleUped(val) {
      this.xiu1 = val.materialContent;
      this.xiu2 = val.materialTypeName;
      this.xiuMaterialId = val.materialId;
      this.xiuChecked = val.checked;
      this.max_str = "";
      this.xiuXian = false;
    },
    //确定修改
    xiuYes() {
      if (this.xiu1.trim() == "") {
        this.$alert("舆材内容不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (this.xiu2 == "") {
        this.$alert("舆材类型不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (!this.xiuFlag) {
        this.$alert("舆材内容超出不可添加", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.$axios
        .post(`/Material/UpdateMaterial`, {
          MaterialId: this.xiuMaterialId,
          MaterialContent: this.xiu1,
          MaterialTypeName: this.xiu2
        })
        .then(res => {
          if (res.data.isOk) {
            this.delVisible2 = false;
            this.getData();
            this.xiugai1 = false;
            if (this.xiuChecked) {
              this.rigthARR.forEach(x => {
                if (x.materialId == this.xiuMaterialId) {
                  x.materialContent = this.xiu1;
                }
              });
            }
            this.$message.success({
              message: "修改成功!",
              duration: 800
            });
          }
        })
        .catch(() => {
          this.$message.info({
            message: "出现异常请重试!",
            duration: 800
          });
        });
    },
    //舆材清空
    checkAllNull() {
      this.rigthARR = [];
      this.checkAll = false;
      this.checkedCities = [];
      this.tableData.forEach(x => {
        x.checked = false;
      });
      this.checked = false;
    },
    //复制
    copy() {
      var str = "";
      var cities = this.checkedCities;
      if (cities.length < 1) {
        this.$message({
          type: "info",
          message: "请选择！",
          duration: 800
        });
        return false;
      }
      var brr = [];
      cities.forEach(x => {
        brr.push(
          // "时间: " + '"' + x.createTime + ', "' + '内容:"' + x.loginCon + '"'
          x.materialContent.trim()
        );
      });
      str = brr.join("\n");
      var Url2 = document.getElementById("biao1");
      Url2.innerHTML = str;
      Url2.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "已复制好可粘贴",
        duration: 500
      });
    },
    //确定添加
    boxYes() {
      if (this.add1.trim() == "") {
        this.$alert("舆材内容不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (this.add2 == "") {
        this.$alert("舆材类型不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (!this.xiuFlag) {
        this.$alert("舆材内容超出不可添加", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.$axios
        .post(`Material/AddMaterial`, {
          Content: this.add1.split(/[(\r\n)\r\n]+/),
          Name: this.add2,
          AgencyId: this.agencyId
        })
        .then(res => {
          if (res.data.isOk) {
            this.delVisible2 = false;
            this.cur_page = 1;
            this.alterMaterialTypeId = "";
            this.getData();
            this.$message.success({
              message: "添加成功!",
              duration: 500
            });
          }
        });
    },
    //舆材移除
    cheRem(val) {
      this.tableData.forEach(x => {
        if (x.materialId == val.materialId) {
          x.checked = false;
        }
      });
      this.checkedCities.forEach((x, i) => {
        if (x.materialId == val.materialId) {
          this.checkedCities.splice(i, 1);
        }
      });
      this.tableData.forEach(x => {
        if (!x.checked) {
          this.checked = false;
        }
      });
      if (this.rigthARR.length < 1) {
        this.checkAllNull();
      }
    },
    //去重
    quChong(arr) {
      let arrobj = {};
      let arrbrr = [];
      arr.forEach(x => {
        if (!arrobj[x.materialId]) {
          arrobj[x.materialId] = "98k";
          arrbrr.push(x);
        }
      });
      return arrbrr;
    },
    //数组消消乐
    arrChange(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].materialId == b[i].materialId) {
            //如果是id相同的，那么a[ j ].id == b[ i ].id
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    },
    //全选
    boxAll(checked) {
      let _this = this;
      if (checked) {
        this.tableData.forEach(x => {
          x.checked = true;
          _this.rigthARR.push(x);
        });
        _this.rigthARR = _this.quChong(_this.rigthARR);
        if (this.checkedCities.length < _this.rigthARR.length) {
          this.checkAll = false;
        } else {
          this.checkAll = true;
        }
      } else {
        let b = this.tableData;
        let a = this.rigthARR;
        let c = [];
        c = this.arrChange(a, b);
        this.tableData.forEach(x => {
          x.checked = false;
        });
        this.rigthARR = c;
      }
      if (this.rigthARR.length < 1) {
        this.checkAllNull();
      }
      if (this.checkedCities.length < _this.rigthARR.length) {
        this.checkAll = false;
      } else {
        this.checkAll = true;
      }
    },
    //单选
    boxDan(index, checked) {
      let _this = this;
      if (checked) {
        _this.tableData[index].checked = true;
        _this.rigthARR.push(this.tableData[index]);
        this.checkAll = false;
      } else {
        _this.tableData[index].checked = false;
        var kt;
        _this.rigthARR.forEach((x, i) => {
          if (_this.tableData[index] == x) {
            kt = i;
          }
        });
        _this.rigthARR.splice(kt, 1);
      }
      this.checked = true;
      this.tableData.forEach(x => {
        if (!x.checked) {
          this.checked = false;
        }
      });
      if (this.rigthARR.length < 1) {
        this.checkAllNull();
      }
    },
    //获取列表
    lieBiao() {
      const rLoading = this.openLoading();
      let _this = this;
      let strttt = "";
      strttt = this.input1.trim().replace(/[\ \"]/g, "%");
      let typeId = 0;
      if (this.value != "") {
        typeId = this.value;
      }
      this.$axios
        .post(`/Material/GetMaterialList`, {
          PageIndex: this.cur_page,
          PageSize: this.pageSize,
          KeyWord: strttt,
          MaterialTypeId: typeId
        })
        .then(res => {
          if (res.data.code == 0) {
            rLoading.close();
            let arr = [];
            let _this = this;
            arr = res.data.data.list;
            this.total = res.data.data.count * 1;
            this.tableData = [];
            arr.forEach(x => {
              x.checked = false;
            });
            arr.forEach((x, i) => {
              _this.rigthARR.forEach((k, t) => {
                if (x.materialId == k.materialId) {
                  x.checked = true;
                }
              });
            });
            this.tableData = arr;
            this.tableChange();
            this.checked = true;
            this.tableData.forEach(x => {
              if (!x.checked) {
                this.checked = false;
              }
            });
            if (this.rigthARR.length < 1) {
              this.checkAllNull();
            }
          } else {
            rLoading.close();
          }
        })
        .catch(e => {
          rLoading.close();
          this.$message.info({
            message: "请求超时!",
            duration: 800
          });
        });
    },
    //查询
    yuSeach() {
      this.cur_page = 1;
      if (this.value == "") {
        this.alterMaterialTypeId = "";
      }
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.lieBiao();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.getData();
    },
    handleSizeChange(val) {
      this.cur_page = 1;
      this.pageSize = val;
      this.$router.push({
        query: { page: this.cur_page, pageSize: this.pageSize }
      });
      this.getData();
    },
    // 获取舆材列表数据
    getData() {
      this.lieBiao();
    },
    //参数转换
    tableChange() {
      let state = {
        "1": "公有",
        "2": "私有"
      };
      this.tableData.forEach(x => {
        x.materialAttribute = state[x.materialAttribute];
      });
    },
    //表格信息删除
    handleDelete(index, row) {
      this.delVisible = true;
      this.idx = index;
    },
    //已选舆材全选
    handleCheckAllChange(val) {
      var arr = [];
      this.rigthARR.forEach(x => {
        arr.push(x);
      });
      this.checkedCities = val ? arr : [];
      this.isIndeterminate = false;
    },
    //已选舆材单选
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.rigthARR.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rigthARR.length;
      console.log(this.checkedCities);
    },
    //删除
    openRm(id) {
      this.$confirm("此操作将会永久删除该数据是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetch(
            "http://jwp.yuqing.pro:89/Material/DeleteMaterial?materialId=" + id
          )
            .then(response => response.json())
            .then(res => {
              if (res.isOk) {
                this.$message({
                  type: "success",
                  message: "删除成功",
                  duration: 500
                });
                this.delVisible = false;
                var len = this.total - 1;
                var num = this.pageSize;
                var brrNum =
                  len % num === 0 ? len / num : Math.floor(len / num + 1);
                if (this.cur_page > brrNum) {
                  this.cur_page = brrNum;
                  this.$router.push({
                    query: { page: this.cur_page, pageSize: this.pageSize }
                  });
                }
                this.lieBiao();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 500
          });
        });
    }
  },
  mounted() {
    this.$axios.get(`/Material/GetMaterialTypeList`).then(res => {
      if (res.data.code == 0) {
        this.options = res.data.data;
      }
      if (res.data.code == 1000) {
        window.open(
          "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
          "_self"
        );
      }
      if (data.code == 1003) {
        alert("您的账号未授权该操作！您的当前IP已被纪录。");
        window.open(
          "http://www.yuqing.pro/Login.aspx?returnto=http://jwp.yuqing.pro:89/Index.html",
          "_self"
        );
      }
    });
  }
};
</script>

<style scoped lang="less">
#topYu {
  border: 0px;
  // border-left: 2px solid #66b1ff;
  line-height: 20px;
  height: 20px;
}
#bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0;
  background: black;
  opacity: 0.5;
  z-index: 20;
}
#biao1 {
  width: 1px;
  height: 1px;
  opacity: 0;
}
#box {
  padding: 20px 20px;
  box-sizing: border-box;
  .boxTop {
    text-align: center;
    padding: 10px 0px;
    font-size: 20px;
  }
  .addbox {
    line-height: 40px;
  }
  textarea {
    width: calc(100% - 20px);
    height: 200px;
    resize: none;
    font-size: 16px;
  }
  .di {
    button {
      display: block;
      margin: 10px auto;
    }
  }
}
.disal {
  color: gray;
  cursor: no-drop;
}
.flex {
  display: flex;
}
.pdd {
  padding: 20px;
}
.flcen {
  align-items: center;
}
.flcen .zi {
  width: 400px;
  display: flex;
  align-items: center;
}
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
  padding-bottom: 18px;
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
  margin-top: 20px;
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
.conRight {
  width: 20%;
  min-width: 300px;
  background: white;
  margin-left: 20px;
}
.conLeft {
  width: 80%;
  min-width: 1037px;
  height: calc(80vh - 40px);
  overflow-y: scroll;
  background: white;
}
.conLeft::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: white;
}
.conLeft:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.conLeft {
  padding: 20px;
}
.conRight .top {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border: 1px solid gray;
  // padding-left: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.conRight::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: white;
}
.conRight:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.conRight {
  padding: 20px;
  box-sizing: border-box;
  height: 80vh;
  min-width: 316.5px;
  overflow-y: scroll;
}
.conRight .sel {
  position: relative;
}
.conRight .sel .null {
  position: absolute;
  top: 10px;
  right: 18px;
  z-index: 999;
}
.conRight .zuoPosion {
  position: absolute;
  top: 36px;
  left: 10px;
  z-index: 9999;
  width: 30px;
  .arrTT {
    height: 57px;
    line-height: 60px;
    box-sizing: border-box;
  }
}
.conRight .tou {
  height: 80px;
  padding: 8px;
  padding-top: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(213, 215, 221, 1);
}
.flex {
  display: flex;
}
.tie {
  font-size: 14px;
  align-items: center;
  font-family: PingFangTC-Regular;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
  // margin-right: 24px;
  padding: 24px 0;
  padding-left: 8px;
  // padding-right: 0px;
  border-bottom: 1px solid rgba(213, 215, 221, 1);
  .title {
    font-size: 12px;
    font-family: PingFangTC-Regular;
    font-weight: 400;
    color: rgba(145, 147, 152, 1);
    span {
      float: right;
    }
  }
  .zhong {
    height: auto;
    align-items: center;
    .tieRight {
      font-size: 14px;
      font-family: PingFangTC-Regular;
      font-weight: 400;
      span {
        color: rgba(70, 128, 255, 1);
      }
    }
  }
  .rm {
    margin-top: 8px;
    font-size: 12px;
    font-family: PingFangTC-Regular;
    font-weight: 400;
    color: rgba(252, 96, 128, 1);
    padding-left: 24px;
    cursor: pointer;
  }
}
table {
  width: 100%;
  margin-top: 16px;
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(96, 98, 102, 1);
  tr {
    height: 56px;
    td {
      padding-left: 40px;
      border-bottom: 1px solid rgba(213, 215, 221, 1);
      span {
        margin-right: 3px;
        color: red;
        font-weight: bold;
      }
    }
  }
  .t1 {
    background: rgba(246, 246, 246, 1);
    td {
      border: 0px;
      font-size: 14px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(48, 49, 50, 1);
    }
  }
}
.ysr {
  padding-left: 250px;
}
.red {
  color: red;
}
.black {
  color: black;
}
</style>
