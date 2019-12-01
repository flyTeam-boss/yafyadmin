<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
                vertical-align: top;
                padding-top: 10px;"
      >搜索通知：</span>
      <el-input
        v-model="listQuery.sreach"
        placeholder="输入标题关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker v-model="listQuery.pushTime" class="input-date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @blur="conso" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        v-if="isShowBtn('发布')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >发布通知</el-button>
    </div>

    <el-row v-if="total">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div v-for="item in list" :key="item.id" class="message-item" @click="goDetails(item.id)">
            <h4>标题：{{ item.title }}</h4>
            <ul>
              <!-- <li>发布人：{{ item.creator }}</li> -->
              <li>发布部门：教育局</li>
              <li>已读{{ item.readCounts }}</li>
              <li>发布时间：{{ item.createTime }}</li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-else class="NoMessage">
      暂无内容
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'RegionalLevel',
  components: { Pagination },
  data() {
    return {
      fileList: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 0,
        limit: 10,
        status: 1,
        type: 0,
        sreach: '',
        pushTime: ''
      },
      dialogFormVisible: false,
      data: [],
      checkList: [],
      configTips: ''
    }
  },
  created() {
    console.log(123456789)
    this.getList()
  },
  methods: {
    isShowBtn(key) {
      var falg = false
      JSON.parse(localStorage.btnPermissions).map(item => {
        if (this.$route.path.substr(1) === item.resourceUrl) {
          item.resourceDtos.map(info => {
            if (info.resourceName === key) {
              falg = true
            }
          })
        }
      })
      return falg
    },
    conso() {
      console.log(this.listQuery.date1)
    },
    ispChange(values, items) {
      console.log(1, values)
      console.log(items)
      // this.schoolId.values = values;
      // this.schoolId.items = items;
    },

    getList() {
      this.$API.school.notice({
        params: {
          ...this.listQuery
        }
      }).then(Response => {
        this.list = Response.data.object.list
        this.total = Response.data.object.total
      })
    },
    goDetails(id) {
      // 跳转详情
      this.$router.push(`/notification/notificationdetails?id=${id}&type=${0}`)
    },
    go135() {
      this.$router.push('announcement')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push('announcement?type=0')
      // this.reForm()
      // this.dialogFormVisible = true
      // this.$API.school
      //   .noticeAdd({
      //     params: {
      //       sendType: 0
      //     }
      //   })
      //   .then(Response => {
      //     this.data = Response.data.object
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
li,
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
.message-item {
  max-width: 100%;
  padding: 12px 10px 4px;
  border-bottom: 1px solid #cccccc;
  line-height: 30px;
  h4 {
    color: #333333;
    font-weight: 500;
    font-size: 17px;
    margin: 0;
  }
  ul {
    display: flex;
    li {
      padding-right: 20px;
      font-size: 15px;
      color: #999999;
    }
  }
}

</style>
