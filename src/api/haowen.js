import resource from './resource'

// ------------大房东管理-----------------
//  大房东列表
export function bigFDList(data) {
    return resource({
        url: '/bigLandlord/bigLandlordList',
        method: 'get',
        params: data
    })
}
//  大房东删除
export function bigFDDel(id) {
    return resource({
        url: '/bigLandlord/delete',
        method: 'get',
        params: {
            bigLandlordId :id
        }
    })
}
//  大房东详情
export function bigFDDetail(id) {
    return resource({
        url: '/bigLandlord/detail',
        method: 'get',
        params: {
            bigLandlordId :id
        }
    })
}
//  大房东 保存
export function bigFDAdd(data, id) {
    return resource({
        url: '/bigLandlord/save',
        method: 'post',
        params: {
            id: id
        },
        data
    })
}

// ------------合同管理-----------------
//  合同列表
export function agreementList(data) {
    return resource({
        url: '/agreement/index',
        method: 'get',
        params: data
    })
}
//  合同删除
export function agreementDel(id) {
    return resource({
        url: '/agreement/delete',
        method: 'get',
        params: {
            agreementId:id
        }
    })
}
//  合同详情
export function agreementDetail(id) {
    return resource({
        url: '/agreement/detail',
        method: 'get',
        params: {
            agreementId:id
        }
    })
}
//  合同 保存
export function agreementAdd(data, id) {
    return resource({
        url: '/agreement/save',
        method: 'post',
        params: {
            id: id
        },
        data
    })
}

// ------------套房管理-----------------
//  套房列表
export function areaList(data) {
    return resource({
        url: '/area/areaList',
        method: 'get',
        params: data
    })
}
//  套房删除
export function areaDel(id) {
    return resource({
        url: '/area/delete',
        method: 'get',
        params: {
            areaId: id
        }
    })
}
//  套房详情
export function areaDetail(id) {
    return resource({
        url: '/area/detail',
        method: 'get',
        params: {
            areaId: id
        }
    })
}
//  套房 保存
export function areaAdd(data, id) {
    return resource({
        url: '/area/save',
        method: 'post',
        params: {
            id: id
        },
        data
    })
}

// ------------小房间管理-----------------
//  小房间列表
export function roomList(data) {
    return resource({
        url: '/room/roomList',
        method: 'get',
        params: data
    })
}
//  小房间删除
export function roomDel(data) {
    return resource({
        url: '/room/delete',
        method: 'get',
        params: {
            roomId: id
        }
    })
}
//  小房间详情
export function roomDetail(id) {
    return resource({
        url: '/room/detail',
        method: 'get',
        params: {
            roomId: id
        }
    })
}
//  小房间 保存
export function roomAdd(data, id) {
    return resource({
        url: '/room/save',
        method: 'post',
        params: {
            id: id
        },
        data
    })
}

// ------------租客管理-----------------
//  租客列表
export function renantList(data) {
    return resource({
        url: '/renant/index',
        method: 'get',
        params: data
    })
}
//  租客删除
export function renantDel(id) {
    return resource({
        url: '/renant/delete',
        method: 'get',
        params: {
            renantId:id
        }
    })
}
//  租客详情
export function renantDetail(id) {
    return resource({
        url: '/renant/detail',
        method: 'get',
        params: {
            renantId:id
        }
    })
}
//  租客 保存
export function renantAdd(data, id) {
    return resource({
        url: '/renant/save',
        method: 'post',
        params: {
            id: id
        },
        data
    })
}
