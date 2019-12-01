<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索加盟校名称：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="输入学校名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary"  @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加学校</el-button>
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
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column label="ID" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校名称" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.schoolName }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.schoolName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="所在地" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.province }}{{ row.city }}{{ row.area }}{{ row.address }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.province }}{{ row.city }}{{ row.area }}{{ row.address }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status == '1'">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.createTime }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.createTime }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="180"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="payCost(row)">缴费</el-button>
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
      title="添加缴费"
      :visible.sync="dialogFormVisible2"
      :before-close="closeDL2"
    >
    <el-form
        ref="dataForm2"
        :rules="payRrules"
        :model="payform"
        label-position="right"
        label-width="70px"
      >
      <el-form-item label="缴费学校：" class="max-w300"  label-width="95px">
        <span>{{payform.schoolName}}</span>
      </el-form-item>
      <el-form-item label="缴费时长：" class="max-w300" prop="duration" label-width="95px">
          <el-select v-model="payform.duration" placeholder="请选择">
                <el-option
                v-for="item in 12"
                :key="item"
                :value="item">
                </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="到期时间：" class="max-w300" label-width="95px">
        <span>{{payform.afterExpireDate}}</span>
      </el-form-item>
      <el-form-item label="金额：" class="max-w300" prop="price" label-width="95px">
        <el-input type="number" v-model.number="payform.price" placeholder="输入金额（单位：元）" />
      </el-form-item>
      <el-form-item class="max-w300" label="备注：" label-width="95px">
          <el-input type="textarea" v-model="payform.remark" placeholder="输入备注" />
        </el-form-item>
    </el-form>
    <div class="dialog-footer">
        <el-button type="primary" :disabled="isdisabled" @click="savePay">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL2">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      center
      :title="dialogStatus==='create'?'添加学校':'编辑学校'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDL"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="70px"
      >
        <div class="gongge">
          <el-form-item label="学校名称：" prop="schoolName" label-width="95px">
            <el-input v-model="form.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contact" label-width="95px">
            <el-input v-model="form.contact" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone" label-width="95px">
            <el-input type="number" v-model.number="form.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item class="school-address" label="学校地址：" prop="area" label-width="95px">
            <v-distpicker
              v-model="form.area"
              @province="changeProvince"
              @city="changeCity"
              @area="changeArea"
              :province="form.province"
              :city="form.city"
              :area="form.area"
              :placeholders="{ province: '选择省', city: '选择市', area: '选择区' }"
              class="my-distpicker"
            ></v-distpicker>
          </el-form-item>
          <el-form-item class="school-textarea" label="详细地址：" prop="address" label-width="95px">
            <el-input v-model="form.address" placeholder="请输入具体街道"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="status" label-width="80px">
                <el-radio-group v-model="form.status">
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
        </div>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="isdisabled" @click="createData">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "UserAdmin",
  components: { Pagination },
  data() {
    var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
    var priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    var validatePrice = (rule, value, callback) => {
        if (!priceReg.test(value)) {
          callback(new Error('请输入数字型的金额'))
        } else {
          callback()
        }
    }
    var validatePhone = (rule, value, callback) => {
        if (!phoneReg.test(value)) {
          callback(new Error('请输入正确的11位手机号'))
        } else {
          callback()
        }
    }    
    return {
      resetdata: "",
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
        province: "",
        city: "",
        area: "",
        address: "",
        userName: "",
        contact: '',
        phone: '',
        schoolName: '',
        status: ''//0表示正常；1表示禁用；
      },
      payform:{
          afterExpireDate: '',
          duration: 1,//时长
          price: 0,//续费金额
          remark: '',//备注
          schoolId: '',
          schoolName: ''
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        schoolName: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        area: [{ required: true, message: "请选择学校所在省市区", trigger: "blur" }],
        address: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        phone:[{ required: true, validator: validatePhone, trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      payRrules: {
        duration: [{ required: true, message: "请选择续费时长", trigger: "blur" }],
        price:[{ required: true, validator:validatePrice, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭蒙层
    closeDL() {
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
      this.form = {
        province: "",
        city: "",
        area: "",
        address: "",
        userName: "",
        contact: '',
        phone: '',
        schoolName: '',
        status: ''
      };
    },
    closeDL2() {
      this.dialogFormVisible2 = false;
      this.$refs.dataForm2.clearValidate();
      this.payform={
          afterExpireDate: '',
          duration: 1,//时长
          price: 0,//续费金额
          remark: '',//备注
          schoolId: '',
          schoolName: ''
      }
    },
    getList() {
      this.listLoading = true;
      this.$API.school.joinSchoolList({...this.listQuery}).then(Response => {
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
      this.$API.school
        .updateStatus({
          params: {
            status,
            id: row.id
          }
        })
        .then(response => {
          if (response.data.result == "ok") {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          }
        });
    },
    resetForm() {
      this.form = {
        province: "",
        city: "",
        area: "",
        address: "",
        userName: "",
        contact: '',
        phone: '',
        schoolName: '',
        status: ''
      };
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.$API.school.schoolAdd(this.form).then(Response => {
            if (Response.data.result == "ok") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getList();
              this.closeDL();
              this.isdisabled = false
            }
          }).catch(()=>{
          this.isdisabled = false
          })
        }
      });
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.form={
        province: row.province,
        city: row.city,
        area: row.area,
        address: row.address,
        userName: row.userName,
        contact: row.contact,
        phone: row.phone,
        schoolName: row.schoolName,
        status: row.status,
        id:row.id
      }
    },
    payCost(row){
        this.dialogFormVisible2 = true;
        this.$API.school.renewalById(row.id).then((res)=>{
          this.payform = res.data.object
        })
    },
    changeProvince(data) {
      this.form.province = data.value;
    },
    changeCity(data) {
      this.form.city = data.value;
    },
    changeArea(data) {
      this.form.area = data.value;
    },
    handleBack() {
      this.getList();
    },
    savePay(){
      this.$refs["dataForm2"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.$API.school.renewalSave(this.payform).then(Response => {
            if (Response.data.result == "ok") {
              this.$message({
                message: "缴费成功，请在缴费管理查看缴费详情",
                type: "success"
              });
              this.getList();
              this.closeDL2();
              this.isdisabled = false
            }
          }).catch(()=>{
            this.$message({
                message: "缴费失败，请重新尝试",
                type: "error"
              });
          this.isdisabled = false
          })
        }
      });
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
.resetBox {
  display: flex;
  align-items: center;
  span {
    width: 150px;
  }
  input {
    margin-left: 8px;
    width: 80%;
  }
}
.name-wrapper{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
