import Instance from './resource'
export default {
  // 选择身份
  identity(data) {
    return Instance.get('/user/identity', data)
  },
  // 个人信息
  student(data) {
    return Instance.get('/user/student', data)
  },
  // 更新
  update(data) {
    return Instance.get('/../version', data)
  },
}
