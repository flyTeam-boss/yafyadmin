<template>
  <div class="app-container">
    <TwoBox>
      <template>
        <div slot="left">
          <div class="title">
            <h4>分组菜单</h4>
            <el-button class="customBtn" type="primary" icon="el-icon-edit" @click="addMenu">新增</el-button>
          </div>
          <el-tree
            :data="data"
            :props="defaultProps"
            :expand-on-click-node="true"
            node-key="id"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          />
        </div>
      </template>

      <template>
        <div slot="right">
          <h4 class="title">添加分组</h4>
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">

            <template>
              <el-form-item v-if="!isShowTeacher" label="分组名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入分组名称" />
              </el-form-item>
              <el-form-item v-if="!isShowTeacher" label="权限顺序" prop="sep">
                <el-input v-model="form.sep" placeholder="请输入权限顺序" />
              </el-form-item>
              <el-form-item v-if="!isShowTeacher" label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
              </el-form-item>
              <el-form-item v-if="isShowTeacher" label="选择老师" prop="checkTeacher">
                <!-- v-model="check"
                  value-key="id"
                  children-key="schoolList" -->
                <el-cascader
                  v-model="form.checkTeacher"
                  :options="teacherList"
                  placeholder="选择老师"
                  :props="{value:'id',label:'realName',multiple: true}"
                  :filterable="true"
                  collapse-tags
                />
              </el-form-item>
              <el-form-item v-if="!isShowTeacher" label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">启用</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">立即提交</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </TwoBox>
  </div>
</template>

<script>
import TwoBox from '@/components/TwoBox'
export default {
  name: 'Group',
  components: { TwoBox },
  data() {
    return {
      form: {
        name: '',
        sep: '',
        remark: '',
        status: '',
        groupId: '',
        teacherId: '',
        checkTeacher: []
      },
      teacherList: [],
      data: [
        {
          name: '分组管理',
          teacherNoticeResponses: []
        }
      ],
      defaultProps: {
        children: 'teacherNoticeResponses',
        label: 'name'
      },
      rules: {
        name: [{ required: true, message: '请输入组名称', trigger: 'blur' }],
        sep: [{ required: true, message: '请输入权限顺序', trigger: 'blur' }],
        checkTeacher: [{ required: true, message: '请选择老师', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      isShowTeacher: false
      // showListGroup: {},
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    handleNodeClick(data) {
      this.isShowTeacher = false
      if (data.teacherNoticeResponses) {
        this.$API.school.groupEdit({
          params: {
            groupId: data.id
          }
        }).then(Response => {
          var data = Response.data.object
          this.form = {
            name: data.name,
            sep: data.sep,
            remark: data.remark,
            status: JSON.stringify(data.status),
            id: data.id
          }
        })
      } else {
        if (data.name === 'Undefined') {
          this.form.id = ''
        }
        this.reForm(false)
      }
    },
    reForm(isId) {
      if (isId) {
        this.form = {
          name: '',
          sep: '',
          remark: '',
          status: '',
          id: ''
        }
      } else {
        this.form = {
          name: '',
          sep: '',
          remark: '',
          status: ''
        }
      }
    },
    getTree() {
      this.$API.school.group().then(Response => {
        this.data[0].teacherNoticeResponses = Response.data.object
      })
    },
    addMenu() {
      this.isShowTeacher = false
      this.reForm(false)
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      const newChild = { name: 'Undefined' }
      this.data[0].teacherNoticeResponses.push(newChild)
      this.form.name = 'Undefined'
    },
    // 提交表单
    onSubmit(form) {
      if (this.isShowTeacher) {
        // 添加老师
        var newArr = []
        this.form.checkTeacher.map(item => {
          newArr.push(item[1])
        })
        this.form.checkTeacher = newArr
        this.$API.school.groupUserSave({
          params: {
            groupId: this.form.groupId,
            teacherIds: this.form.checkTeacher.join(',')
          }
        }).then(Response => {
          if (Response.data.result === 'ok') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.form.checkTeacher = []
            this.$refs['form'].resetFields()
            this.getTree()
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      } else {
        this.$refs[form].validate(valid => {
          if (valid) {
            // 添加分组
            this.$API.school
              .groupGroupSave({
                ...this.form
              })
              .then(Response => {
                if (Response.data.result === 'ok') {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.reForm(true)
                  if (this.$refs.form) {
                    this.$refs.form.clearValidate()
                  }
                  this.getTree()
                } else {
                  this.$message({
                    type: 'error',
                    message: Response.data.errorMsg
                  })
                }
              })
          }
        })
      }
    },
    // 重置表单
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    // 添加
    append(data) {
      window.event.stopPropagation()
      if (data.name === 'Undefined') {
        return
      } else {
        this.isShowTeacher = true
        console.log(data.id)
        this.$API.school.groupAdd({
          params: {
            groupId: data.id
          }
        }).then(Response => {
          var data = [{
            realName: '所有老师',
            children: Response.data.object
          }]
          this.teacherList = data
        })
        // this.type = '1'
        this.form.groupId = data.id
      }
    },
    // 删除
    remove(node, data) {
      if (data.name === 'Undefined') {
        return this.getTree()
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school
          .groupGroupDelete({
            params: {
              groupId: parseInt(data.id)
            }
          })
          .then(Response => {
            if (Response.data.result === 'ok') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.reForm(true)
              this.getTree()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    teacherRemove(node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school
          .groupUserDelete({
            params: {
              userId: data.id,
              groupId: node.parent.key
            }
          })
          .then(Response => {
            if (Response.data.result === 'ok') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTree()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 指定渲染函数
    renderContent(h, { node, data, store }) {
      if (data.name !== '分组管理') {
        if (data.phone) {
          // 老师
          return (
            <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
              <span>
                <span>{node.label}</span>
              </span>
              <span>
                <i
                  class='el-icon-delete'
                  on-click={() => this.teacherRemove(node, data)}
                />
              </span>
            </span>
          )
        } else {
          // 分组
          return (
            <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
              <span>
                <span>{node.label}</span>
              </span>
              <span>
                <i
                  style='padding-right:4px;'
                  class='el-icon-circle-plus'
                  on-click={() => this.append(data)}
                />
                <i
                  class='el-icon-delete'
                  on-click={() => this.remove(node, data)}
                />
              </span>
            </span>
          )
        }
      } else {
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span>
              <span>{node.label}</span>
            </span>
          </span>
        )
      }
    },
    getList: function() {
      // 获取区域列表
      this.listLoading = true
    }
  }
}
</script>

<style lang="scss" scoped>
.juris-box {
  .juris-left,
  .juris-right {
    border: 1px solid #797979;
    height: 100%;
    padding: 14px;
  }
  .juris-left {
    margin-right: 24px;
  }
  h4 {
    margin: 0;
    font-weight: 500;
  }
}
.title{
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: space-between;
  margin-bottom:17px;
}
h4 {
  margin: 0;
  font-weight: 500;
  color: #606266;
}
.customBtn{
  height:26px;
  line-height:26px;
  padding: 0 6px;
}
</style>
