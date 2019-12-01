<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索消息：</span>
      <el-input
        v-model="listQuery.title"
        placeholder="输入标题关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.sendTime"
        type="date"
        style="width: 200px;"
        class="filter-item"
        placeholder="选择发布日期"
        value-format="yyyy-MM-dd"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >发布消息</el-button>
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
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="标题" sortable prop="title"  align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <span>{{ scope.row.title }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{scope.row.title }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="sendTime" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">已发布</span>
          <span v-else>已下架</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="row.status=='1'"
            size="mini"
            type="primary"
            style="background:#FFAD85;"
            @click="handleModifyStatus(row,'0')"
          >上架</el-button>
          <el-button
            v-if="row.status=='0'"
            size="mini"
            type="primary"
            @click="handleModifyStatus(row,'1')"
          >下架</el-button>
          <el-button type="danger" size="mini" @click="handleShelf(row,2)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog center title="发布消息" 
      :visible.sync="dialogFormVisible"
      :before-close="closeDL">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="form"
              label-position="right"
              label-width="95px"
            >
              <el-form-item label="标题：" prop="title">
                <el-input v-model="form.title" placeholder="输入标题" />
              </el-form-item>
              <el-form-item label="发布内容：" prop="content">
                <Tinymce ref="editor" v-model="form.content" :height="400" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center">
              <el-button
                :disabled="isdisabled"
                type="primary"
                @click="createData"
              >发布</el-button>
              <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'

export default {
  name: 'SystemMessage',
  components: { Pagination, Tinymce },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      status:0,//上架
      isdisabled:false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        sendTime: ''
      },
      form: {
        content: '',
        title: ''
      },
      data: [],
      resourceIdsBox: [],
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      },
      downloadLoading: false,
      defaultProps: {
        children: 'resourceDtos',
        label: 'resourceName',
        id: 'id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.resourceIdsBox.push(data.id)
      } else {
        var index = this.resourceIdsBox.indexOf(data.id)
        if (index > -1) {
          this.resourceIdsBox.splice(index, 1)
        }
      }
      this.form.resourceIds = this.resourceIdsBox
    },
    closeDL(){
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
      this.form = {
        content: '',
        title: ''
      }
    },
    getList() {
      this.listLoading = true
      this.$API.system.systemMessage({
          ...this.listQuery
      }).then(response => {
        this.list = response.data.object.list
        this.total = response.data.object.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.form = {
        title: '',
        content: ''
      }
    },
    handleCreate() {
      // 表单初始化
      this.resetTemp()
      // 弹出蒙层
      this.dialogFormVisible = true
    },
    createData() {
      this.isdisabled = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$API.system.messageAdd({
            ...this.form
          }).then(response => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.resetTemp()
            this.getList()
            this.closeDL()
            this.isdisabled = false
          })
        }
      })
    },
    //删除
    handleShelf(row, status) {
      this.$confirm('确认删除吗？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$API.system.messageDel({
              id: row.id,
              status: status
          }).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //上架下架
    handleModifyStatus(row, status) {
      this.listLoading = true
      this.$API.system.updateStatus({id:row.id, status}).then(response => {
        this.listLoading = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(response => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
  }
}
</script>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.v-modal {
  z-index: 10 !important;
}
.name-wrapper{
  white-space:nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
</style>
