<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索模拟答题：</span>
      <el-select class="filter-item filter-inputs" v-model="listQuery.subjectId" 
      @change='selectSubject' placeholder="选择学科">
            <el-option
            v-for="item in subList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="subAfter" class="filter-item filter-inputs" v-model="listQuery.gradeId" placeholder="选择年级">
            <el-option
            v-for="item in gradeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      <el-input
        v-model="listQuery.className"
        placeholder="输入班级"
        class="filter-item filter-inputs"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="输入答题名称"
        class="filter-item filter-inputs"
        @keyup.enter.native="handleFilter"
      />
      <el-select class="filter-item filter-inputs" v-model="listQuery.status" placeholder="状态">
            <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加答题</el-button>
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
    <el-table-column
        type="selection"
        width="40">
        </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="答题名称" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科" sortable prop="subject" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级" sortable prop="grade" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" sortable prop="classNames" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.classNames}}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级数量" sortable prop="classCounts" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.classCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" sortable prop="creatorName" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" sortable prop="releaseTime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.releaseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" sortable prop="endTime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="createTime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" sortable prop="status" min-width="80" align="center">
        <template slot-scope="{row}">
          
          <span>{{statusList[row.status].name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="170" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" v-if="row.status != 0?true:false" size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" v-if="row.status == 0?true:false" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status == 2"
            size="mini"
            type="danger"
            @click="specialEnd(row)"
          >结束</el-button>
          <el-button
            v-if="row.status== 0"
            size="mini"
            type="danger"
            @click="delStatus(row)"
          >删除</el-button>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; 
export default {
  name: "Parent",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      subAfter:true,
      subList:[],
      gradeList:[],
      statusList:[{id:0,name:'草稿'},{id:1,name:'发布'},{id:2,name:'开始'},{id:3,name:'结束'}],
      isdisabled:false,
      listLoading: true,
      listLoading2:false,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        subjectId:'',
        gradeId:'',
        className:'',
        status:''
      },
      form: {
        phone:'',
        name:'',
        password:'',
        type:'',
        status:0,
        gradeId:'',
        subjectId:''
      },
      dialogFormVisible: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, message: "请输入家长姓名", trigger: "blur" }],
        type: [{ required: true, message: "请选择家长类型", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change,blur" }],
      }
    };
  },
  created() {
    this.listQuery={
      page: 1,
      limit: 20,
      name: '',
      subjectId:'',
      gradeId:'',
      className:'',
      status:''
    }
    this.$API.school.getSubByStatus().then((res)=>{
      this.subList = res.data.object
    })
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$API.specialPractice.limitTimePracticeList({...this.listQuery}).then(Response => {
        this.list = Response.data.object.list;
        this.total = Response.data.object.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    //结束
    specialEnd(row){
      this.$confirm('确认结束?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            this.$API.specialPractice.limitTimePracticeEnd(row.id).then((res)=>{
              if(res.data.result =='ok'){
                this.$message({
                  message:'操作成功',
                  type:'success'
                })
                this.listQuery = {
                  page: 1,
                  limit: 20,
                  name: '',
                  subjectId:'',
                  gradeId:'',
                  className:'',
                  status:''
                }
                this.getList()
              }
            })
        }).catch(() => {});
    },
    //删除
    delStatus(row){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            this.$API.specialPractice.limitTimePracticeDel(row.id).then((res)=>{
              if(res.data.result =='ok'){
                this.$message({
                  message:'操作成功',
                  type:'success'
                })
                this.listQuery = {
                  page: 1,
                  limit: 20,
                  name: '',
                  subjectId:'',
                  gradeId:'',
                  className:'',
                  status:''
                }
                this.getList()
              }
            })
        }).catch(() => {});
    },
    resetTemp() {
      this.form = {
        phone:'',
        name:'',
        password:'',
        type:'',
        status:0,
      }
    },
    handleCreate() {
      this.$router.push({
        path: "simulationadd"
      });
    },
    handleUpdate(row) {
      this.$router.push({
        path: "simulationedit",
        query:{
          id:row.id
        }
      });
    },
    handleDetail(row) {
      this.$router.push({
        path: "simulationdetail",
        query:{
          id:row.id
        }
      });
    },
    selectSubject(data){
      this.$API.school.getGradeBySubject(data).then((res)=>{
        this.gradeList = res.data.object
        this.subAfter = false
      })
    },
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.resetBox{
  display: flex;
  align-items: center;
  span{
    width:150px;
  }
  input{
    margin-left: 8px;
    width: 80%;
  }
}
.dialog-footer{
  margin-top: 50px;
}
.dialogBox{
  width:80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.filter-inputs{
    width:140px;
}
</style>
