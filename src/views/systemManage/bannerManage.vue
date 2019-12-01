<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索banner名称：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="输入banner名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      >添加banner</el-button>
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
      <el-table-column label="序号" type="index" min-width="100" align="center">
      </el-table-column>
      <el-table-column label="ID" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="banner名称" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.name }}</span>
            <div slot="reference" class="name-wrapper">
            <span>{{ row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.url }}</span>
            <div slot="reference" class="name-wrapper">
            <span>{{ row.url }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="100" align="center">
        <template slot-scope="{row}">
          <img :src="row.cover" style="width:50px;" alt="">
        </template>
      </el-table-column>
      <el-table-column label="所属端口" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.appType==0?'家长端':'教师端' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="{row}">
          <span >{{row.status==0?'启用':'禁用'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status=='0'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'1')"
          >禁用</el-button>
          <el-button
            v-if="row.status=='1'"
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
      :title="dialogStatus==='create'?'新增banner':'编辑banner'"
      :visible.sync="dialogFormVisible4"
      :before-close="closeDL"
    >
      <el-form
        class="dialogBox"
        v-loading="listLoading"
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="70px"
      >
        <el-form-item label="发布形式：" label-width="95px" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1" :value="1">内容</el-radio>
            <el-radio :label="0" :value="0">链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type == '1'" label="标题：" label-width="95px" :prop="form.type == 1?'name':''">
          <el-input v-model="form.name" style="max-width:260px;" placeholder="输入标题" />
        </el-form-item>

        <el-form-item label="封面：" prop="cover" label-width="95px">
          <el-upload
            v-model="form.cover"
            class="upload-demo"
            :action="baseUrl+'/commons/upload/file'"
            :on-success="handleAvatarSuccess"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PBG, .GIF"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>

        <el-form-item label="展示顺序：" label-width="95px" prop="weight">
          <el-select v-model="form.weight" placeholder="选择顺序">
            <el-option
              v-for="item in 6"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP类型：" label-width="95px" prop="appType">
          <el-radio-group v-model="form.appType">
            <el-radio :label="1" :value="1">教师端</el-radio>
            <el-radio :label="0" :value="0">家长端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type == '0'" label="输入链接：" :prop="form.type == 0?'url':''" label-width="95px">
          <el-input v-model="form.url" style="max-width:260px;" placeholder="输入链接" />
        </el-form-item>
        <el-form-item v-if="form.type == '1'" label="发布内容" :prop="form.type == 0?'content':''" label-width="95px">
          <Tinymce ref="editor" v-model="form.content" :height="400" />
        </el-form-item>
      </el-form>
      
      <div class="dialog-footer">
        <el-button :disabled="isdisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
export default {
  name: "UserAdmin",
  components: { Pagination,Tinymce},
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      appTypes:["教师端","家长端"],
      fileList:[],
      resetdata:'',
      tableKey: 0,
      list: null,
      total: 0,
      isdisabled:false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ""
      },
      form: {
        type: 1,
        name: '',
        cover: '',
        weight: '',
        appType: [],
        url: '',
        content: '',
        status:0
      },
      dialogFormVisible4: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        type: [{ required: true, message: "请选择发布形式", trigger: "change" }],
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        cover: [{ required: true, message: "请上传封面", trigger: "blur" }],
        url: [{ required: true, message: "请输入链接", trigger: "blur" }],
        appType: [{ required: true, message: "请选择APP类型", trigger: "change" }],
        weight: [{ required: true, message: "请选择展示顺序", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭蒙层
    closeDL(){
      this.dialogFormVisible4 = false;
      this.$refs.dataForm.clearValidate();
      this.form = {
        type: 1,
        name: '',
        cover: '',
        weight: '',
        appType: [],
        url: '',
        content: '',
        status:0
      }
      this.fileList=[]
    },
    getList(){
      this.listLoading = true;
      this.$API.system.bannerList({...this.listQuery}).then(Response => {
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
      this.$API.system
        .bannerUpdateStatus({
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
    resetForm(type) {
      this.fileList = []
      this.form = {
        type: JSON.stringify(type),
        title: '',
        seque: '',
        cover: '',
        appType: '',
        url: '',
        content: '',
        status:0
      }
      // this.$refs['dataForm'].clearValidate()
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible4 = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.$API.system.bannerAdd(this.form)
            .then(Response => {
              if(Response.data.result == 'ok'){
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.closeDL();
                this.isdisabled = false
              }
            })
        }
      });
    },
    handleUpdate(row) {
      this.dialogFormVisible4 = true;
      this.dialogStatus = "update";
      this.listLoading = true
      this.$API.system.bannerEdit(row.id).then((res)=>{
         this.form = {
            appType: res.data.object.appType,
            content: res.data.object.content,
            cover: res.data.object.cover,
            id: res.data.object.id,
            name: res.data.object.name,
            status: res.data.object.status,
            type: res.data.object.type,
            url: res.data.object.url,
            weight: res.data.object.weight
          }
        this.fileList.push({uid:0,url:res.data.object.cover})
      this.listLoading = false
      })
    },
    updateData() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.isdisabled = true
            this.$API.system.bannerUpdate({...this.form}).then(Response => {
                if (Response.data.result == "ok") {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.getList();
                  this.closeDL();
                  this.isdisabled = false
                }
              })
          }
        });
    },
    //封面上传成功时
    handleAvatarSuccess(res){
      this.form.cover = res.object
      this.fileList.push({url:res.object})
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
.name-wrapper{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
.dialogBox{
  img{
    width: 50px;
  }
  
}
</style>
