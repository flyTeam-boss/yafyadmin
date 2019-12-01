import instance from './resource'

export default {
  // -----------------↓↓↓教师管理接口↓↓↓-----------------
  //教师列表
  teacherList(data){
    return instance.get(`/index?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}`)
  },
  //更改状态
  teacherUpdateStatus(data){
    return instance.get('/changStatus',data)
  },
  //更改状态
  teacherSave(data){
    return instance.post('/save',data)
  },
  //编辑
  teacherEdit(data){
    return instance.get(`/edit?userId=${data}`)
  },
  //启用教师
  teacherGetListByStatus(){
    return instance.get('/getListByStatus')
  },
  teacherErrorInfo(data){
    return instance.get(`/outputErrorExcel?errorKey=${data}`)
  }
}