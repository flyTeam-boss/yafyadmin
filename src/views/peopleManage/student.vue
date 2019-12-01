<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索学生：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="输入姓名"
        style="width: 100px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.stuNo"
        placeholder="输入学号"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.parentPhone"
        placeholder="输入联系电话"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary"  @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加学生</el-button>
      <el-upload class="filter-item" 
      :show-file-list="false"
      :action="baseUrl+'/student/batchImport'" 
      :headers="importHeaders" 
      :on-success="batchAddition">
        <el-button style="margin-left: 10px;" type="primary">导入</el-button>
      </el-upload>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleDownload">
        下载模板
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
    <el-table-column
        type="selection"
        width="40">
        </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="ID" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生学号" sortable prop="stuNo" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" sortable prop="name" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" sortable prop="sex" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex=='0'?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家长姓名" sortable prop="parentName" min-width="160" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.parentName }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.parentName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="家长联系电话" min-width="160" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.parentPhone }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.parentPhone }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable prop="stuStatus" width="90" align="center">
        <template slot-scope="{row}">
          <span >{{row.stuStatus=='0'?'启用':'禁用'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="170" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.stuStatus =='0'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'1')"
          >禁用</el-button>
          <el-button
            v-if="row.stuStatus=='1'"
            size="mini"
            type="info"
            @click="handleModifyStatus(row,'0')"
          >启用</el-button>
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

    <el-dialog
      center
      :title="dialogStatus==='create'?'添加学生':'编辑学生'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDL"
    >
      <el-form
      v-loading="listLoading2"
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
      <div class="dialogBox">
        <el-form-item label="学生姓名：" label-width="95px" prop="name">
            <el-input v-model="form.name" class="max-w300" placeholder="输入学生姓名"/>
        </el-form-item>
        <el-form-item label="学生学号：" label-width="95px" prop="stuNo">
            <el-input v-model="form.stuNo" class="max-w300" placeholder="输入学生学号"/>
        </el-form-item>
    </div>
        <div class="dialogBox">
            <el-form-item label="学生性别：" label-width="95px" prop="sex">
            <el-select v-model="form.sex" placeholder="选择性别">
                <el-option label="男" :value="0" />
                <el-option label="女" :value="1" />
            </el-select>
            </el-form-item>
            <el-form-item label="入校时间：" label-width="95px" prop="joinTime">
                <el-date-picker
                    v-model="form.joinTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                    </el-date-picker>
            </el-form-item>
        </div>
        <div class="addClassBox">
            <div class="dialogBox">
                <el-form-item label="选择学科：" label-width="95px" prop="subjectId">
                    <el-select v-model="form.subjectId" @change='selectSubject' placeholder="请选择学科">
                        <el-option
                        v-for="item in subjectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <div v-if="dialogStatus=='update'?false:true" class="defPwd">请先选择学科，再选择年级，最后选择班级</div>
                </el-form-item>
                <el-form-item label="选择年级：" label-width="95px" prop="gradeId">
                    <el-select :disabled="subjectAfter" @change='selectClass' v-model="form.gradeId" placeholder="请选择年级">
                        <el-option
                        v-for="item in gradeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialogBox">
              <el-form-item label="选择班级：" label-width="95px" prop="classesId">
                <el-select :disabled="classAfter" v-model="form.classesId" placeholder="请选择班级">
                    <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.className"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
        </div>
        <div class="dialogBox">
            <el-form-item label="关联家长："  label-width="95px" prop="parenIds">
                <el-select v-model="form.parenIds" :multiple='true'  placeholder="请选择家长">
                        <el-option
                        v-for="item in parentList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
          </div>
        <el-form-item label="状态："  label-width="95px" style="width:100%" prop="status">
            <el-radio-group v-model="form.status">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="isdisabled" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";
export default {
  name: "Student",
  components: { Pagination },
  data() {
    var nameReg = /^[A-Za-z0-9].*$/
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学号不能为空'))
      }
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母或数字'))
        } else {
          callback()
        }
    }
    return {
      importHeaders:{ Authorization: getToken()},
      baseUrl: process.env.VUE_APP_BASE_API,
      subjectList:[],
      gradeList:[],
      classList:[],
      parentList:[],
      tableKey: 0,
      list: null,
      total: 0,
      isdisabled:false,
      listLoading: false,
      listLoading2: false,
      subjectAfter:true,
      classAfter:true,
      listQuery: {
        page: 1,
        limit: 20,
        name: "",
        stuNo:'',
        parentPhone:''
      },
      form: {
        name:'',
        stuNo:'',
        sex:'',
        joinTime:'',
        classesId:'',
        gradeId:'',
        subjectId:'',
        parenIds:[],
        status:0
      },
      roleList: [],
      dialogFormVisible: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        stuNo: [{ required: true, validator:validateName, trigger: "blur" }],
        joinTime: [{ required: true, message: "请选择入学时间", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        parenIds: [{ required: true, message: "请关联家长", trigger: "blur" }],
        classesId: [{ required: true, message: "请选择班级", trigger: "change" }],
        subjectId: [{ required: true, message: "请选择学科", trigger: "change" }],
        gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭蒙层
    closeDL() {
      this.resetTemp()
      this.$refs.dataForm.clearValidate();
      this.dialogFormVisible = false;
    },
    getList() {
      this.listLoading = true;
      this.$API.student.studentList({...this.listQuery}).then(Response => {
          this.list = Response.data.object.list;
          this.total = Response.data.object.total;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 禁用or启用
    handleModifyStatus(row, status) {
      this.$API.student
        .studentUpdateStatus({
          status,
          id: row.id
        })
        .then(response => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
        })
        .catch(response => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    resetTemp() {
      this.form = {
        name:'',
        stuNo:'',
        sex:'',
        joinTime:'',
        classesId:'',
        parenIds:[],
        status:0
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.listLoading2 = true
      this.getData()
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.form.joinTime = this.form.joinTime+' 00:00:00'
          this.form.parenIds = this.form.parenIds.join(',')
          this.$API.student.studentSave({...this.form}).then(Response => {
              if (Response.data.result == "ok") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.getList();
                this.isdisabled = false
              }else{
                this.$message({
                  message: Response.data.errorMsg,
                  type: "error"
                });
                var arr = []
                if(this.form.parenIds.includes(',')){
                  this.form.parenIds.split(',').forEach((item)=>{
                    arr.push(parseInt(item));
                  })
                  
                }else{
                  arr.push(parseInt(this.form.parenIds));
                }
                this.form.parenIds = arr
                this.isdisabled = false
              }
            });
        }
      });
    },
    handleUpdate(row) {
      this.resetTemp()
      this.listLoading2 = true
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.subjectAfter = false
      this.classAfter = false
      this.getData()
      this.$API.student.studentEdit(row.id).then((res)=>{
        this.form.id = res.data.object.id
        this.form.name=res.data.object.name
        this.form.stuNo=res.data.object.stuNo
        this.form.joinTime=res.data.object.joinTime
        this.form.sex = Number(res.data.object.sex)
        this.form.gradeId = Number(res.data.object.gradeId)
        this.form.classesId = Number(res.data.object.classesId)
        this.form.subjectId = Number(res.data.object.subjectId)
        if(res.data.object.parenIds.includes(',')){
          res.data.object.parenIds.split(',').forEach((item)=>{
          this.form.parenIds.push(parseInt(item));
        })
        }else{
          this.form.parenIds.push(parseInt(res.data.object.parenIds));
        }
        
          this.$API.school.getGradeBySubject(res.data.object.subjectId).then((res)=>{
          this.gradeList = res.data.object
          })
          this.$API.school.getClassBytGrade(res.data.object.gradeId).then((res)=>{
            this.classList = res.data.object
            this.listLoading2= false
          })
         
      })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled=true
          this.form.parenIds = this.form.parenIds.join(',')
          this.$API.student.studentEditSave({...this.form}).then(Response => {
              if (Response.data.result == "ok"){
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.getList();
                this.isdisabled=false
              }else{
                this.$message({
                  message: "操作失败，请重试",
                  type: "error"
                });
                this.isdisabled=false
              }
            });
        }
      });
    },
    handleDownload() {
        // 下载模板
        var url = process.env.VUE_APP_BASE_API+"excel/学生管理导入模板.xlsx";
        window.open(url);
    },
    batchAddition(ret) {
      // 导入
      if (ret.result === "ok") {
        if (ret.object.errorCount > 0) {
          var errorKey = ret.object.errorKey;
          this.$confirm(
            "成功导入" +
              ret.object.okCount +
              "人，" +
              ret.object.errorCount +
              "人导入失败," +
              "是否导出错误信息？",
            "提示",
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: "warning"
            }
          )
            .then(() => {
              this.$API.student.studentErrorInfo(errorKey).then(ret => {
                // 导出错误信息
                window.location.href =
                  process.env.VUE_APP_BASE_API.replace("console","")+
                  "download/"+ret.data.object
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
              this.getList();
            });
        } else {
          this.$message({
            type: "success",
            message: "成功导入" + ret.object.okCount + "人"
          });
          this.getList();
        }
      }
    },
    selectSubject(data){
      this.$API.school.getGradeBySubject(data).then((res)=>{
          this.form.gradeId = ''
          this.classList = []
          this.form.classesId = ''
          this.gradeList = res.data.object
          this.subjectAfter = false
      })
    },
    selectClass(data){
      this.$API.school.getClassBytGrade(data).then((res)=>{
          this.form.classesId = ''
          this.classList = res.data.object
          this.classAfter = false
      })
    },
    getData(){
      this.$API.school.getSubByStatus().then(res => {
        this.subjectList = res.data.object;
      });
      this.$API.parent.getPanrentListByStatus().then((res)=>{
        this.parentList = res.data.object
        this.listLoading2 = false
      })
    }
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
.dialogBox{
    max-width:90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input {
        display: block;
        width: 220px;
    }
}
.name-wrapper{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.defPwd{
  color:red;
  font-size: 12px;
}
</style>
