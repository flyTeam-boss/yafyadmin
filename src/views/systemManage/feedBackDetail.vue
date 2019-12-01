<template>
  <div class="app-container" v-loading="listLoading">
    <div class="feedBackInfo" >
      <h3>基础信息</h3>
      <div class="infos">
        <span>反馈标题：</span>
        <p>{{form.title}}</p>
      </div>
      <div class="infos contents">
        <span>反馈内容：</span>
        <p>{{form.content}}</p>
      </div>
      <div class="infos">
        <span>反馈人：</span>
        <p>{{form.userName}}</p>
      </div>
      <div class="infos">
        <span>反馈时间：</span>
        <p>{{form.createTime}}</p>
      </div>
      <div class="infos">
        <span>所属学校：</span>
        <p>{{form.schoolName}}</p>
      </div>
      <div class="attachment" v-if="form.annex!=''?true:false">
        <h3>反馈附件</h3>
        <div class="infos">
          <p>{{form.annex}}</p>
        </div>
      </div>
    </div>
    <div class="processing">
        <h3>处理</h3>
        <div class="infos">
            <span>处理状态：</span>
            <el-select class="filter-item" v-model="form.status" placeholder="请选择状态">
                <el-option v-for="(item,index) in selectStatus" :key="item" :label="item" :value="index">
                <span style="float: left">{{ item }}</span>
                </el-option>
            </el-select>
        </div>
        <div class="infos methods">
            <span>处理方式：</span>
            <el-input type="textarea" class="textarea"  v-model="form.actionContent"/>
             <!-- <Tinymce ref="editor" v-model="form.content" :height="400" /> -->
        </div>
    </div>
    <div class="footer">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
   name: "UserAdmin",
  components: {Tinymce},
  data() {
    return {
      selectStatus: ["待处理", "挂起", "已处理"],
      statusValue: "",
      tableKey: 0,
      list: null,
      form: {
          id: '',
          types: '',
          appType:'',
          title: '',
          userId: '',
          schoolName: '',
          annex:'' ,
          status: '',
          creatorId: '',
          creator:'' ,
          createTime: '',
          updateTime: '',
          userName: '',
          content: '',
          actionContent: ''
      },
      total: 0,
      listLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$API.system.feedbackDetail(this.$route.query.id).then((res)=>{
        this.form = res.data.object
        this.listLoading = false
      })
    },
    goBack(){
        this.$router.go(-1)
    },
    save(){
      this.listLoading = true
      this.$API.system.updateById({...this.form}).then((res)=>{
        if(res.data.result =='ok'){
          this.listLoading = false
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.$router.push({
            path:"feedback"
          })
        }
      })
    }
  }
};
</script>
<style lang="scss">
h3{
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}
.infos{
    display: flex;
    align-items: center;
    margin-left: 20px;
    p{
      max-width: 80%;
      word-wrap: break-word;
    }
}
.contents{
  align-items: flex-start;
  span{
    margin-top: 16px;
  }
}
.methods{
    align-items: flex-start;
    margin-top: 10px;
    .textarea{
      max-width: 500px;
    }
}
.footer{
    margin: 50px 0;
    // display: flex;
    text-align: center;
}
</style>
