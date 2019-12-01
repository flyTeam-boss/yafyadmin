<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索用户：</span>
      <el-input v-model="listQuery.keyword" placeholder="用户登录名或真实姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary"  @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="登录账号" sortable prop="account" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" sortable prop="realName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" sortable prop="roleName" align="center">
        <template slot-scope="scope">
         <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录端口"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.descr }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'DataTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword:''
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$API.system.accountLog({...this.listQuery}).then(Response => {
        this.list = Response.data.object.list
        this.list.forEach((item)=>{
          item.ip = 'PC'
        })
        this.total = Response.data.object.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>
<style lang="scss">

</style>
