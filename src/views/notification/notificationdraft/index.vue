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
      <el-date-picker v-model="listQuery.pushTime" class="input-date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-row v-if="total">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div v-for="item in list" :key="item.id" class="message-item" @click="goDetails(item.id)">
            <div class="item-info">
              <h4>标题：{{ item.title }}</h4>
              <ul>
                <li v-if="item.type==0">发布部门：教育局</li>
                <li v-else>发布人：{{ item.creator }}</li>
                <li>已读{{ item.readCounts }}</li>
                <li>发布时间：{{ item.createTime }}</li>
              </ul>
            </div>
            <div class="variousBtn">
              <el-button v-if="isShowBtn('发布')" type="primary" size="small" @click="handleRelease(item.id)">发布</el-button>
              <el-button v-if="isShowBtn('编辑')" type="primary" size="small" @click="handleEdit(item.id,item.type)">编辑</el-button>
              <el-button v-if="isShowBtn('删除')" type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
            </div>
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
  name: 'NotificationDraft',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      data: [],
      listQuery: {
        page: 0,
        limit: 10,
        sreach: '',
        pushTime: '',
        status: 1,
        type: 2
      }
    }
  },
  created() {
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
    getList() {
      this.$API.school.noticeDraftNotice({
        params: {
          ...this.listQuery
        }
      }).then(Response => {
        this.list = Response.data.object.list
        this.total = Response.data.object.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 发布
    handleRelease(id) {
      window.event.stopPropagation()

      this.$confirm('确认发布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school.noticeSubmit({
          params: {
            noticeId: id
          }
        }).then(Response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '发布成功'
          })
        }).catch(Response => {
          this.$message({
            type: 'error',
            message: '发布失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    // 编辑
    handleEdit(id, type) {
      window.event.stopPropagation()
      this.$router.push(`announcement?id=${id}&type=${type}&edit=1`)
    },
    // 删除
    handleDelete(id) {
      window.event.stopPropagation()
      this.$confirm('此操作将永久删除该通知, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school.noticeDelete({
          params: {
            noticeId: id
          }
        }).then(Response => {
          if (Response.data.result === 'ok') {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    goDetails(id) {
      // 跳转详情
      this.$router.push(`/notification/notificationdetails?id=${id}&type=3`)
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
  max-width:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px 4px;
  border-bottom: 1px solid #cccccc;
  line-height: 30px;
  .item-info{
    max-width: 70%;
    h4 {
      color: #333333;
      font-weight: 500;
      font-size: 17px;
      margin: 0;
      max-width:100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
.variousBtn{
  min-width:200px;
}
</style>
