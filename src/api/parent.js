import instance from './resource'
export default {
  // -----------------↓↓↓家长管理接口↓↓↓-----------------
  //家长列表
  parentList(data){
    return instance.post(`/parent/page?page=${data.page}&limit=${data.limit}&keyword=${data.keyword}`,data)
  },
  //保存
  parentSave(data){
    return instance.post('/parent/save',data)
  },
  //更改状态
  parentUpdateStatus(data){
    return instance.post('/parent/updateStatus',data)
  },
  //获取启用的家长
  getPanrentListByStatus(){
    return instance.post('/parent/getPanrentListByStatus')
  },
  //重置密码
  parentResetPwd(data){
    return instance.get(`/parent/resetPwd/${data}`)
  },
  //编辑
  parentEdit(data){
    return instance.get(`/parent/${data}`)
  },
  //编辑保存
  parentEditSave(data){
    return instance.post('/parent/updateById',data)
  },
  
}


