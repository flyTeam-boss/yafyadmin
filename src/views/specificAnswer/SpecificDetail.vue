<template>
    <div class="app-container">
        <h3>基础信息</h3>
        <el-form v-loading="listLoading" ref="dataForm" :model="form" label-position="right" label-width="80px">
        <div class="formBox">
                <div class="dialogBox">
                    <el-form-item label="选择学科：" label-width="95px" prop="subjectId">
                        <span>{{form.subject}}</span>
                    </el-form-item>
                    <el-form-item label="选择年级：" label-width="95px" prop="gradeId">
                    <span>{{form.grade}}</span>
                    </el-form-item>
                </div>
                <div class="dialogBox">
                    <el-form-item label="答题名称：" prop="name" style="width:100%;" label-width="95px">
                    <span>{{form.name}}</span>
                    </el-form-item>
                </div>
                <div class="dialogBox">
                    <el-form-item label="选择班级：" prop="classIds" style="width:100%;" label-width="95px">
                     <span>{{form.classNames}}</span>
                    </el-form-item>
                </div>
                <div class="dialogBox">
                    <el-form-item label="状态：" label-width="95px" prop="status">
                        <span>{{form.status}}</span>
                    </el-form-item>
                    <el-form-item label="是否上传答题解析：" label-width="150px" prop="ifPictures">
                        <span>{{form.ifPictures==0?'是':'否'}}</span>
                    </el-form-item>
                </div>
                <div class="dialogBox" v-show="form.status === 0?false:true">
                    <el-form-item  label="发布时间：" label-width="95px">
                        <span>{{form.releaseTime}}</span>
                    </el-form-item>
                    <el-form-item label="截止时间：" label-width="95px">
                        <span>{{form.endTime}}</span>
                    </el-form-item>
                </div>
        </div>
        <h3>习题信息 </h3>
        <div>
        <el-form-item>
            <el-table
            ref='roleInfo'
            :key="tableKey"
            :data="form.questionBanks"
            @selection-change='selectChecked'
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
            v-model="form.roleIds"
            type="selection"
            width="40">
          </el-table-column>
            <el-table-column type="index" label="序号" width="60" align="center">
            </el-table-column>
            <el-table-column label="题简称" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.abbr }}</span>
              </template>
            </el-table-column>
            <el-table-column label="题内容" min-width="100" align="center">
              <template slot-scope="{row}">
                    <span v-html="row.content"></span>
              </template>
            </el-table-column>
            <el-table-column label="难易程度" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.star }}</span>
              </template>
            </el-table-column>
            <el-table-column label="知识点" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.knowledges }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170" align="center">
                <template slot-scope="{row}">
                <div style="display:flex;">
                    <el-button type="primary" size="mini" @click="questionDetail(row)">详情</el-button>
                </div>
                </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="goBack">
          返回
        </el-button>
      </div>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
    name:'specificAdd',
    components: { Pagination },
    data(){
        return {
            tableKey:0,
            selectQuestion:'',
            listLoading:false,
            starList: [
                { id: 1, name: "1星" },
                { id: 2, name: "2星" },
                { id: 3, name: "3星" },
                { id: 4, name: "4星" },
                { id: 5, name: "5星" }
            ],
            status:[{id:0,name:'保存草稿'},{id:1,name:'定时发布'},{id:2,name:'开始'},{id:3,name:'结束'}],
            form:{
                endTime:'',
                classNames:'',
                gradeId:'',
                ifPictures:'',
                name:'',
                questionBanks:[],
                releaseTime:'',
                status:'',
                subjectId:''
            },
        }
    },
    created(){
        this.listLoading=true
        this.$API.specific.questiondetailPage(this.$route.query.id).then((res)=>{
            this.form=res.data.object
            this.form.status=this.status[res.data.object.status].name
            this.form.questionBanks.forEach((item)=>{
                item.star = this.starList[item.star-1].name
            })
            this.listLoading=false
        })
    },
    methods:{
        goBack(){
            this.$router.go(-1)
        },
        //删除已选习题
        delQuestion(row){
            
        },
        selectChecked(val){
            this.selectQuestion = val
        },
        selectAll(val){
            this.selectQuestion = val
        },
        questionDetail(row){
            this.$router.push({
                name:'questiondetail',
                query:{
                    id:row.id
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    h3{
        font-weight: normal;
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
    }
    .formBox{
        width: 70%;
    }
    .dialogBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dialog-footer{
        width: 60%;
        margin: 50px auto;
    }
    .el-select>.el-input {
        display: block;
        width: 220px;
    }
    .formBox2{
        width: 100%;
        .filter-container{
            display: flex;
            flex-direction: column;
            .inputs{
                display: flex;
                justify-content: space-around;
            }
        }     
        .el-select>.el-input {
            display: block;
            width: 130px;
        }
    }
    .filter-inputs{
        margin-left:5px;
        width: 100px !important;
    }
</style>