import instance from './resource'

export default {
  // 登录
  login(data) {
    return instance.post('/login',data)
  },
  // 获取本用户所有用的菜单
  systemIndex() {
    return instance.get('/system/index')
  },
  //保存登陆用户信息
  modifyUserInfo(data) {
    return instance.post('/systemUser/modifyUserInfo', data)
  },
  // 获取用户信息
  systemIndexGetUserInfo() {
    return instance.get('/system/index/getUserInfo')
  },
  // 本月新增学院情况
  systemIndexAddStudent() {
    return instance.get('/system/index/addStudent')
  },
  // 课时缴费的学员
  systemIndexPayMoneyStudent(data) {
    return instance.get('/system/index/payMoneyStudent',data)
  },
  exportLable(data) {//导出
    return instance.get('/system/index/allOutPut',data)
  },
  // -------------------- ↓↓↓用户↓↓↓ --------------------
  // 用户管理主页面
  systemUser(data) {
    return instance.get(`/systemUser/index?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}`)
  },
  // 用户管理主页面
  systemUserLoginOut() {
    return instance.get('/loginOut')
  },
  // 添加用户需要的数据
  systemUserAdd(data) {
    return instance.get('/systemUser/add', data)
  },
  // 保存用户信息
  systemUserSave(data) {
    return instance.post('/systemUser/save', data)
  },
  // 保存用户信息
  systemUserEdit(data) {
    return instance.get(`/systemUser/edit?userId=${data}`)
  },
  // 更改用户状态
  systemUserChangStatus(data) {
    return instance.get(`/systemUser/changStatus`,data)
  },
  // 校验密码
  systemUserChackPassword(data) {
    return instance.get(`/systemUser/chackPassword`, data)
  },
  // 更改用户信息
  systemUserChangeUserInfo(data) {
    return instance.post(`/systemUser/changeUserInfo`, data)
  },
  // savePassword
  systemUserSavePassword(data) {
    return instance.post(`/systemUser/savePassword`, data)
  },
  // 校验电话号码
  systemUserChackPhone(data) {
    return instance.get(`/systemUser/chackPhone`, data)
  },
  // 重置密码
  systemUserResetPassword(data) {
    return instance.post(`/systemUser/resetPassword`, data)
  },
  // 获取用户信息
  systemUserGetSysUser(data) {
    return instance.get(`/systemUser/getSysUser`, data)
  },
  // -------------------- ↓↓↓角色↓↓↓ --------------------
  // getSystemUserList
  systemRole(data) {
    return instance.get('/system/role', data)
  },
  // 添加角色
  roleAdd(data) {
    return instance.get('/system/role/add', data)
  },
  // 保存角色
  roleSave(data) {
    return instance.post(`/system/role/save`, data)
  },
  // 编辑角色
  roleEdit(roleId) {
    return instance.get(`/system/role/edit?roleId=${roleId}`)
  },
  // 更改角色状态
  roleChangeStatus(roleId, status) {
    return instance.get(`/system/role/changeStatus?roleId=${roleId}&status=${status}`)
  },
  findRoleByType(data) {
    return instance.get(`/system/role/findRoleByType?type=${data}`)
  },
  //根据用户身份获取角色
  getRoleList() {
    return instance.get('/system/role/getRoleList')
  },
  // -------------------- ↓↓↓左侧导航资源↓↓↓ --------------------
  // 获取所有资源
  systemResource(data) {
    return instance.get('/system/resource', data)
  },
  // 编辑资源
  resourceEdit(data) {
    return instance.get(`/system/resource/edit?resourceId=${data}`)
  },
  // 保存资源
  resourceSave(data) {
    return instance.post('/system/resource/save', data)
  },
  // 删除资源
  resourceDelete(data) {
    return instance.get(`/system/resource/delete?resourceId=${data}`)
  },
  // -------------------- ↓↓↓系统消息接口↓↓↓ --------------------
  systemMessage(data){
    return instance.post(`/message/page?page=${data.page}&limit=${data.limit}`,data)
  },
  messageAdd(data){
    return instance.post('/message/save',data)
  },
  messageDel(data){
    return instance.post('/message/deleteById',data)
  },
  updateStatus(data){
    return instance.post('/message/updateStatus',data)
  },
  // -------------------- ↓↓↓意见反馈接口↓↓↓ --------------------
  feedback(data){
    return instance.post(`/feedback/page?page=${data.page}&limit=${data.limit}`,data)
  },
  //意见反馈详情
  feedbackDetail(data){
    return instance.get(`/feedback/${data}`)
  },
  //意见反馈详情处理
  updateById(data){
    return instance.post('/feedback/updateById',data)
  },
  // -------------------- ↓↓↓APP版本管理接口↓↓↓ --------------------
  //app版本列表
  appListData(data){
    return instance.post(`/version/page?page=${data.page}&limit=${data.limit}`,data)
  },
  //app版本添加
  appAdd(data){
    return instance.post('/version/save',data)
  },
  //app版本删除
  appDel(data){
    return instance.post('/version/deleteById',data)
  },
  //app根据ID进行编辑
  appEditById(data){
    return instance.get(`/version/${data}`)
  },
  //app版本编辑保存
  appEdit(data){
    return instance.post('/version/updateById',data)
  },
  // -------------------- ↓↓↓登陆日志接口↓↓↓ --------------------
  loginLog(data) {
    return instance.get(`/loginLog/page?page=${data.page}&limit=${data.limit}&realName=${data.realName}&name=${data.name}`)
  },
  // -------------------- ↓↓↓操作日志接口↓↓↓ --------------------
  // 查询操作日志列表
  accountLog(data) {
    return instance.get(`/accountLog/page?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}`)
  },
  // -------------------- ↓↓↓banner管理接口↓↓↓ --------------------
  bannerList(data) {
    return instance.post(`/banner/page?page=${data.page}&limit=${data.limit}`, data)
  },
  //banner新增
  bannerAdd(data) {
    return instance.post('/banner/save', data)
  },
  //banner更新状态
  bannerUpdateStatus(data) {
    return instance.post('/banner/updateStatus', data)
  },
  //banner编辑
  bannerEdit(data) {
    return instance.get(`/banner/${data}`)
  },
  //banner编辑保存
  bannerUpdate(data) {
    return instance.post('/banner/updateById', data)
  },
  // -------------------- ↓↓↓主页面接口↓↓↓ --------------------
  // 获取用户学校列表
  systemIndexChangeSchool(data) {
    return instance.get('/system/index/changeSchool', data)
  },
  // 确认选择学校
  systemIndexConfirmSchool(data) {
    return instance.get('/system/index/confirmSchool', data)
  },
  // 判断该用户是否是超级用户
  systemIndexIsSuperUser(data) {
    return instance.get('/system/index/isSuperUser', data)
  },
  // -------------------- ↓↓↓首页数据统计接口↓↓↓ --------------------
  // 首页数据统计
  indexStatistics(data) {
    return instance.get('/system/index/statistics', data)
  },
}
