<template>
    <div class="app-container">
        <div class="filter-container">
            <span style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;">搜索大房东名称：</span>
            <el-input v-model="listQuery.name" placeholder="输入大房东名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="search();" />
            <el-button class="filter-item" type="primary" @click="search();">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                添加大房东
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;">
            <el-table-column label="大房东名称" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机号" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="60" align="center">
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
                    <el-button type="success" size="mini" @click="jump(row.id)">
                        套房列表
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

        <el-dialog center :title="dialogStatus==='create'?'添加大房东':'编辑大房东'" :visible.sync="dialogFormVisible"
            :before-close="closeDL">
            <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="大房东名称：" prop="name">
                    <el-input v-model="form.name" class="max-w300" placeholder="输入大房东名称" />
                </el-form-item>
                <el-form-item label="电话号码：" prop="phone">
                    <el-input type="number" v-model.number="form.phone" class="max-w300" placeholder="输入电话号码" />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">启用</el-radio>
                        <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
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
        <el-dialog center title="大房东详情" :visible.sync="detailVisible"
            :before-close="closeDetail">
            <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="大房东：" >
                    <label v-text="detail.name"></label>
                </el-form-item>
                <el-form-item label="手机号：" >
                    <label v-text="detail.phone"></label>
                </el-form-item>
                <el-form-item label="套房状态：" >
                    <label v-text="detail.status==0?'启用':'禁用'"></label>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { bigFDList,bigFDAdd, bigFDDetail,bigFDDel} from "@/api/haowen";

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
                phone: "",
                name: "",
                status: 0,
                id: ""
            },
            dialogFormVisible: false,
            dialogStatus: "",

            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入大房东名称",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur"
                    }
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
            //获取大房东列表
            this.listLoading = true;
            bigFDList(this.listQuery).then(ret => {
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
        delData: function() {
            //删除
            this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    bigFDList(this.listQuery).then(ret => {
                        console.log(JSON.stringify(ret));
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
                phone: "",
                name: "",
                status: 0,
                id: ""
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
                    bigFDAdd(this.form).then(ret => {
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
            bigFDDetail(row.id).then(ret => {
                console.log(JSON.stringify(ret));
                if (ret.data.result === "ok") {
                    this.form = {
                        phone: ret.data.object.bigLandlord.phone,
                        name: ret.data.object.bigLandlord.name,
                        status: ret.data.object.bigLandlord.status,
                        id: ret.data.object.bigLandlord.id
                    };
                    this.listLoading2 = false;
                    // Just to simulate the time of the request
                } else {
                    this.$message({
                        message: ret.data.errorMsg,
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
                    bigFDAdd(this.form).then(ret => {
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
            this.detailVisible = true;              
            bigFDDetail(id).then(ret => {
                console.log(JSON.stringify(ret));
                if (ret.data.result === "ok") {
                    this.detailVisible=true;
                    this.detail = ret.data.object.bigLandlord;
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

        },
        jump:function(id){//跳转到套房列表
            this.$router.push({
                name:'areaList',
                query: {
                    id:id
                }
            })
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
