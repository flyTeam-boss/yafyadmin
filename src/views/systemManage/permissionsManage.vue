<template>
  <div class="app-container">
    <TwoBox>
      <template>
        <div slot="left">
          <div class="title">
            <h4>权限菜单</h4>
            <el-button class="customBtn" type="primary" icon="el-icon-edit" @click="addMenu">新增</el-button>
          </div>
          <el-tree
            ref="dataform"
            :data="data"
            :props="defaultProps"
            :default-expand-all="true"
            :accordion="false"
            :expand-on-click-node="true"
            node-key="id"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          />
        </div>
      </template>

      <template v-if="authorityMenu">
        <div slot="right">
          <h4 class="title">权限菜单</h4>
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="权限名称" prop="resourceName">
              <el-input v-model="form.resourceName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="icon">
              <el-input v-model="form.icon" placeholder="请输入路由图标" />
            </el-form-item>
            <el-form-item label="权限路径">
              <el-input v-model="form.resourceUrl" placeholder="请输入路径" />
            </el-form-item>
            <el-form-item label="权限顺序" prop="seq">
              <el-input v-model="form.seq" placeholder="请输入权限顺序" />
            </el-form-item>
            <el-form-item label="权限类型" prop="resourceType">
              <el-radio-group v-model="form.resourceType">
                <el-radio label="0">菜单</el-radio>
                <el-radio label="1">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注内容" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
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
  name: 'Jurisdiction',
  components: { TwoBox },
  data() {
    return {
      form: {
        resourceName: '',
        resourceUrl: '',
        seq: '',
        resourceType: '',
        remark: '',
        status: '',
        parentId: '',
        icon: ''
      },
      data: [],
      defaultProps: {
        children: 'resourceDtos',
        label: 'resourceName',
        id: 'id'
      },
      authorityMenu: false,
      rules: {
        resourceName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        resourceUrl: [
          { required: true, message: '请输入权限路径', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入权限顺序', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '请勾选权限类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请勾选状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleNodeClick(data) {
      this.authorityMenu = true
      this.$API.system.resourceEdit(data.id).then(response => {
        var data = response.data.object.systemResource
        this.form = {
          resourceName: data.resourceName,
          resourceUrl: data.resourceUrl,
          seq: data.seq,
          resourceType: JSON.stringify(data.resourceType),
          remark: data.remark,
          status: JSON.stringify(data.status),
          id: data.id,
          parentId: data.parentId,
          icon: data.icon
        }
      })
    },
    getList() {
      this.$API.system.systemResource().then(response => {
        this.data = response.data.object
      })
    },
    addMenu() {
      this.resetform()
      this.form.parentId = '0'
      this.authorityMenu = true
      const newChild = { resourceName: 'Undefined' }
      this.data.push(newChild)
    },
    // 重置表单
    resetform() {
      this.form = {
        resourceName: '',
        resourceUrl: '',
        seq: '',
        resourceType: '',
        remark: '',
        status: '',
        parentId: '',
        icon: ''
      }
    },
    // 提交表单
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$API.system.resourceSave(this.form).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
            this.resetform()
          })
        }
      })
    },
    // 重置表单
    resetForm(form) {
      this.form.icon = ''
      this.form.resourceUrl = ''
      this.getList()
    },

    // 添加
    append(data) {
      this.resetform()
      // 新增的空壳权限
      const newChild = { resourceName: 'Undefined' }
      if (!data.resourceDtos) {
        this.$set(data, 'resourceDtos', [])
      }
      data.resourceDtos.push(newChild)
      this.form.parentId = data.id
      this.form.id = ''
      this.authorityMenu = true
    },
    // 删除
    remove(node, data) {
      if (data.resourceName === 'Undefined') {
        const parent = node.parent
        const children = parent.data.resourceDtos || parent.data
        const index = children.findIndex(d => d.resourceName === data.resourceName)
        children.splice(index, 1)
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '请确认删除菜单')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              setTimeout(() => {
                done()
                setTimeout(() => {
                  instance.confirmButtonLoading = false
                }, 300)
              }, 300)
            } else {
              done()
            }
          }
        }).then(action => {
          this.$API.system.resourceDelete(data.id).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        })
      }
    },
    // 指定渲染函数
    renderContent(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <i
              style='padding-right:4px;'
              class='el-icon-circle-plus'
              on-click={(e) => { e.stopPropagation(); this.append(data) }}
            />
            <i
              class='el-icon-delete'
              on-click={(e) => { e.stopPropagation(); this.remove(node, data) }}
            />
          </span>
        </span>
      )
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
h4 {
  margin: 0;
  font-weight: 500;
  color: #606266;
}
.title{
  display: flex;
  align-items: center;
  margin-bottom:17px;
  justify-content: space-between;
  p{
    margin:0;
  }
}
.customBtn{
  height:26px;
  line-height:26px;
  padding: 0 6px;
}
</style>
