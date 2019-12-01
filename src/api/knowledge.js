import instance from './resource'

export default {
  // -----------------↓↓↓知识点管理接口↓↓↓-----------------
  //知识点列表
  knowledgeList(data){
    return instance.get(`/knowledge/page?page=${data.page}&limit=${data.limit}&knowledgeId=${data.knowledgeId}&name=${data.name}&subjectId=${data.subjectId}`)
  },
  //更改状态
  knowledgeUpdateStatus(data){
    return instance.get(`/knowledge/updateStatus?id=${data.id}&status=${data.status}`)
  },
  //保存知识点
  knowledgeSave(data){
    return instance.post('/knowledge/save',data)
  },
  //构建知识点树
  knowledgeTree(data){
    if(data.status == 0){
      return instance.get(`/knowledge/tree?subjectId=${data.subjectId}&status=${data.status}`)
    }else{
      return instance.get(`/knowledge/tree?subjectId=${data.subjectId}`)
    }
    
  },
  //编辑
  knowledgeEdit(data){
    return instance.get(`/knowledge/findOne?id=${data}`)
  },
}