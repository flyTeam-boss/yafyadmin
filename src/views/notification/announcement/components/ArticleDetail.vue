<template>
  <div class="createPost-container">
    <el-form ref="postForm" :rules="rules" :model="postForm" class="form-container">
      <el-row v-if="$route.query.type === '2'" style="padding: 0 45px 0 50px;position: relative;top:30px;">
        <el-col :span="24">
          <el-form-item prop="classNoticeSort">
            <el-radio-group v-model="postForm.classNoticeSort">
              <el-radio label="0">作业通知</el-radio>
              <el-radio label="1">其他通知</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row style="padding: 0 45px 0 50px;">
        <el-col :span="24">
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="padding: 0 45px 0 50px;">
        <el-col :span="24">
          <el-form-item style="margin-bottom: 40px;" prop="summary" label-width="55px" label="摘要:">
            <el-input
              v-model="postForm.summary"
              :rows="1"
              type="textarea"
              class="article-textarea"
              autosize
              placeholder="请输入摘要"
            />
            <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <div class="createPost-main-container">
            <el-form-item style="margin-bottom: 30px;">
              <Tinymce ref="editor" v-model="postForm.content" :height="400" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12" :offset="2">
          <div class="editor-content" v-html="postForm.content" />
        </el-col>
      </el-row>

      <el-row style="padding: 0 45px 0 50px;">
        <el-col :span="24">
          <el-form-item style="margin-bottom: 30px;">
            <el-form-item label="添加附件">
              <el-upload
                :headers="importHeaders"
                class="upload-demo"
                :action="baseUrl+`commons/upload/file?number=${$route.query.type}`"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                accept=".doc,.docx,.xlsx,.xls,.pdf"
                :before-upload="beforeAvatarUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row style="padding: 0 45px 0 50px;">
        <el-col v-if="$route.query.type == 0" :span="12">
          <el-form-item label="发布学校">
            <el-cascader
              v-model="valModel"
              :options="data"
              collapse-tags
              children-key="schoolList"
              :props="{ multiple: true,label: 'name',value: 'id',children: 'schoolList' }"
              placeholder="选择学校"
              @change="ispChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="$route.query.type == 1" style="padding: 0 45px 0 50px;">
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="机构">
            <el-cascader
              v-model="valModel1"
              collapse-tags
              :options="data1"
              :props="{ multiple: true,label: 'name',value: 'id',children: 'userList' }"
              placeholder="选择机构"
              @change="ispChange"
            />
          </el-form-item>
        </el-col>
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="职务">
            <el-cascader
              v-model="valModel2"
              collapse-tags
              :options="data2"
              :props="{ multiple: true,label: 'name',value: 'id',children: 'teacherNoticeResponses' }"
              placeholder="选择职务"
              @change="ispChange1"
            />
          </el-form-item>
        </el-col>
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="分组">
            <el-cascader
              v-model="valModel3"
              collapse-tags
              :options="data3"
              :props="{ multiple: true,label: 'name',value: 'id',children: 'userList' }"
              placeholder="选择分组"
              @change="ispChange2"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="$route.query.type == 2" style="padding: 0 45px 0 50px;">
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="家长">
            <el-cascader
              v-model="valModel1"
              :options="data1"
              collapse-tags
              :props="{ multiple: true,label: 'name',value: 'id',children: 'parentList' }"
              placeholder="选择家长"
              @change="ispChange"
            />
          </el-form-item>
        </el-col>
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="老师">
            <el-cascader
              v-model="valModel2"
              :options="data2"
              collapse-tags
              :props="{ multiple: true,label: 'name',value: 'id',children: 'teacherList' }"
              placeholder="选择老师"
              @change="ispChange1"
            />
          </el-form-item>
        </el-col>
        <el-col style="padding-right:10%" :span="8">
          <el-form-item label="分组">
            <el-cascader
              v-model="valModel3"
              collapse-tags
              :options="data3"
              :props="{ multiple: true,label: 'name',value: 'id',children: 'userList' }"
              placeholder="选择分组"
              @change="ispChange2"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="btn-foot">
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm(1)"
        >发布通知</el-button>
        <el-button :loading="loadingSave" type="info" @click="submitForm(0)">保存草稿</el-button>
        <el-button type="danger" @click="back">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import { fetchArticle } from '@/api/article'
