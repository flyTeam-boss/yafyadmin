import instance from './resource'
export default {
  // -----------------↓↓↓题库管理接口↓↓↓-----------------
  //题列表
  questionList(data){
    return instance.get(`/questionBank/page?page=${data.page}&limit=${data.limit}&subjectId=${data.subjectId}&gradeId=${data.gradeId}&knowledgeId=${data.knowledgeId}&keyword=${data.keyword}&creatorName=${data.creatorName}&star=${data.star}`)
  },
  //保存
  questionSave(data){
    return instance.post('/questionBank/save',data)
  },
  //更改状态
  questionUpdateStatus(data){
    return instance.get(`/questionBank/updateStatus?status=${data.status}&id=${data.id}`)
  },  
  
  //查看习题
  questionfindOne(data){
    return instance.get(`/questionBank/findOne?id=${data}`)
  },
}


