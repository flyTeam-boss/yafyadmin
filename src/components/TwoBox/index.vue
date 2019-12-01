<template>
  <div class="app-container">
    <el-row class="two-box">
      <el-col :span="12"><div class="grid-content bg-purple two-left">
        <slot name="left" />
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light two-right">
        <slot name="right" />
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TwoBox'
}
</script>

<style lang="scss" scoped>
    .two-box{
        .two-left,.two-right{
            border: 1px solid #797979;
            height:600px;
            padding:14px;
        }
        .two-left{
            overflow-y: auto;
            margin-right:24px;
        }
    }
</style>
