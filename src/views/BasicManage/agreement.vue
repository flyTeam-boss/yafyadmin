<template>
    <div class="app-container">
        <div class="filter-container">
            <span style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;">搜索合同名称：</span>
            <el-input v-model="listQuery.name" placeholder="输入合同名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="search();" />
            <el-button class="filter-item" type="primary" @click="search();">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                添加合同
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;">
            <el-table-column label="序号" type="index" align="center"></el-table-column>
            <el-table-column label="电表度数" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.degree }}</span>
                </template>
            </el-table-column>
            <el-table-column label="押金" min-width="40" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deposit }}</span>
                </template>
            </el-table-column>
            <el-table-column label="合同开始时间" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.agreementStratTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="合同结束时间" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.agreementEndTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column>
            <el-table-column label="合同状态" min-width="60" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0 ">启用</span>
                    <span v-else>禁用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="120" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleUpdate(row)">
                        编辑
                    </el-button>
                    <el-button type="info" size="mini" @click="getDetail(row.id)">
                        详情
                    </el-button>
                    <!-- <el-button v-if="row.status =='0'" size="mini" type="danger" @click="handleModifyStatus(row,'1')">禁用
                    </el-button>
                    <el-button v-if="row.status=='1'" size="mini" type="info" @click="handleModifyStatus(row,'0')">启用
                    </el-button> -->
                    <el-button size="mini" type="danger" @click="delData(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />

        <el-dialog center :title="dialogStatus==='create'?'添加合同':'编辑合同'" :visible.sync="dialogFormVisible"
            :before-close="closeDL">
            <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="电表度数：" prop="degree">
                    <el-input v-model="form.degree" class="max-w300" placeholder="输入电表度数" />
                </el-form-item>
                <el-form-item label="押金：" prop="deposit">
                    <el-input v-model="form.deposit" class="max-w300" placeholder="输入押金" />
                </el-form-item>
                <el-form-item label="合同开始时间：" prop="agreementStratTime">
                    <el-date-picker v-model="form.agreementStratTime" value-format="yyyy-MM-dd" type="date" placeholder="选择合同开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合同结束时间：" prop="agreementEndTime">
                    <el-date-picker v-model="form.agreementEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择合同结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">有效</el-radio>
                        <el-radio :label="1">过期</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="form.remark" class="max-w300" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="isdisabled" type="primary"
                    @click="dialogStatus==='create'?createData():updateData()">
                    保存
                </el-button>
                <el-button :disabled="isdisabled" @click="closeDL">
                    取消
                </el-button>
            </div>
        </el-dialog>
        <el-dialog center title="合同详情" :visible.sync="detailVisible"
            :before-close="closeDetail">
            <el-form class="logForm"  ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="电表度数：" >
                    <label v-text="detail.degree"></label>
                </el-form-item>
                <el-form-item label="押金：" >
                    <label v-text="detail.deposit"></label>
                </el-form-item>
                <el-form-item label="合同开始时间：" >
                    <label v-text="detail.agreementStratTime"></label>
                </el-form-item>
                <el-form-item label="合同结束时间：" >
                    <label v-text="detail.agreementEndTime"></label>
                </el-form-item>
                <el-form-item label="合同状态：" >
                    <label v-text="detail.status==0?'有效':'过期'"></label>
                </el-form-item>
                <el-form-item label="备注：" >
                    <label v-text="detail.remark"></label>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { agreementList,agreementAdd, agreementDetail,agreementDel} from "@/api/haowen";

