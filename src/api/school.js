import instance from './resource'

export default {
  // -----------------↓↓↓加盟校管理接口↓↓↓-----------------
  //查找启用的加盟校
  findEnableSchool (){
    return instance.get('/joinSchool/findEnableSchool')
  },
  joinSchoolList(data) {
    return instance.get(`/joinSchool/page?page=${data.page}&limit=${data.limit}&name=${data.name}`)
  },
  //更新状态
  updateStatus(data) {
    return instance.get('/joinSchool/updateStatus',data)
  },
  //保存加盟校
  schoolAdd(data) {
    return instance.post('/joinSchool/save',data)
  },
  // -----------------↓↓↓续费管理接口↓↓↓-----------------
  //续费列表
  renewalList(data) {
    return instance.get(`/school/renewal/page?page=${data.page}&limit=${data.limit}&name=${data.name}`)
  },
  //根据ID查询学校进行续费
  renewalById(data) {
    return instance.get(`/school/renewal/findOneBySchoolId?schoolId=${data}`)
  },
  //保存续费
  renewalSave(data) {
    return instance.post('/school/renewal/save',data)
  },
  //获取缴费的学校数据
  renewalSchoolData() {
    return instance.get('/school/renewal/schoolData')
  },
  //获取缴费的学校数据
  findOneData(data) {
    return instance.get(`/school/renewal/findOne?id=${data}`)
  },
  // -----------------↓↓↓班级管理接口↓↓↓-----------------
  // 获取本校所有班级
  classList(data) {
    return instance.post(`/classes/page?page=${data.page}&limit=${data.limit}`, data)
  },
  // 根据年级联动班级
  getClassBytGrade(data) {
    return instance.post(`/classes/getClassBytGrade?gradeId=${data}`)
  },
  // 新增关联学生
  getStuWithOutClassId(data) {
    return instance.post(`/classes/getStuWithOutClassId?classId=${data.classId}&name=${data.name}&stuNo=${data.stuNo}&keyword=${data.keyword}`)
  },
  // 保存
  classSave(data) {
    return instance.post('/classes/save', data)
  },
  // 保存编辑
  classEdit(data) {
    return instance.post('/classes/updateById', data)
  },
  //导出
  classBatchExport(data) {
    return instance.get('/classes/batchExport',data)
  },
  //根据ID查询
  classFindOneData(data) {
    return instance.get(`/classes/${data}`)
  },
  //更改状态
  classUpdateStatus(data) {
    return instance.post('/classes/updateStatus', data)
  },
  //确认选择学生
  addStuToClass(data) {
    return instance.post(`/classes/addStuToClass?classId=${data.classId}&stuIds=${data.stuIds}`)
  },
  //班级已关联学生
  getStuByClassId(data) {
    return instance.post(`/classes/getStuByClassId?classId=${data.classId}&stuName=${data.name}&stuNo=${data.stuNo}&keyword=${data.keyword}`)
  },
  // 移除学生
  removeStuToClass(data) {
    return instance.post(`/classes/removeStuToClass?classId=${data.classId}&stuIds=${data.stuIds}`)
  },
  //导出
  batchExportByClassId(data) {
    return instance.post(`/classes/batchExportByClassId?classId=${data.classId}`)
  },
  //导出导入班级学生错误信息
  outputErrorExcelByStu(data){
    return instance.get(`/classes/outputErrorExcelByStu?errorKey=${data}`)
  },
  //导出导入班级错误信息
  outputErrorExcelByClass(data){
    return instance.get(`/classes/outputErrorExcelByClass?errorKey=${data}`)
  },
  //
  refreshClassStuCounts(){
    return instance.get('/classes/refreshClassStuCounts')
  },
  
  // -----------------↓↓↓年级管理接口↓↓↓-----------------
  // 年级列表
  gradeList(data) {
    return instance.post(`/grade/page?page=${data.page}&limit=${data.limit}`, data)
  },
  // 查询启用的年级
  getGradeByStatus(data) {
    return instance.post('/grade/getGradeByStatus', data)
  },
  //根据学科联动年级
  getGradeBySubject(data) {
    return instance.post(`/grade/getGradeBySubject?subId=${data}`)
  },
  // 保存年级
  gradeSave(data) {
    return instance.post('/grade/save', data)
  },
  // 查询年级
  gradeFindOne(data) {
    return instance.get(`/grade/${data}`)
  },
  // 保存编辑
  gradeEdit(data) {
    return instance.post('/grade/updateById', data)
  },
  // 修改状态
  gradeUpdateStatus(data) {
    return instance.post('/grade/updateStatus', data)
  },
  // -----------------↓↓↓科目管理↓↓↓-----------------
  // 查询科目
  subjectFindOne(data) {
    return instance.get(`/subject/${data}`)
  },
// 查询启用的学科
getSubByStatus(data) {
  return instance.post('/subject/getSubByStatus', data)
},
  // 科目列表
  subjectList(data) {
    return instance.post(`/subject/page?page=${data.page}&limit=${data.limit}`, data)
  },
  // 保存科目
  subjectSave(data) {
    return instance.post('/subject/save', data)
  },
  // 保存科目
  subjectEdit(data) {
    return instance.post('/subject/updateById', data)
  },
  // 变更状态
  subjectStatus(data) {
    return instance.post('/subject/updateStatus',data)
  },
  // -----------------↓↓↓通知管理↓↓↓-----------------
  // 草稿通知主页面
  notice(data) {
    return instance.get('/notice', data)
  },
  // 推送方式。0表示按区域推送；1表示按学校推送；2表示按班级推送；
  noticeAdd(data) {
    return instance.get('/notice/add', data)
  },
  // 删除通知
  noticeDelete(data) {
    return instance.get('/notice/delete', data)
  },
  // 通知草稿编辑
  noticeEdit(data) {
    return instance.get('/notice/edit', data)
  },
  // 保存或立即提交通知
  noticeSaveOrSubmit(data) {
    return instance.post('/notice/saveOrSubmit', data)
  },
  // 班级通知保存或发布
  noticeClassNoticeSave(data) {
    return instance.post('/notice/classNoticeSave', data)
  },
  // 区域通知保存或发布
  noticeAreaSaveOrSubmit(data) {
    return instance.post('/notice/areaSaveOrSubmit', data)
  },
  // 从通知草稿点击发布
  noticeSubmit(data) {
    return instance.get('/notice/submit', data)
  },
  // 已发布的通知详情
  noticeNoticeEdit(data) {
    return instance.get('/notice/noticeEdit', data)
  },
  // 通知草稿列表
  noticeDraftNotice(data) {
    return instance.get('/notice/draftNotice', data)
  },
  // -----------------↓↓↓职务管理↓↓↓-----------------
  // 获取学校职务
  schooljobFindOne(data) {
    return instance.get('/schooljob/findOne', data)
  },
  // 学校职务列表
  schooljobList(data) {
    return instance.get('/schooljob/list', data)
  },
  // 保存学校职务
  schooljobSave(data) {
    return instance.post(`/schooljob/save?id=${data.id}`, data)
  },
  // 变更职务状态
  schooljobStatus(data) {
    return instance.get('/schooljob/status', data)
  },
  // -----------------↓↓↓系统消息↓↓↓-----------------
  // 根据ID系统消息
  sysmessageFindOne(data) {
    return instance.get('/sysmessage/findOne', data)
  },
  // 系统消息列表
  sysmessageList(data) {
    return instance.get('/sysmessage/list', data)
  },
  // 保存消息
  sysmessageSave(data) {
    return instance.post('/sysmessage/save', data)
  },
  // 变更状态
  sysmessageStatus(data) {
    return instance.get('/sysmessage/status', data)
  },
  // -----------------↓↓↓学校数据统计↓↓↓-----------------
  // 动态消息
  schoolDataDynamicsData(data) {
    return instance.get('/schoolData/dynamicsData', data)
  },
  // 学校数据统计
  schoolDataIndex(data) {
    return instance.get('/schoolData/index', data)
  },
  // 通知消息
  schoolDataNoticeData(data) {
    return instance.get('/schoolData/noticeData', data)
  },
  // 学校列表
  schoolDataGetSchoolList(data) {
    return instance.get('/schoolData/getSchoolList', data)
  },
  // 教师数据统计
  teacherDataIndex(data) {
    return instance.get('/teacherData/index', data)
  },
  // 通知数量统计
  schoolDataCountNotice(data) {
    return instance.get('/schoolData/countNotice', data)
  },
  // -----------------↓↓↓任课老师相关接口↓↓↓-----------------
  // 教师数据统计
  courseTeacherReset(data) {
    return instance.get('/courseTeacher/reset', data)
  },
  // -----------------↓↓↓教职工接口↓↓↓-----------------
  // 重置密码
  teacherReset(data) {
    return instance.get('/teacher/reset', data)
  },
  // -----------------↓↓↓家长管理接口↓↓↓-----------------
  // 重置密码
  stuParentResetPassword(data) {
    return instance.get('/stuParent/resetPassword', data)
  },
  // -----------------↓↓↓X学校管理接口↓↓↓-----------------
  // 学校基础信息列表
  schoolList(data) {
    return instance.get('/platform/school', data)
  },
  // 保存
  schoolSave(data) {
    return instance.post('/platform/school/save', data)
  },
  // -----------------↓↓↓X学校费用接口↓↓↓-----------------
  // 学校缴费里列表
  platformExpense(data) {
    return instance.get('/platform/expense', data)
  },
  // 变更状态
  platformExpenseChangStatus(data) {
    return instance.get('/platform/expense/changStatus', data)
  },
  // 获取学校列表
  platformExpenseAdd(data) {
    return instance.get('/platform/expense/add', data)
  },
  // 缴费历史
  platformExpenseExpenseHistory(data) {
    return instance.get('/platform/expense/expenseHistory', data)
  },
  // 保存
  platformExpenseSave(data) {
    return instance.post('/platform/expense/save', data)
  },
}