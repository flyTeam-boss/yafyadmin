<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索学校：</span>
      <el-select v-model="value" placeholder="请选择" @change="handleSchool">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-table v-loading="schoolLoading" :data="schoolData" border style="width: 100%">
        <el-table-column align="center" prop="name" label="学校" width="180" />
        <el-table-column align="center" prop="studentCount" label="学生（人）" />
        <el-table-column align="center" prop="parentCount" label="家长（人）" />
        <el-table-column align="center" prop="schoolRoleCount" label="教职工（人）" />
        <el-table-column align="center" prop="subjectTeacherCount" label="科目老师（人）" />
        <el-table-column align="center" prop="classCount" label="班级数（个）" />
        <el-table-column align="center" prop="subjectCount" label="科目数（个）" />
      </el-table>

      <div class="mt30">
        <el-tag @click="getNotice(0)">今日</el-tag>
        <el-tag @click="getNotice(1)">周</el-tag>
        <el-tag @click="getNotice(2)">月</el-tag>
      </div>

      <ul class="mt30 number-info">
        <li>通知总数：{{ noticeCountResponse.sumNotice }}条</li>
        <li>发放量：{{ noticeCountResponse.countNotice }}人</li>
        <li>回执数：{{ noticeCountResponse.readCount }}人</li>
        <li>回执比例：{{ noticeCountResponse.preaSum | filNuber }}%</li>
      </ul>

      <el-table v-loading="listLoadingN" :data="noticeList" border style="width: 100%">
        <el-table-column align="center" prop="createTime" label="发送时间" />
        <el-table-column align="center" prop="title" label="消息描述" />
        <el-table-column align="center" prop="noticeCounts" label="发放量" />
        <el-table-column align="center" prop="readCounts" label="回执数" />
        <el-table-column align="center" label="回执比例">
          <template scope="scope">
            {{ scope.row.readCounts | filRatio(scope.row.noticeCounts) }}
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="noticeTotal>0"
        :total="noticeTotal"
        :auto-scroll="false"
        :page.sync="listNotice.page"
        :limit.sync="listNotice.limit"
        @pagination="getNotice(listNotice.selectType)"
      />

      <div class="mt30">
        <el-tag @click="getDynamic(0)">今日</el-tag>
        <el-tag @click="getDynamic(1)">周</el-tag>
        <el-tag @click="getDynamic(2)">月</el-tag>
      </div>
    </div>

    <ul class="mt30 number-info">
      <li>动态总数：{{ dynamicCountResponse.sumDynamic }}条</li>
      <li>发放量：{{ dynamicCountResponse.countDynamic }}人</li>
      <li>回执数：{{ dynamicCountResponse.readDynamic }}人</li>
      <li>回执比例：{{ dynamicCountResponse.preaSum | filNuber }}%</li>
    </ul>

    <el-table v-loading="listLoadingD" :data="dynamicList" border style="width: 100%">
      <el-table-column align="center" prop="createTime" label="发送时间" />
      <el-table-column align="center" prop="title" label="动态描述" width="180" />
      <el-table-column align="center" prop="creator" label="发布人" />
      <el-table-column align="center" prop="readCounters" label="回执数" />
      <el-table-column align="center" label="回执率">
        <template scope="scope">
          {{ scope.row.readCounters | filRatio(scope.row.totalCounters) }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="dynamicTotal>0"
      :total="dynamicTotal"
      :page.sync="listDynamic.page"
      :limit.sync="listDynamic.limit"
      :auto-scroll="false"
      @pagination="getDynamic(listDynamic.selectType)"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'SchoolData',
  components: { Pagination },
  filters: {
    filRatio(value, noticeCounts) {
      if (isNaN(value / noticeCounts)) {
        return '0.00%'
      }
      if ((value / noticeCounts) === Infinity) {
        return '0.00%'
      }
      return ((value / noticeCounts) * 100).toFixed(2) + '%'
    },
    filNuber(value) {
      if (isNaN(value)) {
        return
      } else {
        return (value * 100).toFixed(2)
      }
    }
  },
  data() {
    return {
      // 翻页
      tableKey: 0,
      noticeList: [], // 通知数据
      noticeTotal: 0, // 通知条数
      noticePublicType: '', // 通知公共type
      noticeCountResponse: {},
      dynamicList: [], // 动态数据
      dynamicTotal: 0, // 动态条数
      dynamicPublicType: '', // 动态公共type
      dynamicCountResponse: {},
      schoolData: [],
      receiptRatio: '1',
      listLoadingN: true, // 通知加载
      listLoadingD: true, // 动态加载
      schoolLoading: true,
      listNotice: {
        page: 0,
        limit: 10,
        selectType: 0,
        schoolId: ''
      },
      listDynamic: {
        page: 0,
        limit: 10,
        selectType: 0,
        schoolId: ''
      },
      // 下拉框
      options: [],
      value: '' // 选中的学校
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.schoolLoading = true
      this.$API.school.schoolDataGetSchoolList().then(Response => {
        if (Response.data.object.isSuperUser === true) {
          this.options = Response.data.object.schoolList
          if (this.options[0]) {
            this.value = this.options[0].id
            this.handleSchool(this.value)
          }
        } else {
          // this.value = Response.data.object.schoolId
          this.handleSchool(Response.data.object.schoolId)
        }
        this.getNotice(2)
        this.getDynamic(2)
        this.schoolLoading = false
      })
    },
    schoolDataCountNotice(value) {
      this.listLoadingN = true
      this.listLoadingD = true
      this.$API.school.schoolDataCountNotice({
        params: {
          schoolId: value,
          type: 0
        }
      }).then(Response => {
        this.noticeCountResponse = Response.data.object.noticeCountResponse
        this.dynamicCountResponse = Response.data.object.dynamicCountResponse
        this.listLoadingN = false
        this.listLoadingD = false
      })
    },
    handleSchool(value) {
      this.listNotice.schoolId = value
      this.listDynamic.schoolId = value
      this.$API.school.schoolDataIndex({
        params: {
          schoolId: value
        }
      }).then(Response => {
        this.schoolData = [Response.data.object.schoolDataResponse]
      })
      this.schoolDataCountNotice(value)
      this.getNotice(2)
      this.getDynamic(2)
    },
    // 获取通知数据
    getNotice(type) {
      this.listLoadingN = true
      if (this.listNotice.schoolId === '') {
        this.$message({
          type: 'error',
          message: '请选择学校'
        })
      }
      this.listNotice.selectType = type
      this.$API.school.schoolDataNoticeData({
        params: {
          ...this.listNotice,
          type: 0
        }
      }).then(Response => {
        this.noticeList = Response.data.object.list
        this.noticeTotal = Response.data.object.total
        this.listLoadingN = false
      })
    },
    // 获取动态数据
    getDynamic(type) {
      this.listLoadingD = true
      if (this.listDynamic.schoolId === '') {
        this.$message({
          type: 'error',
          message: '请选择学校'
        })
      }
      this.listDynamic.selectType = type
      this.$API.school.schoolDataDynamicsData({
        params: {
          ...this.listDynamic,
          type: 0
        }
      }).then(Response => {
        this.dynamicList = Response.data.object.list
        this.dynamicTotal = Response.data.object.total
        this.listLoadingD = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table--border {
  margin-top: 30px;
}
.mt30 {
  margin-top: 30px;
}
.number-info {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
  li {
    color:#333333;
    // padding: 30px 70px;
    width: 20%;
    min-width: 160px;
    line-height: 70px;
    text-align: center;
    border: 1px solid #797979;
  }
}
.el-tag--medium{
  cursor: pointer;
}
</style>
