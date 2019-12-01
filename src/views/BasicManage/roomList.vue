<template>
    <div class="app-container">
        <div class="filter-container">
            <span style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;">搜索小房间名称：</span>
            <el-input v-model="listQuery.name" placeholder="输入小房间名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="search();" />
            <el-button class="filter-item" type="primary" @click="search();">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                添加小房间
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;">
            <el-table-column label="序号" type="index" align="center"></el-table-column>
            <el-table-column label="套房" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.areaId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="租客人数" min-width="40" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.tenantNember	 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否空房" min-width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isNull}}</span>
                </template>
            </el-table-column>
            <el-table-column label="小房间状态" min-width="60" align="center">
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

        <el-dialog center :title="dialogStatus==='create'?'添加小房间':'编辑小房间'" :visible.sync="dialogFormVisible"
            :before-close="closeDL">
            <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="套房：" prop="areaId">
                    <el-input v-model="form.areaId" class="max-w300" placeholder="输入套房" />
                </el-form-item>
                <el-form-item label="租客人数：" prop="tenantNember">
                    <el-input v-model="form.tenantNember" class="max-w300" placeholder="输入租客人数" />
                </el-form-item>
                <el-form-item label="是否是空房：" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">不是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择类型：" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option label="主卧" value="主卧"></el-option>
                        <el-option label="大次卧" value="大次卧"></el-option>
                        <el-option label="小次卧" value="小次卧"></el-option>
                        <el-option label="大隔断" value="大隔断"></el-option>
                        <el-option label="小隔断" value="小隔断"></el-option>
                        <el-option label="黑房间" value="黑房间"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
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
        <el-dialog center title="小房间详情" :visible.sync="detailVisible" :before-close="closeDetail">
            <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
                label-position="right" label-width="120px">
                <el-form-item label="套房：">
                    <label v-text="detail.areaId"></label>
                </el-form-item>
                <el-form-item label="小房间类型：">
                    <label v-text="detail.type"></label>
                </el-form-item>
                <el-form-item label="租客人数：">
                    <label v-text="detail.tenantNember"></label>
                </el-form-item>
                <el-form-item label="是否是空房：">
                    <label v-text="detail.isNull==0?'是':'不是'"></label>
                </el-form-item>
                <el-form-item label="小房间状态：">
                    <label v-text="detail.status==0?'启用':'禁用'"></label>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { roomList, roomAdd, roomDetail, roomDel } from "@/api/haowen";

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
                areaId: "",
                isNull: 0,
                tenantNember: 0,
                type: "",
                id: "",
                status: 0
            },
            dialogFormVisible: false,
            dialogStatus: "",

            rules: {
                areaId: [
                    {
                        required: true,
                        message: "请选择套房",
                        trigger: "blur"
                    }
                ],
                isNull: [
                    {
                        required: true,
                        message: "是否是空房",
                        trigger: "blur"
                    }
                ],
                tenantNember: [
                    {
                        required: true,
                        message: "请填写租客人数",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择房间类型",
                        trigger: "blur"
                    }
                ],
                status: [
                    { required: true, message: "请选择状态", trigger: "blur" }
                ]
            },
            downloadLoading: false,
            detailVisible: false,
            detail: ""
        };
    },
    methods: {
        getList: function() {
            //获取小房间列表
            this.listLoading = true;
            roomList(this.listQuery).then(ret => {
                this.listLoading = false;
                // console.log(JSON.stringify(ret));
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
            }).then(() => {
                roomDel(id).then(ret => {
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
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        resetTemp() {
            //重置表单
            this.form = {
                areaId: "",
                isNull: 0,
                tenantNember: 0,
                type: "",
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
                    roomAdd(this.form).then(ret => {
                        // console.log(JSON.stringify(ret));
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
            roomDetail(row.id).then(res => {
                this.listLoading2 = false;
                // console.log(JSON.stringify(res));
                if (res.data.result === "ok") {
                    this.form = {
                        areaId: res.data.object.room.areaId,
                        isNull: res.data.object.room.isNull,
                        tenantNember: res.data.object.room.tenantNember,
                        type: res.data.object.room.type,
                        id: res.data.object.room.id,
                        status: res.data.object.room.status
                    };
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
                    roomAdd(this.form).then(ret => {
                        // console.log(JSON.stringify(ret));
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
        getDetail: function(id) {
            roomDetail(id).then(ret => {
                // console.log(JSON.stringify(ret));
                if (ret.data.result === "ok") {
                    this.detailVisible = true;
                    this.detail = ret.data.object.room;
                    // Just to simulate the time of the request
                } else {
                    this.$message({
                        message: ret.data.errorMsg,
                        type: "error"
                    });
                }
            });
        },
        closeDetail: function() {
            this.detailVisible = false;
        },
        search: function() {
            //搜索
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