export default {
    name: "Grade",
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            list: [],
            total: 0,
            disciplineList: [],
            isdisabled: false,
            listLoading: false,
            listLoading2: false,
            listQuery: {
                page: 1,
                limit: 20,
                name: ""
            },
            form: {
                agreementEndTime: "",
                agreementStratTime: "",
                remark: "",
                degree: "",
                deposit: "",
                id: "",
                status: 0
            },
            dialogFormVisible: false,
            dialogStatus: "",

            rules: {
                agreementEndTime: [
                    {
                        required: true,
                        message: "请选择合同结束时间",
                        trigger: "blur"
                    }
                ],
                agreementStratTime: [
                    {
                        required: true,
                        message: "请选择合同开始时间",
                        trigger: "blur"
                    }
                ],
                degree: [
                    { required: true, message: "请填写电表读数", trigger: "blur" }
                ],
                deposit: [
                    { required: true, message: "请填写押金", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "请选择状态", trigger: "blur" }
                ]
            },
            downloadLoading: false,
            detailVisible:false,
            detail:''
        };
    },
    methods: {
        getList: function() {
            //获取合同列表
            this.listLoading = true;
            agreementList(this.listQuery).then(ret => {
                this.listLoading = false;
                console.log(JSON.stringify(ret));
                if (ret.data.result === "ok") {
                    this.list = ret.data.object.list;
                    this.total = ret.data.object.total;
                    // Just to simulate the time of the request
                } else {
                    this.$message({
                        message: ret.data.errorMsg,
                        type: "error"
                    });
                }
            });
        },
        delData: function(id) {
            //删除
            this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    agreementDel(id).then(ret => {
                        // console.log(JSON.stringify(ret));
                        if (ret.data.result === "ok") {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.listQuery.page = 1;
                            this.getList();
                            // Just to simulate the time of the request
                        } else {
                            this.$message({
                                message: ret.data.errorMsg,
                                type: "error"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        resetTemp() {
            //重置表单
            this.form = {
                agreementEndTime: "",
                agreementStratTime: "",
                remark: "",
                degree: "",
                deposit: "",
                id: "",
                status: 0
            };
        },
        handleCreate() {
            //新增按钮
            this.resetTemp();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
        },
        // 关闭蒙层
        closeDL() {
            this.dialogFormVisible = false;
            this.$refs.dataForm.clearValidate();
            this.resetTemp();
        },
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.isdisabled = true;                        
                    agreementAdd(this.form).then(ret => {
                        console.log(JSON.stringify(ret));
                        if (ret.data.result === "ok") {
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                            this.closeDL();
                            this.getList();
                            this.isdisabled = false;
                            // Just to simulate the time of the request
                        } else {
                            this.$message({
                                message: ret.data.errorMsg,
                                type: "error"
                            });
                        }
                    });
                }
            });
        },
        handleUpdate(row) {
            this.dialogFormVisible = true;
            this.listLoading2 = true;
            this.dialogStatus = "update";               
            agreementDetail(row.id).then(res => {
                console.log(JSON.stringify(res));
                if (res.data.result === "ok") {
                    this.form = {
                        agreementEndTime: res.data.object.agreement.agreementEndTime,
                        agreementStratTime: res.data.object.agreement.agreementStratTime,
                        remark: res.data.object.agreement.remark,
                        degree: res.data.object.agreement.degree,
                        deposit: res.data.object.agreement.deposit,
                        id: res.data.object.agreement.id,
                        status: res.data.object.agreement.status,
                    };
                    this.listLoading2 = false;
                    // Just to simulate the time of the request
                } else {
                    this.$message({
                        message: res.data.errorMsg,
                        type: "error"
                    });
                }
            });
        },
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.isdisabled = true;
                    console.log(this.form);             
                    agreementAdd(this.form).then(ret => {
                        console.log(JSON.stringify(ret));
                        if (ret.data.result === "ok") {
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                            this.closeDL();
                            this.getList();
                            this.isdisabled = false;
                            // Just to simulate the time of the request
                        } else {
                            this.$message({
                                message: ret.data.errorMsg,
                                type: "error"
                            });
                        }
                    });
                }
            });
        },
        getDetail:function(id){             
            agreementDetail(id).then(ret => {
                console.log(JSON.stringify(ret));
                if (ret.data.result === "ok") {
                    this.detailVisible=true;
                    this.detail = ret.data.object.agreement;
                    // Just to simulate the time of the request
                } else {
                    this.$message({
                        message: ret.data.errorMsg,
                        type: "error"
                    });
                }
            });
        },
        closeDetail:function(){
            this.detailVisible=false;
        },
        search:function(){//搜索

        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
.logForm {
    .el-select > .el-input {
        display: block;
        width: 300px;
    }
}
</style>
