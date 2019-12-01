import instance from './resource'
export default {
  // -----------------↓↓↓学生管理接口↓↓↓-----------------
  //学生列表
  studentList(data){
    return instance.post(`/student/page?page=${data.page}&limit=${data.limit}`,data)
  },
  //保存
  studentSave(data){
    return instance.post('/student/save',data)
  },
  //更改状态
  studentUpdateStatus(data){
    return instance.post('/student/updateStatus',data)
  },
  //编辑
  studentEdit(data){
    return instance.get(`/student/${data}`)
  },
  //编辑保存
  studentEditSave(data){
    return instance.post('/student/updateById',data)
  },
  //导出错误信息
  studentErrorInfo(data){
    return instance.get(`/student/outputErrorExcel?errorKey=${data}`)
  }
}


