<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-arrow-left" @click="goback">返回</el-button>
    <div class="item-info">
      <h4>{{ list.title }}</h4>
      <div class="info-time">
        <p v-if="list.type==0">发布部门：教育局&emsp;已读{{ list.readCounts }}</p>
        <p v-else>发布人：{{ list.creator }}&emsp;已读{{ list.readCounts }}</p>
        <p>发布时间：{{ list.createTime }}</p>
      </div>
      <p>摘要：{{ list.summary }}</p>
      <p>内容：<span style="text-indent:2em" v-html="list.content" /></p>
      <div v-for="item in type" :key="item.id" class="enclosure-container" @click="download(item.url)">
        <div class="enclosure">
          <img :src="imgFil(item.type)" alt="">
          <p>{{ item.fileName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wImg from '@/icons/imgs/icon-w.png'
import pdfImg from '@/icons/imgs/icon-pdf.png'
import xlsImg from '@/icons/imgs/icon-xls.png'
export default {
  name: 'NotificationDetails',
  data() {
    return {
      list: [],
      wImg: wImg,
      pdfImg: pdfImg,
      xlsImg: xlsImg,
      type: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$API.school.noticeNoticeEdit({
        params: {
          noticeId: this.$route.query.id
        }
      }).then(Response => {
        this.list = Response.data.object.noticeAnnexResponsse
        this.type = Response.data.object.noticeAnnexes
      })
    },
    imgFil(type) {
      if (type === 'xls' || type === 'xlsx') {
        return this.xlsImg
      }
      if (type === 'doc' || type === 'docx') {
        return this.wImg
      }
      if (type === 'pdf') {
        return this.pdfImg
      }
    },
    download(url) {
      window.location.href = url
    },
    goback() {
      if (this.$route.query.type === '0') {
        this.$router.push('regionallevel')
      } else if (this.$route.query.type === '1') {
        this.$router.push('schoollevel')
      } else if (this.$route.query.type === '2') {
        this.$router.push('classlevel')
      } else if (this.$route.query.type === '3') {
        this.$router.push('notificationdraft')
      }
    }

  }
}
</script>

<style lang="scss" scoped>
    .item-info{
        margin-top:20px;
        margin: auto;
        max-width: 80%;
        font-size:17px;
        color:#333333;
        h4{
            margin:auto;
            text-align: center;
            font-weight:500;
            font-size:19px;
            max-width:80%;
        }
        .info-time{
            display: flex;
            justify-content: space-between;
            font-size:15px;
            color:#999999;
        }
    }
    .enclosure-container{
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-top:20px;
      .enclosure{
        display: flex;
        align-items: center;
        min-width: 200px;
        padding:10px;
        background: rgb(242,242,242);
        border-radius: 6px;
        margin-right:15px;
        img{
          width:30px;
        }
        p{
          margin: auto;
        }
      }
    }
</style>
