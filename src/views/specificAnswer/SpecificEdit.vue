<template>
    <div class="app-container">
        <h3>基础信息</h3>
        <el-form v-loading="listLoading" ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="80px">
        <div class="formBox">
                <div class="dialogBox">
                    <el-form-item label="选择学科：" label-width="95px" prop="subjectId">
                        <el-select @change='selectSubject' v-model="form.subjectId" placeholder="请选择学科">
                            <el-option
                            v-for="item in subjectList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择年级：" label-width="95px" prop="gradeId">
                    <el-select :disabled="subAfter" @change='selectGrade' v-model="form.gradeId" placeholder="请选择年级">
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
                    <el-form-item label="答题名称：" prop="name" style="width:100%;" label-width="95px">
                    <el-input v-model="form.name" placeholder="输入答题名称" />
                    </el-form-item>
                </div>
                <div class="dialogBox">
                    <el-form-item label="选择班级：" prop="classIds" style="width:100%;" label-width="95px">
                     <el-select multiple :disabled="gradeAfter" v-model="form.classIds" placeholder="选择班级（可多选）">
                            <el-option
                            v-for="item in classList"
                            :key="item.id"
                            :label="item.className"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialogBox">
                    <el-form-item label="状态：" label-width="95px" prop="status">
                        <el-select v-model="form.status" placeholder="选择状态">
                            <el-option
                            v-for="item in status"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否上传答题解析：" label-width="150px" prop="ifPictures">
                        <el-select v-model="form.ifPictures">
                        <el-option label="是" :value="0"></el-option>
                        <el-option label="否" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialogBox" v-show="form.status === 0?false:true">
                    <el-form-item  label="发布时间：" label-width="95px" :prop="form.status === 1?'releaseTime':''">
                        <el-date-picker
                           :disabled="form.status === 2?true:false"
                            v-model="form.releaseTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="日历">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止时间：" label-width="95px" :prop="form.status!==0?'endTime':''">
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="日历">
                        </el-date-picker>
                    </el-form-item>
                </div>
        </div>
        <h3>习题信息 
            <el-button type="primary" @click="addStudy">
            添加习题
            </el-button>
        </h3>
        <div>
        <el-form-item>
            <el-table
            v-loading="listLoading2"
            ref='roleInfo'
            :key="tableKey"
            :data="studyList"
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
                <span>{{ row.content }}</span>
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
                    <el-button type="primary" size="mini" @click="delQuestion(row)">删除</el-button>
                </div>
                </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        </div>
      </el-form>
        
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isdisabled" @click="goBack">
          返回
        </el-button>
        <el-button :disabled="isdisabled" type="primary" @click="saveClass">
          保存
        </el-button>
        
      </div>

      <el-dialog center title="选择习题" 
        :visible.sync="dialogFormVisible" 
        :before-close="closeDL">
        <div class="formBox2">
            <div class="filter-container">
                <div class="inputs">
                    <span
                    style="display: inline-block;
                    vertical-align: top;
                    padding-top: 10px;"
                >搜索题：</span>
                <el-select :disabled="true" class="filter-item filter-inputs" v-model="listQuery.subjectId" 
                 placeholder="选择学科">
                        <el-option
                        v-for="item in subjectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item filter-inputs" v-model="listQuery.gradeId" placeholder="选择年级">
                        <el-option
                        v-for="item in gradeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                <el-input
                    v-model="listQuery.keyword"
                    placeholder="输入简称、题内容"
                    class="filter-item filter-inputs"
                    @keyup.enter.native="handleFilter"
                />
                <el-input
                    v-model="listQuery.creatorName"
                    placeholder="输入出题人"
                    class="filter-item filter-inputs"
                    @keyup.enter.native="handleFilter"
                />
                <el-select style="width:100px;!important" class="filter-item filter-inputs" v-model="listQuery.star" placeholder="难易度">
                        <el-option
                        v-for="item in starList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="btns">
                    <el-button
                        class="filter-item"
                        type="primary"
                        @click="handleFilter"
                    >搜索</el-button>
                    <el-button
                        class="filter-item"
                        style="margin-left: 10px;"
                        type="primary"
                        @click="handleConfirm"
                    >确认选择</el-button>
                </div>
            </div>
            <div class="formstable">
                <el-table
                    v-loading="listLoading3"
                    ref='roleInfo'
                    :key="tableKey2"
                    :data="questionList2"
                    @select-all = "selectAll"
                    @selection-change='selectChecked2'
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
                    <el-table-column label="题编码" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.questionBankCode }}</span>
                    </template>
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
                    <el-table-column label="难易度" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.star }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column label="出题人" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.creatorName }}</span>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination
                v-show="total2>0"
                :total="total2"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getQuestionList"
                />
        </div>
    </el-dialog>
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
            tableKey2:0,
            total2:0,
            selectQuestion:[],
            listLoading:false,
            listLoading2:false,
            listLoading3:false,
            dialogFormVisible:false,
            isdisabled:false,
            subAfter:true,
            gradeAfter:true,
            studyList:[],
            questionList2:[],
            subjectList:[],
            gradeList:[],
            classList:[],
            starList: [
                { id: 1, name: "1星" },
                { id: 2, name: "2星" },
                { id: 3, name: "3星" },
                { id: 4, name: "4星" },
                { id: 5, name: "5星" }
            ],
            status:[{id:0,name:'保存草稿'},{id:1,name:'定时发布'},{id:2,name:'直接发布'}],
            listQuery: {
                page: 1,
                limit: 20,
                subjectId: '',
                gradeId:'',
                keyword:'',
                star:'',
                creatorName:'',
                knowledgeId:''
            },
            form:{
                endTime:'',
                classIds:[],
                gradeId:'',
                ifPictures:'',
                name:'',
                questionIds:[],
                releaseTime:'',
                status:'',
                subjectId:''
            },
            rules: {
                subjectId: [{ required: true, message: "请选择学科", trigger: "change" }],
                gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
                name: [{ required: true, message: "请输入答题名称", trigger: "blur" }],
                ifPictures: [{ required: true, message: "请选择是否上传答题解析", trigger: "change" }], 
                releaseTime: [{ required: true, message: "请选择发布时间", trigger: "change" }],
                endTime: [{ required: true, message: "请选择截止时间", trigger: "change" }],
                status: [{ required: true, message: "请选择状态", trigger: "change" }],
                classIds: [{ required: true, message: "请选择班级", trigger: "blur,change" }],

            }
        }
    },
    created(){
        this.listLoading=true
        this.$API.specific.specialEdit(this.$route.query.id).then((res)=>{
            this.form = {
                ...res.data.object,
                questionIds:[]
            }
            this.studyList = res.data.object.questionBanks
            this.studyList.forEach((item)=>{
                item.star = this.starList[item.star-1].name
            })
            this.$API.school.getGradeBySubject(res.data.object.subjectId).then((res)=>{
                this.subAfter = false
                this.gradeList = res.data.object
            })
            this.$API.school.getClassBytGrade(res.data.object.gradeId).then((res)=>{
                this.gradeAfter = false
                this.classList = res.data.object
                this.listLoading = false
            })
        })
        this.$API.school.getSubByStatus().then((res)=>{
            this.subjectList = res.data.object
        })
        
    },
    mounted(){
        this.$refs.dataForm.clearValidate()
    },
    methods:{
        saveClass(){
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    if(this.form.status === 0){
                        this.form.releaseTime = ''
                        this.form.endTime = ''
                    }else if(this.form.status === 2){
                        this.form.releaseTime = ''
                    }
                    if(this.studyList.length == 0){
                        if(this.form.status !== 0){
                            this.$message({
                                message:"习题个数不能为0",
                                type:'warning'
                            })
                            return
                        }else{
                            this.form.questionIds=[]
                        }
                    }else{
                        this.studyList.forEach((item)=>{
                            this.form.questionIds.push(item.id)
                        })
                    }
                this.isdisabled = true
                
                this.$API.specific.specialSave({
                    ...this.form
                }).then(Response => {
                    if (Response.data.result === 'ok') {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                    this.restForm()
                    this.$router.push({path:'specificanswer'})
                    this.isdisabled = false
                    } else {
                    this.$message({
                        message: Response.data.errorMsg,
                        type: 'error'
                    })
                    this.isdisabled = false
                    this.restForm()
                    }
                })
                }
            })
        },
        goBack(){
            this.$router.go(-1)
        },
        restForm(){
            this.form = {
               endTime:'',
                classIds:[],
                gradeId:'',
                ifPictures:'',
                name:'',
                questionIds:[],
                releaseTime:'',
                status:'',
                subjectId:''
            }
        },
        //添加习题
        addStudy(){
            if(this.form.subjectId === ''){
                this.$message({
                    message:'请先选择学科',
                    type:'warning'
                })
            }else{
                this.listQuery.subjectId = this.form.subjectId
                if(this.gradeList.length != 0){
                    this.listQuery.gradeId = this.gradeList[0].id
                }
                this.dialogFormVisible = true
                this.getQuestionList()
            }
            
        },
        //删除已选习题
        delQuestion(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.studyList=this.studyList.filter((item)=>{
                        return item.id !=row.id
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {});
        },
        selectChecked(){},
        selectChecked2(val){
            this.selectQuestion = val
        },
        selectAll(val){
            this.selectQuestion = val
        },
        handleConfirm(){
            window.localStorage.setItem('questionList',JSON.stringify(this.selectQuestion))
            this.$message({
                message:'操作成功',
                type:'success'
            })
            this.selectQuestion.forEach((item)=>{
                if(this.studyList.length == 0){
                    this.studyList.push(item)
                }else{
                    var flag = this.studyList.every((i)=>{
                        return item.id!=i.id
                    })
                    if(flag == true){
                        this.studyList.push(item)
                    }
                }
                
            })
            this.closeDL()
        },
        closeDL(){
            this.dialogFormVisible = false
            this.listQuery={
                page: 1,
                limit: 20,
                subjectId: '',
                gradeId:'',
                keyword:'',
                star:'',
                creatorName:'',
                knowledgeId:''
            }
             window.localStorage.removeItem('questionList')
        },
        selectSubject(data){
            this.$API.school.getGradeBySubject(data).then((res)=>{
                this.subAfter = false
                this.gradeList = res.data.object
            })
        },
        selectGrade(data){
            this.$API.school.getClassBytGrade(data).then((res)=>{
                this.gradeAfter = false
                this.classList = res.data.object
            })
        },
        getQuestionList(){
            this.$API.question.questionList({...this.listQuery}).then((res)=>{
                this.questionList2 = res.data.object.list
                this.total2 = res.data.object.total
                this.questionList2.forEach((item)=>{
                    item.star = this.starList[item.star-1].name
                })
            })
        },
        handleFilter(){
            this.getQuestionList()
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