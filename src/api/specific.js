import instance from './resource'
export default {
  // -----------------↓↓↓专项管理接口↓↓↓-----------------
  //专项列表
  specialList(data){
    return instance.get(`/specialPractice/page?page=${data.page}&limit=${data.limit}&subjectId=${data.subjectId}&gradeId=${data.gradeId}&name=${data.name}&className=${data.className}&status=${data.status}`)
  },
  //保存
  specialSave(data){
    return instance.post('/specialPractice/save',data)
  },
  //删除草稿
  specialDel(data){
    return instance.get(`/specialPractice/delete?id=${data}`)
  }, 
  //编辑
  specialEdit(data){
    return instance.get(`/specialPractice/editPage?id=${data}`)
  },  
  //结束
  specialEnd(data){
    return instance.get(`/specialPractice/end?id=${data}`)
  }, 
  //查看习题
  questionfindOne(data){
    return instance.get(`/questionBank/findOne?id=${data}`)
  },
  //专项详情
  questiondetailPage(data){
    return instance.get(`/specialPractice/detailPage?id=${data}`)
  },
}


