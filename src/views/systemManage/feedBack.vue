<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="searchOpinion">搜索意见：</span>
      <el-input
        v-model="listQuery.title"
        placeholder="输入反馈标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select class="filter-item" v-model="listQuery.status" placeholder="请选择状态">
        <el-option v-for="(item,index) in selectStatus" :key="index" :label="item" :value="index">
          <span style="float: left">{{ item }}</span>
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary"  @click="handleFilter">搜索</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID号" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈标题" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.content }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{row.content }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈人" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="{row}">
          <span>{{selectStatus[row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="100"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpDetail(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "UserAdmin",
  components: { Pagination },
  data() {
    return {
      selectStatus:["待处理","挂起","已处理"],
      statusValue:'',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: "",
        status:''
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$API.system.feedback({...this.listQuery}).then(Response => {
        this.list = Response.data.object.list;
        this.list.forEach((item,index)=>{
          item.num = index+1
        })
        this.total = Response.data.object.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    jumpDetail(id){
        this.$router.push({
            path:"feedbackdetail",
            query:{id}
        })
    }
  }
};
</script>
<style lang="scss">
.filter-container{
    display: flex;
    align-items: flex-start;
    .searchOpinion{
        display: inline-block;
        vertical-align: top;
        padding-top: 10px;
    }
    input{
        margin-left: 5px;
    }
    button{
        margin-left: 5px;
    }
    .filter-item{
        margin-left: 5px;
    }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.resetBox {
  display: flex;
  align-items: center;
  span {
    width: 150px;
  }
  input {
    margin-left: 8px;
    width: 80%;
  }
}
</style>
