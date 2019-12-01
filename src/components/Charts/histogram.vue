<template>
  <div>
    <div id="myChart" class="bkgfff" :style="{width: '100%', height: '320px'}" />
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
      const myChart = this.$echarts.init(document.getElementById('myChart'))

      // 绘制图表
      myChart.setOption({
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          y: '30px',
          x2: '30px',
          y2: '40px',
          x: '40px'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            // interval:0,
            formatter: function(value) {
              return value.split('').join('\n')
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#3FCFDA'
              }
            }
          }
        ]
      })
      myChart.showLoading()
      this.$API.system.indexStatistics().then(Response => {
        myChart.hideLoading()
        this.data = Response.data.object.subjectCourseTeacherResponses
        const newName = []
        const newValue = []
        this.data.map(item => {
          newName.push(item.name)
          newValue.push(item.teachers)
        })
        myChart.setOption({
          xAxis: {
            data: newName
          },
          series: [
            {
              data: newValue
            }
          ]
        })
      })
      // 自适应图表
      window.addEventListener('resize', () => { myChart.resize() })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