import { getToken } from '@/utils/auth'

const defaultForm = {
  number: '',
  // cover: '', // 上传的资源
  noticeUserList: [], // 筛选的人物
  status: '',
  title: '', // 文章题目
  content: '', // 文章内容
  summary: '', // 文章摘要
  type: '', // 文档类型
  schoolNoticeDrafts: [],
  noticeAnnexes: [], // 上传文件信息
  classNoticeDrafts: [], // 班级推送的角色
  classNoticeSort: '0'   // 班级发布通知的类型
  // id: undefined,
}

export default {
  name: 'ArticleDetail',
  components: {
    Tinymce,
    MDinput
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      importHeaders: { Authorization: 'Bearer ' + getToken() },
      baseUrl: process.env.VUE_APP_BASE_API,
      data: [],
      valModel: [],
      // 机构
      data1: [],
      userList1: [],
      check1: [],
      valModel1: [],
      // 职务
      data2: [],
      userList2: [],
      check2: [],
      valModel2: [],
      // 分组
      data3: [],
      userList3: [],
      check3: [],
      valModel3: [],
      fileList: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      loadingSave: false,
      userListOptions: [],
      tempRoute: {},
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.summary.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    this.getSchool()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    this.postForm.noticeAnnexes = []
  },
  methods: {
    back() {
      if (this.$route.query.type === '0' && this.$route.query.edit !== '1') {
        this.$router.push('regionallevel')
      } else if (this.$route.query.type === '1' && this.$route.query.edit !== '1') {
        this.$router.push('schoollevel')
      } else if (this.$route.query.type === '2' && this.$route.query.edit !== '1') {
        this.$router.push('classlevel')
      } else if (this.$route.query.edit === '1') {
        this.$router.push('/notification/notificationdraft')
      }
    },
    getType(file) {
      var filename = file
      var index1 = filename.lastIndexOf('.')
      var index2 = filename.length
      var type = filename.substring(index1, index2)
      return type
    },
    beforeAvatarUpload(file) { // .doc,.docx,.xlsx,.,.pdf
      var filename = file.name
      const isDoc = this.getType(filename) === '.doc'
      const isDocx = this.getType(filename) === '.docx'
      const isXlsx = this.getType(filename) === '.xlsx'
      const isXls = this.getType(filename) === '.xls'
      const isPdf = this.getType(filename) === '.pdf'
      if (isDoc || isDocx || isXlsx || isXls || isPdf) {
        return isDoc || isDocx || isXlsx || isXls || isPdf
      } else {
        this.$message({
          type: 'error',
          message: '上传图片暂时只支持doc,docx,xlsx,xls,pdf格式'
        })
      }
      return isDoc || isDocx || isXlsx || isXls || isPdf
    },
    getSchool() {
      if (this.$route.query.edit === '1') {
        // 获取回显信息
        this.$API.school.noticeEdit({
          params: {
            noticeId: this.$route.query.id,
            editType: this.$route.query.type
          }
        }).then(Response => {
          if (this.$route.query.type === '0') {
            // 回显部分数据
            this.postForm = Response.data.object.noticeSchoolResponse
            // 已上传的文件信息
            var fileData = Response.data.object.noticeAnnexes
            // 选中的角色列表
            var checkUser = Response.data.object.noticeSchoolResponse.schoolNoticeDrafts
            // 获取多选选中的角色
            if (checkUser) {
              checkUser.map((item, i) => {
                this.valModel.push([item.parentId,item.schoolId])
              })
            }
            // 回显已上传文件
            this.postForm.noticeAnnexes = fileData // 需要上传的数据
            // 显示的数据
            var newFile = []
            fileData.map((item, i) => {
              newFile[i] = {}
              newFile[i].name = item.fileName
              newFile[i].url = item.url
            })
            this.fileList = newFile
          }
          if (this.$route.query.type === '1') {
            // 回显部分数据
            this.postForm = Response.data.object.noticeUserResponse
            // 已上传的文件信息
            var fileData1 = Response.data.object.noticeAnnexes
            // 选中的角色列表
            var checkUser1 = Response.data.object.noticeUserResponse.noticeUserList
            // 获取多选选中的角色
            if (checkUser1) {
              checkUser1.map((item, i) => {
                if(item.dataType === 1){
                  this.valModel1.push([item.parentId,item.userId])
                }
                if(item.dataType === 2){
                  this.valModel2.push([item.parentId,item.userId])
                }
                if(item.dataType === 3){
                  this.valModel3.push([item.parentId,item.userId])
                }
              })
            }
            // 回显已上传文件
            this.postForm.noticeAnnexes = fileData1 // 需要上传的数据
            // 显示的数据
            var newFile1 = []
            fileData1.map((item, i) => {
              newFile1[i] = {}
              newFile1[i].name = item.fileName
              newFile1[i].url = item.url
            })
            this.fileList = newFile1
          }
          if (this.$route.query.type === '2') {
            // 回显部分数据
            this.postForm = Response.data.object.noticeClassResponse
            this.postForm.classNoticeSort = JSON.stringify(this.postForm.classNoticeSort)
            // 已上传的文件信息
            var fileData2 = Response.data.object.noticeAnnexes
            // 选中的角色列表
            var checkUser2 = Response.data.object.noticeClassResponse.classNoticeDrafts
            // 获取多选选中的角色
            if (checkUser2) {
              checkUser2.map((item, i) => {
                if(item.dataType === 1){
                  this.valModel1.push([item.parentId,item.userId])
                }
                if(item.dataType === 2){
                  this.valModel2.push([item.parentId,item.userId])
                }
                if(item.dataType === 3){
                  this.valModel3.push([item.parentId,item.userId])
                }
              })
            }
            // 回显已上传文件
            this.postForm.noticeAnnexes = fileData2 // 需要上传的数据
            // 显示的数据
            var newFile2 = []
            fileData2.map((item, i) => {
              newFile2[i] = {}
              newFile2[i].name = item.fileName
              newFile2[i].url = item.url
            })
            this.fileList = newFile
          }
        })
        // 获取级联信息
        this.$API.school
          .noticeAdd({
            params: {
              sendType: this.$route.query.type
            }
          })
          .then(Response => {
            this.cascadeData(Response)
            // noticeCode编码
            this.postForm.number = Response.data.object.noticeCode
          })
      } else {
        this.$API.school
          .noticeAdd({
            params: {
              sendType: this.$route.query.type
            }
          })
          .then(Response => {
            this.cascadeData(Response)
            // noticeCode编码
            this.postForm.number = Response.data.object.noticeCode
          })
      }
    },
    // 获取级联渲染data
    cascadeData(Response) {
      // ------------区域级通知--------------
      if (this.$route.query.type === '0') {
        this.data = Response.data.object.administrations
      }
      // ------------校级通知--------------
      if (this.$route.query.type === '1') {
        // 机构
        this.data1 = Response.data.object.organUserResponses
        // 职务
        this.data2 = Response.data.object.schoolJobUserResponses
        // 分组
        this.data3 = Response.data.object.groupUserReponses
      }
      // ------------班级通知--------------
      if (this.$route.query.type === '2') {
        // 机构
        this.data1 = Response.data.object.classStuParentResponses
        // 职务
        this.data2 = Response.data.object.classTeacherResponses
        // 分组
        this.data3 = Response.data.object.groupUserReponses
      }
    },
    ispChange(values, items) {
      // 过滤成需要的人物数据传输格式
      var data = []
      if (this.$route.query.type === '0') {
        this.valModel.map((item, index) => {
          data[index] = {}
          data[index].schoolId = item[1]
          data[index].parentId = item[0]
        })
        this.postForm.schoolNoticeDrafts = data
      } else if (this.$route.query.type === '1') {
        this.valModel1.map((item, index) => {
          data[index] = {}
          data[index].userId = item[1]
          data[index].parentId = item[0]
          data[index].dataType = 1
          data[index].userType = 0
        })
        this.postForm.noticeUserList = data
      } else if (this.$route.query.type === '2') {
        this.valModel1.map((item, index) => {
          data[index] = {}
          data[index].userId = item[1]
          data[index].parentId = item[0]
          data[index].dataType = 1
          data[index].userType = 1
        })
        this.postForm.classNoticeDrafts = data
      }
    },
    ispChange1(values, items) {
      // 过滤成需要的人物数据传输格式
      var data = []
      if (this.$route.query.type === '2') {
        this.valModel2.map((item, index) => {
          data[index] = {}
          data[index].userId = item[1]
          data[index].parentId = item[0]
          data[index].dataType = 2
          data[index].userType = 0
        })
        this.userList1 = data
        return
      }
      this.valModel2.map((item, index) => {
        data[index] = {}
        data[index].userId = item[1]
        data[index].parentId = item[0]
        data[index].dataType = 2
        data[index].userType = 1
      })
      this.userList1 = data
    },
    ispChange2(values, items) {
      // 过滤成需要的人物数据传输格式
      var data = []
      this.valModel3.map((item, index) => {
        data[index] = {}
        data[index].userId = item[1]
        data[index].parentId = item[0]
        data[index].dataType = 3
        data[index].userType = 0
      })
      this.userList2 = data
    },
    // 图片上传成功的钩子
    handleAvatarSuccess(res, file) {
      var data = res.object
      this.postForm.noticeAnnexes.push(data)
      // this.postForm.cover = URL.createObjectURL(file.raw)
    },
    // 图片x删除
    handleRemove(file, fileList) {
      if (file.uid || file.status === 'success') {
        this.postForm.noticeAnnexes.map((item, index) => {
          // 草稿已上传文件，获取的文件，删除的方法
          if (file.url) {
            if (item.url === file.url) {
              this.postForm.noticeAnnexes.splice(index, 1)
            }
          } else {
            // 草稿编辑新增文件删除方法
            if (item.url === file.response.object.url) {
              this.postForm.noticeAnnexes.splice(index, 1)
            }
          }
        })
      }
    },
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data
          // Just for test
          this.postForm.title += `   Article Id:${this.postForm.id}`
          this.postForm.summary += `   Article Id:${this.postForm.id}`

          // Set tagsview title
          this.setTagsViewTitle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    submitForm(status) {
      this.postForm.status = status // 发布1或者保存0
      this.postForm.type = this.$route.query.type
      if (this.$route.query.id) {
        this.postForm.id = this.$route.query.id
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if(status === 0){
            this.loadingSave = true
          }else{
            this.loading = true
          }
          if (this.$route.query.type === '0') {
            this.postForm.noticeUserList = [].concat(this.postForm.noticeUserList, this.userList1, this.userList2)
            if (this.postForm.schoolNoticeDrafts.length !== 0 || this.postForm.noticeUserList.length !== 0) {
              if (this.postForm.content !== '') {
                this.$API.school.noticeAreaSaveOrSubmit({
                  ...this.postForm
                }).then(Response => {
                  if (Response.data.result !== 'fail') {
                    if (this.postForm.status === 0) {
                      this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
                      this.loadingSave = false
                    } else {
                      this.$message({
                        message: '发布成功',
                        type: 'success'
                      })
                      this.loading = false
                    }
                    if (this.$route.query.edit === '1') {
                      this.$router.push('notificationdraft')
                    } else {
                      if(this.postForm.status === 0){
                        this.$router.push('/notification/notificationdraft')
                      }else{
                        this.$router.push('regionallevel')
                      }
                    }
                    // 重置表单
                    this.postForm = Object.assign({}, defaultForm)
                    this.fileList = []
                    this.check1 = []
                  } else {
                    this.$message({
                      type: 'error',
                      message: '发布失败'
                    })
                    this.loadingSave = false
                    this.loading = false
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '请输入发布内容'
                })
                this.loadingSave = false
                this.loading = false
              }
            } else {
              this.$message({
                type: 'error',
                message: '请选择学校'
              })
              this.loadingSave = false
              this.loading = false
            }
          }
          if (this.$route.query.type === '1') {
            this.postForm.noticeUserList = [].concat(this.postForm.noticeUserList, this.userList1, this.userList2)
            if (this.postForm.noticeUserList.length !== 0) {
              if (this.postForm.content !== '') {
                this.$API.school.noticeSaveOrSubmit({
                  ...this.postForm
                }).then(Response => {
                  if (Response.data.result !== 'fail') {
                    if (this.postForm.status === 0) {
                      this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
                      this.loadingSave = false
                    } else {
                      this.$message({
                        message: '发布成功',
                        type: 'success'
                      })
                      this.loading = false
                    }
                    if (this.$route.query.edit === '1') {
                      this.$router.push('notificationdraft')
                    } else {
                      if(this.postForm.status === 0){
                        this.$router.push('/notification/notificationdraft')
                      }else{
                        this.$router.push('schoollevel')
                      }
                    }
                    // 重置表单
                    this.postForm = Object.assign({}, defaultForm)
                    this.fileList = []
                    this.check1 = []
                  } else {
                    this.$message({
                      type: 'error',
                      message: '发布失败'
                    })
                    this.loadingSave = false
                    this.loading = false
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '请输入发布内容'
                })
                this.loadingSave = false
                this.loading = false
              }
            } else {
              this.$message({
                type: 'error',
                message: '请选择发送的人'
              })
              this.loadingSave = false
              this.loading = false
            }
          }
          if (this.$route.query.type === '2') {
            this.postForm.classNoticeDrafts = [].concat(this.postForm.classNoticeDrafts, this.userList1, this.userList2)
            if (this.postForm.classNoticeDrafts.length !== 0) {
              if (this.postForm.content !== '') {
                this.$API.school.noticeClassNoticeSave({
                  ...this.postForm
                }).then(Response => {
                  if (Response.data.result !== 'fail') {
                    if (this.postForm.status === 0) {
                      this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
                      this.loadingSave = false
                    } else {
                      this.$message({
                        message: '发布成功',
                        type: 'success'
                      })
                      this.loading = false
                    }
                    if (this.$route.query.edit === '1') {
                      this.$router.push('notificationdraft')
                    } else {
                      if(this.postForm.status === 0){
                        this.$router.push('/notification/notificationdraft')
                      }else{
                        this.$router.push('classlevel')
                      }
                    }
                    // 重置表单
                    this.postForm = Object.assign({}, defaultForm)
                    this.fileList = []
                    this.check1 = []
                  } else {
                    this.$message({
                      type: 'error',
                      message: '发布失败'
                    })
                    this.loadingSave = false
                    this.loading = false
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '请输入发布内容'
                })
                this.loadingSave = false
                this.loading = false
              }
            } else {
              this.$message({
                type: 'error',
                message: '请选择发送的人'
              })
              this.loadingSave = false
              this.loading = false
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.editor-content {
  height:600px;
  overflow-y: scroll;
  margin-top:40px;
}
.btn-foot{
  margin-left: 100px;
  margin-bottom: 40px;
  button{
    width: 178px;
  }
}
</style>
