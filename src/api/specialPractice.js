import instance from './resource'
export default {
  // -----------------↓↓↓模拟管理接口↓↓↓-----------------
  //模拟列表
  limitTimePracticeList(data){
    return instance.get(`/limitTimePractice/page?page=${data.page}&limit=${data.limit}&subjectId=${data.subjectId}&gradeId=${data.gradeId}&name=${data.name}&className=${data.className}&status=${data.status}`)
  },
  //保存
  limitTimePracticeSave(data){
    return instance.post('/limitTimePractice/save',data)
  },
  //删除草稿
  limitTimePracticeDel(data){
    return instance.get(`/limitTimePractice/delete?id=${data}`)
  }, 
  //编辑
  limitTimePracticeEdit(data){
    return instance.get(`/limitTimePractice/editPage?id=${data}`)
  },  
  //结束
  limitTimePracticeEnd(data){
    return instance.get(`/limitTimePractice/end?id=${data}`)
  },
  //模拟详情
  limitTimePracticedetailPage(data){
    return instance.get(`/limitTimePractice/detailPage?id=${data}`)
  },
}


