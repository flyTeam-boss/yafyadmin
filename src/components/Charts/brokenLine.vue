<template>
  <div>
    <div id="myChart1" class="bkgfff" :style="{width: '100%', height: '320px'}" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart1.setOption({
        backgroundColor: '#fff',
        grid: {
          y: '30px',
          x2: '30px',
          y2: '40px',
          x: '40px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#3FCFDA'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true
        // },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学生数量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [],
            itemStyle: {
              normal: {
                color: '#3FCFDA'
              },
              opacity: 0.1
            }
          }
        ]
      })
      // 异步加载数据
      myChart1.showLoading()
      this.$API.system.indexStatistics().then(Response => {
        myChart1.hideLoading()
        this.data = Response.data.object.grades
        const newName = []
        const newValue = []
        this.data.map(item => {
          newName.push(item.name)
          newValue.push(item.gradeCounts)
        })
        myChart1.setOption({
          xAxis: {
            data: newName
          },
          series: {
            data: newValue
          }
        })
      })
      // 自适应图表
      window.addEventListener('resize', () => { myChart1.resize() })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
