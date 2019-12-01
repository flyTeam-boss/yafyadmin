<template>
  <div>
    <div id="myChart3" class="bkgfff" :style="{width: '100%', height: '320px'}" />
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
      var myChart3 = this.$echarts.init(document.getElementById('myChart3'))
      // 绘制图表
      myChart3.setOption({
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
            data: []
          }
        ]
      })
      // 异步加载数据
      myChart3.showLoading()
      this.$API.system.indexStatistics().then(Response => {
        myChart3.hideLoading()
        this.data = Response.data.object.dynamicReportResponses
        for (var i = 0; i < 7; i++) {
          if (this.data[i + 1] === 0) {
            this.data[i + 1] = {
              dynamicCount: 0,
              percent: 0,
              readCount: 0,
              weekName: 0
            }
          }
        }
        myChart3.setOption({
          series: {
            data: [
              { value: this.data[1].dynamicCount, name: '星期一' },
              { value: this.data[2].dynamicCount, name: '星期二' },
              { value: this.data[3].dynamicCount, name: '星期三' },
              { value: this.data[4].dynamicCount, name: '星期四' },
              { value: this.data[5].dynamicCount, name: '星期五' },
              { value: this.data[6].dynamicCount, name: '星期六' },
              { value: this.data[7].dynamicCount, name: '星期天' }
            ]
          }
        })
      })
      // 自适应图表
      window.addEventListener('resize', () => {
        myChart3.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
