<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索版本：</span>
      <el-input v-model="listQuery.versionCode" placeholder="输入版本号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary"  @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleCreate">
        添加版本
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
      <el-table-column label="版本号" min-width="100" sortable  prop="versionCode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.versionCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="构建版本号" sortable prop="versionNumber" min-width="120"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.versionNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.types==0?'家长端':'教师端'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appType==0?'android':'ios'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否强制更新" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.upgrade==0?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新地址" min-width="120" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <span>{{ scope.row.url }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.url }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'启用':'禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="createTime" min-width="180"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            编辑
          </el-button>
          <el-button
            v-if="row.status==0"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,1)"
          >禁用</el-button>
          <el-button
            v-if="row.status==1"
            size="mini"
            type="info"
            @click="handleModifyStatus(row,0)"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog center :title="form.id!=''?'编辑版本':'添加版本'" 
    :visible.sync="dialogFormVisible"
    :before-close="closeDL">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="70px">
        <el-form-item label="版本类型：" label-width="100px" prop="types">
          <el-select v-model="form.types" placeholder="请选择版本类型">
            <el-option label="家长端" :value="0" />
            <el-option label="教师端" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号：" label-width="100px" prop="versionCode">
          <el-input v-model="form.versionCode" style="width:200px;" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="APP类型：" label-width="100px" prop="appType">
          <el-select v-model="form.appType" placeholder="请选择APP类型">
            <el-option label="android" :value="0" />
            <el-option label="ios" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="强制更新：" label-width="100px" prop="upgrade">
          <el-select v-model="form.upgrade" placeholder="请选择">
            <el-option label="强制" :value="0" />
            <el-option label="非强制" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新链接：" label-width="100px" prop="url">
          <el-input v-model="form.url" placeholder="版本更新链接" />
        </el-form-item>
        <el-form-item label="版本特征：" label-width="100px" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="输入新特征内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isdisabled" type="primary" @click="updateData">
          保存
        </el-button>
        <el-button :disabled="isdisabled" @click="closeDL">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'DataTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      isdisabled:false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        versionCode:''
      },
      form: {
        appType: undefined,
        status:0,
        id: '',
        remark: '',
        types: undefined,
        upgrade: undefined,
        url: '',
        versionCode: ''
      },
      // 表单验证
      rules: {
        appType: [{ required: true, message: '请选择APP类型', trigger: 'change' }],
        versionCode: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        types: [{ required: true, message: '请选择版本类型', trigger: 'change' }],
        upgrade: [{ required: true, message: '请选择是否强制更新', trigger: 'change' }],
        url: [{ required: true, message: '请输入更新链接', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入版本特征', trigger: 'blur' }]
      },
      calendarTypeOptions,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  watch: { // this.$route.path
    dialogFormVisible: function(newVal, oldVal) {
      if (newVal === false) {
        this.form = {
          appType: undefined,
          id: '',
          remark: '',
          types: undefined,
          upgrade: undefined,
          url: '',
          versionCode: '',
          status:0,
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$API.system.appListData({...this.listQuery}).then(res => {
        if (res.data.result == 'ok') {
          this.list = res.data.object.list
          this.total = res.data.object.total
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 禁用or启用
    handleModifyStatus(row, status) {
      this.$API.system
        .appEdit({
            status,
            id: row.id
        })
        .then(response => {
          if(response.data.result == 'ok'){
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          }
        })
        
    },
    resetTemp() {
      this.form = {
        appType: undefined,
        id: '',
        remark: '',
        types: undefined,
        upgrade: undefined,
        url: '',
        versionCode: '',
        status:0,
      }
    },
    closeDL(){
      this.resetTemp()
      this.dialogFormVisible = false
      this.$refs['dataForm'].clearValidate()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      
    },
    handleUpdate(id) { // 编辑
    this.dialogFormVisible = true
    this.isdisabled = true
      this.$API.system.appEditById(id).then((res)=>{
              if (res.data.result === 'ok') {
                this.form = res.data.object
                this.isdisabled = false
              }
            })
    },
    updateData() { // 添加编辑版本
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.isdisabled = true
            console.log(this.isdisabled)
            this.$API.system.appEdit(this.form).then((res)=>{
              if (res.data.result === 'ok') {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.isdisabled = false
              }
            })
          } else {
            this.isdisabled = true
            this.$API.system.appAdd(this.form).then((res)=>{
              if (res.data.result === 'ok') {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.isdisabled = false
              }
            })
          }
        }
      })
    },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }
  }
}
</script>
<style lang="scss">

</style>
