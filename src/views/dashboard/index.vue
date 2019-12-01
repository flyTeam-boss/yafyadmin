<template>
  <div class="app-container">
    <template v-if='isShowTop'>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8">
          <div class="grid-content one-box">
            <img src="@/icons/imgs/icon-one.png" alt="">
            <div class='info'>
              <p>剩余课时≤{{ number }}学员人数</p>
              <p class="number">{{ exhaustionData.sumStudentCount }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <div class="grid-content two-box">
            <img src="@/icons/imgs/icon-two.png" alt="">
            <div class='info'>
              <p>本月新增学员人数</p>
              <p class="number">{{ AddStudentData.sumStudentCount }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <div class="grid-content three-box">
            <img src="@/icons/imgs/icon-three.png" alt="">
            <div class='info'>
              <p>本月缴费学员人数</p>
              <p class="number">{{ payData.sumStudentCount }}</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt20" :gutter="20">
        <el-col :span="9">
          <div class="charts-tile">
            <span>剩余课时≤{{ number }}学员情况</span>
            <!-- <span>到期课时数: 5</span> -->
          </div>
          <div style="position: relative;font-size:10px;">
            <div id="myChart" class="bkgfff" :style="{width: '100%', height: '320px'}" />
            <div style="position: absolute;bottom: 10px;left:0;right:0;text-align: center;">
              输入课时 <input type="number" v-model="period" style="width:30px;border-radius:4px;border:.5px solid #3c3c3c;outline: none;padding-left:3px;"> <span style="background:#1890ff;color:#fff;padding: 1px 3px;cursor: pointer;border-radius:3px" @click="handleSmt">确定</span>
            </div>
          </div>
        </el-col>
        <el-col :span="15">
          <div class="charts-tile">
            剩余课时≤{{ number }}学员情况
            <div class="exportBtn" @click="exportBtn(small,'剩余课时≤5学员情况')">导出</div>
          </div>
          <el-table
            :data="exhaustionData.studentPeriodResponseList"
            max-height="320"
            style="width: 100%;height: 320px;overflow-y:auto"
          >
            <el-table-column prop="studentName" align="center" label="学生姓名" />
            <el-table-column prop="periods" align="center" label="剩余课时" sortable="custom"/>
            <el-table-column prop="phone" align="center" label="家长电话" />
            <el-table-column prop="courseName" align="center" label="课程名称" />
            <el-table-column prop="className" align="center" label="班级名称" />
          </el-table>
        </el-col>
      </el-row>

      <el-row class="mt20" :gutter="20">
        <el-col :span="9">
          <div class="charts-tile">
            本月新增学员情况
          </div>
          <div id="myChart1" class="bkgfff" :style="{width: '100%', height: '320px'}" />
        </el-col>
        <el-col :span="15">
          <div class="charts-tile">
            本月新增学员详情
            <div class="exportBtn"  @click="exportBtn(news,'本月新增学员详情')">导出</div>
          </div>
          <el-table
            :data="AddStudentData.studentDateResponseList"
            max-height="320"
            style="width: 100%;height: 320px;overflow-y:auto"
          >
            <el-table-column prop="studentName" align="center" label="学生姓名" />
            <el-table-column prop="courseName" align="center" label="课程名称" />
            <el-table-column prop="className" align="center" label="班级名称" />
            <el-table-column prop="createdate" align="center" label="新增时间" />
          </el-table>
        </el-col>
      </el-row>

      <el-row class="mt20" :gutter="20">
        <el-col :span="9">
          <div class="charts-tile">
            本月缴费学员情况
          </div>
          <div id="myChart2" class="bkgfff" :style="{width: '100%', height: '320px'}" />
        </el-col>
        <el-col :span="15">
          <div class="charts-tile">
            本月缴费学员详情
            <div class="exportBtn" @click="exportBtn(pay,'本月缴费学员详情')">导出</div>
          </div>
          <el-table
            :data="payData.studentPayMoneyResponses"
            max-height="320"
            style="width: 100%;height: 320px;overflow-y:auto"
          >
            <el-table-column prop="studentName" align="center" label="学生姓名" />
            <el-table-column prop="courseName" align="center" label="课程名称" />
            <el-table-column prop="payMoney" align="center" label="缴费金额" />
            <el-table-column prop="payDate" align="center" label="缴费时间" />
          </el-table>
        </el-col>
      </el-row>
    </template>
    <template v-if="isShowBtm">
      <div class="title">欢迎{{ name }}登录易安房源后台管理系统</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      small:'',
      news:'',
      pay:'',
      a: '',
      data: {},
      tableDataNotice: [],
      tableDataDynamic: [],
      period: null,
      exhaustionData: {},
      AddStudentData: {},
      payData: {},
      isShowTop: false,
      isShowBtm: true,
      name: '',
      number: 5,
      fileName:''//导出文件名
    }
  },
  created() {
  },
  methods: {
    exportBtn(data,name) { // 导出
      // this.$API.system.exportLable({
      //   params: {
      //     redisKey:data,
      //     xlsxName:name
      //   }
      // }).then(data => {
      //   // console.log("打印="+JSON.stringify(data))
      //   // console.log("打印="+JSON.stringify( data.data.object.fileName))
      //   this.fileName = data.data.object.fileName
      //   var url = 'http://140.246.138.117:9316/download/xiaohuang/'+this.fileName
      //   window.open(url)
      // })
    },
    handleSmt() {
      if(this.period > 0){
        this.number = this.period;
      }else{
        this.number = 5;
      }
      // this.$API.system.systemIndexPeriodsReport({
      //   params: {
      //     period: this.period
      //   }
      // }).then(data => {
      //   this.exhaustionData = data.data.object;
      //   this.drawLineOne();
      // })
    },
    filNuber(divisor,dividend) {
      if (isNaN(divisor / dividend)) {
        return 0
      }
      if ((divisor / dividend) === Infinity) {
        return 0
      }
      return parseInt(((divisor / dividend) * 100).toFixed(2))
    },
    getList() {
      // this.$API.system.systemIndexPeriodsReport({
      //   params: {
      //     period: this.period
      //   }
      // }).then(data => {
      //   // console.log("列表信息key1："+JSON.stringify( data.data.object.studentPeriodResponseListOutPutKey))
      //   this.small = data.data.object.studentPeriodResponseListOutPutKey
      //   this.exhaustionData = data.data.object;
      //   this.drawLineOne();
      // })
      // this.$API.system.systemIndexAddStudent().then(data => {
      //   // console.log("列表信息key2："+JSON.stringify( data.data.object.studentDateResponseListOutPutKey))
      //   this.news = data.data.object.studentDateResponseListOutPutKey
      //   this.AddStudentData = data.data.object;
      //   this.drawLineTwo();
      // })
      // this.$API.system.systemIndexPayMoneyStudent().then(data => {
      //   // console.log("列表信息key3："+JSON.stringify( data.data.object.studentPayMoneyResponsesOutPutKey))
      //   this.pay = data.data.object.studentPayMoneyResponsesOutPutKey
      //   this.payData = data.data.object;
      //   this.drawLineThree();
      // })
    },
    drawLineOne() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
          tooltip: {
              trigger: 'axis',
          },
          grid: {
              left: '12%',
              right: '12%',
              borderWidth: 0,
              top: 50,
              bottom: 50,
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.exhaustionData.periods,
              name: '课时',
              nameLocation: 'end'
          },
          yAxis: {
              type: 'value',
              boundaryGap: [0, '100%'],
              name: '人数（人）',
              nameLocation: 'end'
          },
          series: [
              {
                  name:'人数',
                  type:'line',
                  smooth:true,
                  symbol: 'none',
                  sampling: 'average',
                  itemStyle: {
                      color: 'rgb(255, 70, 131)'
                  },
                  areaStyle: {
                      color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(255, 158, 68)'
                      }, {
                          offset: 1,
                          color: 'rgb(255, 70, 131)'
                      }])
                  },
                  data: this.exhaustionData.studentCount
              }
          ]
      })
      window.addEventListener('resize', () => { myChart.resize() })
    },
    drawLineTwo() {
      const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      myChart1.setOption({
          tooltip: {
              trigger: 'axis',
          },
          grid: {
              left: '12%',
              right: '12%',
              borderWidth: 0,
              top: 50,
              bottom: 50,
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.AddStudentData.dayNo,
              name: '日期',
              nameLocation: 'end'
          },
          yAxis: {
              type: 'value',
              boundaryGap: [0, '100%'],
              name: '人数（人）',
              nameLocation: 'end'
          },
          series: [
              {
                  name:'人数',
                  type:'line',
                  smooth:true,
                  symbol: 'none',
                  sampling: 'average',
                  itemStyle: {
                      color: 'rgb(255, 70, 131)'
                  },
                  areaStyle: {
                      color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(255, 158, 68)'
                      }, {
                          offset: 1,
                          color: 'rgb(255, 70, 131)'
                      }])
                  },
                  data: this.AddStudentData.studentCount
              }
          ]
      })
      window.addEventListener('resize', () => { myChart1.resize() })
    },
    drawLineThree() {
      const myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      myChart2.setOption({
          tooltip: {
              trigger: 'axis',
          },
          grid: {
              left: '12%',
              right: '12%',
              borderWidth: 0,
              top: 50,
              bottom: 50,
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.payData.dayNo,
              name: '日期',
              nameLocation: 'end'
          },
          yAxis: {
              type: 'value',
              boundaryGap: [0, '100%'],
              name: '人数（人）',
              nameLocation: 'end'
          },
          series: [
              {
                  name:'人数',
                  type:'line',
                  smooth:true,
                  symbol: 'none',
                  sampling: 'average',
                  itemStyle: {
                      color: 'rgb(255, 70, 131)'
                  },
                  areaStyle: {
                      color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(255, 158, 68)'
                      }, {
                          offset: 1,
                          color: 'rgb(255, 70, 131)'
                      }])
                  },
                  data: this.payData.studentCount
              }
          ]
      })
      window.addEventListener('resize', () => { myChart2.resize() })
    },
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
h5 {
  margin: 0;
  font-weight: 500;
  font-size: 15px;
}
.exportBtn{
  width: 70px;
  background: #1890ff;
  padding: 9px;
  border-radius: 6px;
  text-align: center;
  color: white;
  font-size: 14px;
  cursor:pointer;
}
.app-container {
  color: #3d3d3d;
  background: #f2f2f2;
  padding: 0 20px;
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    height: 149px;
    padding: 20px;
    margin-top: 20px;
    border-radius:15px;
    border:1px solid rgba(210,210,210,1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      width: 90px;
      height: 90px;
    }
    .info{
      height: 100%;
      color: #fff;
      text-align: right;
      font-size:20px;
      display: flex;
      flex-direction: column;
      p:nth-of-type(1){
        margin-top:10px;
        flex:2;
      }
      p:nth-of-type(2){
        flex:1;
      }
      .number{
        font-size:42px;
      }
    }
  }
  .one-box{
    background:linear-gradient(90deg,rgba(88,179,249,1),rgba(52,153,230,1));
  }
  .two-box{
    background:linear-gradient(90deg,rgba(249,222,82,1),rgba(235,203,37,1));
  }
  .three-box{
    background:linear-gradient(90deg,rgba(251,91,129,1),rgba(248,121,148,1));
  }
}
.charts-tile {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 14px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  white-space: nowrap;
  img {
    vertical-align: bottom;
    width: 18px;
  }
}

.bkgfff {
  background: #fff;
}
.mt20 {
  margin-top: 20px;
}
.none{
  display: none;
}
.block{
  display: inline-block;
}
.title{
  position: absolute;
  top:100px;
  left: 0;
  right: 0;
  text-align: center;
  // transform: scale(1.7);
  // animation:box .9s ease-in;
  // @-webkit-keyframes box{
  //   0%{
  //     top:10px;
  //     transform: scale(.2);
  //   }
  //   20%{
  //     top:200px;
  //     transform: scale(.5);
  //   }
  //   40%{
  //     top:100px;
  //     transform: scale(.8);
  //   }
  //   60%{
  //     top:200px;
  //     transform: scale(1.1);
  //   }
  //   80%{
  //     top:160px;
  //     transform: scale(1.4);
  //   }
  //   100%{
  //     top:200px;
  //     transform: scale(1.7);
  //   }
  // }
}
</style>
