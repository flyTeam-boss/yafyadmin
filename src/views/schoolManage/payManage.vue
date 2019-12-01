<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索学校名称：</span>
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
        @click="payCost"
      >添加缴费</el-button>
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
      <el-table-column label="ID" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费单号" min-width="140" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.orderId }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.orderId }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="缴费学校" min-width="140" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.schoolName }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.schoolName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="缴费前截止日期" min-width="120" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.beforeExpireDate }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.beforeExpireDate }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="缴费日期（月）" min-width="120" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.renewalDate }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.renewalDate }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="缴费金额" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费周期" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费后截止日期" min-width="120" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.afterExpireDate }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{ row.afterExpireDate }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="缴费操作人" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="80"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpDetail(row)">详情</el-button>
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
    <!-- 缴费详情 -->
    <el-dialog center title="缴费详情" :visible.sync="dialogFormVisible" :before-close="closeDL">
      <el-form
        v-loading="listLoading2"
        ref="dataForm"
        :model="form"
        label-position="right"
        label-width="70px"
      >
        <el-form-item label="缴费学校：" class="max-w300" prop="name" label-width="95px">
          <span >{{form.schoolName}}</span>
        </el-form-item>
        <el-form-item label="缴费时长：" class="max-w300" prop="name" label-width="95px">
          <span>{{form.duration}}个月</span>
        </el-form-item>
        <el-form-item label="到期时间：" class="max-w300" prop="name" label-width="95px">
          <span>{{form.afterExpireDate}}</span>
        </el-form-item>
        <el-form-item label="金额：" class="max-w300" prop="name" label-width="95px">
          <span>{{form.price}}元</span>
        </el-form-item>
        <el-form-item class="max-w300" label="备注：" prop="IDcard" label-width="95px">
          <span>{{form.remark=='null'?form.remark:"无"}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加缴费 -->
    <el-dialog center title="添加缴费" :visible.sync="dialogFormVisible2" :before-close="closeDL2">
      <el-form
      v-loading="listLoading3"
        ref="dataForm2"
        :rules="rules"
        :model="payform"
        label-position="right"
        label-width="70px"
      >
        <el-form-item label="缴费学校：" class="max-w300" prop="schoolId" label-width="95px">
          <el-select v-model="payform.schoolId" placeholder="请选择">
            <el-option v-for="item in paySchool" :label="item.schoolName" :key="item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费时长：" class="max-w300" prop="duration" label-width="95px">
          <el-select v-model="payform.duration" placeholder="请选择">
            <el-option v-for="item in 12" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间：" class="max-w300"  label-width="95px">
          <span>{{payform.afterExpireDate}}</span>
        </el-form-item>
        <el-form-item label="金额：" class="max-w300" prop="price" label-width="95px">
          <el-input type="number" v-model.number="payform.price" placeholder="输入金额" />
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Role",
  components: { Pagination },
  data() {
    var priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    var validatePrice = (rule, value, callback) => {
        if (!priceReg.test(value)) {
          callback(new Error('请输入数字型的金额'))
        } else {
          callback()
        }
    }
    return {
      paySchool:[],
      isdisabled:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listLoading2:true,
      listLoading3:false,
      listQuery: {
        page: 1,
        limit: 20,
        name: ""
      },
      form:{
        afterExpireDate:'',
        duration: null,
        price: null,
        remark: '',
        schoolId: null,
        schoolName: ''
      },
      payform: {
        afterExpireDate: '',
        duration: 1,//时长
        price: 0,//续费金额
        remark: '',//备注
        schoolId: '',
        schoolName: ''
      },
      data: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      rules: {
        duration: [{ required: true, message: "请选择续费时长", trigger: "blur" }],
        schoolId: [{ required: true, message: "请选择学校", trigger: "change" }],
        price:[{ required: true, validator:validatePrice, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getSchool()
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$API.school
        .renewalList({...this.listQuery}).then(response => {
          this.list = response.data.object.list;
          this.total = response.data.object.total;
          this.listLoading = false;
        });
    },
    getSchool(){
      this.$API.school
        .renewalSchoolData().then(response => {
          this.paySchool = response.data.object;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    jumpDetail(row) {
      this.dialogFormVisible = true;
      this.listLoading2 = true
      this.$API.school.findOneData(row.id).then((res)=>{
        this.form = res.data.object
        this.listLoading2 = false
      })
    },
    payCost() {
      this.resetForm()
      this.dialogFormVisible2 = true;
    },
    closeDL() {
      this.dialogFormVisible = false;
      this.form={
        afterExpireDate:'',
        duration: null,
        price: null,
        remark: '',
        schoolId: null,
        schoolName: ''
      }
    },
    resetForm(){
      this.payform = {
        afterExpireDate: '',
        duration: 1,//时长
        price: 0,//续费金额
        remark: '',//备注
        schoolId: '',
        schoolName: ''
      };
    },
    closeDL2() {
      this.resetForm()
      this.dialogFormVisible2 = false;
      this.$refs.dataForm2.clearValidate();
    },
    savePay(){
      this.$refs["dataForm2"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.listLoading3 = true
          this.$API.school.renewalSave(this.payform).then(Response => {
            if (Response.data.result == "ok") {
              this.$message({
                message: "缴费成功",
                type: "success"
              });
              this.getList();
              this.closeDL2();
              this.isdisabled = false
              this.listLoading3 = false
            }
          }).catch(()=>{
            this.$message({
                message: "缴费失败，请重新尝试",
                type: "error"
              });
              this.listLoading3 = false
          this.isdisabled = false
          })
        }
      });
    }
  }
};
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
  height: 300px;
  border-radius: 4px;
  min-height: 36px;
}
.name-wrapper{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
