<template>
    <div class="app-container">
        <el-form class="logForm" v-loading="listLoading2" ref="dataForm" :rules="rules" :model="form"
            label-position="right" label-width="120px">
            <el-form-item label="大房东：" prop="bigLandlordId">
                <el-input v-model="form.bigLandlordId" class="max-w300" placeholder="输入大房东" />
            </el-form-item>
            <el-form-item label="小区名称：" prop="name">
                <el-input v-model="form.name" class="max-w300" placeholder="输入小区名称" />
            </el-form-item>
            <el-form-item label="幢：" prop="block">
                <el-input v-model="form.block" class="max-w300" placeholder="输入幢" />
            </el-form-item>
            <el-form-item label="单元：" prop="unit">
                <el-input v-model="form.unit" class="max-w300" placeholder="输入单元" />
            </el-form-item>
            <el-form-item label="门牌号：" prop="roomNumber">
                <el-input v-model="form.roomNumber" class="max-w300" placeholder="输入门牌号" />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="0">启用</el-radio>
                    <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="isdisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">
                保存
            </el-button>
            <el-button :disabled="isdisabled" @click="closeDL">
                取消
            </el-button>
        </div>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { areaAdd, areaDetail,  } from "@/api/haowen";

export default {
    name: "Grade",
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            dialogStatus:'',
            isdisabled:false,
            listLoading2:false,
            form: {
                bigLandlordId: this.$route.query.bigLandlordId,
                name: "",
                block: "",
                unit: "",
                roomNumber: "",
                id: "",
                status: 0
            },
        };
    },
    methods: {
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.isdisabled = true;
                    areaAdd(this.form).then(ret => {
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
        handleUpdate() {
            this.listLoading2 = true;
            areaDetail(this.$route.query.id).then(res => {
                this.listLoading2 = false;
                // console.log(JSON.stringify(res));
                if (res.data.result === "ok") {
                    this.form = {
                        bigLandlordId: res.data.object.area.bigLandlordId,
                        name: res.data.object.area.name,
                        block: res.data.object.area.block,
                        unit: res.data.object.area.unit,
                        roomNumber: res.data.object.area.roomNumber,
                        id: res.data.object.area.id,
                        status: res.data.object.area.status
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
                    areaAdd(this.form).then(ret => {
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
    },
    mounted() {
        if (this.$route.query.id) {//判断是否是编辑
            this.dialogStatus='create';
            this.handleUpdate();
        }else{
            this.dialogStatus='update';
        }
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
