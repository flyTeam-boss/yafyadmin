<template>
  <div>
    <div id="myChart2" class="bkgfff" :style="{width: '100%', height: '320px'}" />
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
      var myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      // 绘制图表
      myChart2.setOption({
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: [
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六',
            '星期天'
          ]
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorarrays = [
                    '#56B5E3',
                    '#F86846',
                    '#5DC053',
                    '#F7B432',
                    '#41BDB5',
                    '#55D7B3',
                    'pink'
                  ]
                  return colorarrays[params.dataIndex]
                }
              }
            },
            data: [
              { value: 335, name: '星期一' },
              { value: 310, name: '星期二' },
              { value: 234, name: '星期三' },
              { value: 135, name: '星期四' },
              { value: 158, name: '星期五' },
              { value: 148, name: '星期六' },
              { value: 148, name: '星期天' }
            ]
          }
        ]
      })
      // 异步加载数据
      myChart2.showLoading()
      this.$API.system.indexStatistics().then(Response => {
        myChart2.hideLoading()
        this.data = Response.data.object.noticeReportResponses
        for (var i = 0; i < 7; i++) {
          if (this.data[i + 1] === 0) {
            this.data[i + 1] = {
              noticeCount: 0,
              percent: 0,
              readCount: 0,
              weekName: 0
            }
          }
        }
        myChart2.setOption({
          series: {
            data: [
              { value: this.data[1].noticeCount, name: '星期一' },
              { value: this.data[2].noticeCount, name: '星期二' },
              { value: this.data[3].noticeCount, name: '星期三' },
              { value: this.data[4].noticeCount, name: '星期四' },
              { value: this.data[5].noticeCount, name: '星期五' },
              { value: this.data[6].noticeCount, name: '星期六' },
              { value: this.data[7].noticeCount, name: '星期天' }
            ]
          }
        })
      })
      // 自适应图表
      window.addEventListener('resize', () => {
        myChart2.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
