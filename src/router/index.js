import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为真，项目将不会显示在边栏中。(default is false)
 * alwaysShow: true               如果设置为真，将始终显示根菜单
 *                                如果未设置AlwaysShow，则当项具有多个子路由时,
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noredirect           如果 `redirect:noredirect` 则在面包屑中不会重定向
 * name:'router-name'             名称由使用 <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色 (可以设置多个角色)
    title: 'title'               在侧边栏和面包屑中显示的名称 (推荐集)
    icon: 'svg-name'             图标显示在侧边栏中
    noCache: true                如果设置为true，则不会缓存该页(default is false)
    affix: true                  if set true, 标签将粘贴在标签视图中
    breadcrumb: false            if set false, 该项目将隐藏在面包屑中(default is true)
    activeMenu: '/example/list'  if set path, 侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    },
    {
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () =>
            import ('@/views/login/authRedirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/errorPage/401'),
        hidden: true
    },
    //首页
    {
        path: '/',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
        }]
    },
    //系统管理
    {
        path: '/system',
        component: Layout,
        meta: { title: '系统管理', icon: 'example' },
        children: [{
                path: 'useradmin',
                name: 'UserAdmin',
                meta: { title: '用户管理' },
                component: () =>
                    import ('@/views/systemManage/userManage')
            },
            {
                path: 'jurisdiction',
                name: 'Jurisdiction',
                meta: { title: '权限管理' },
                component: () =>
                    import ('@/views/systemManage/permissionsManage')
            },
            {
                path: 'role',
                name: 'Role',
                meta: { title: '角色管理' },
                component: () =>
                    import ('@/views/systemManage/roleManage')
            },
            {
                path: 'loginlog',
                name: 'LoginLog',
                meta: { title: '登录日志' },
                component: () =>
                    import ('@/views/systemManage/loginLog')
            },
            {
                path: 'operationlog',
                name: 'Operationlog',
                meta: { title: '操作日志' },
                component: () =>
                import ('@/views/systemManage/operationLog')
            },
            {
                path: 'appmanage',
                name: 'AppManage',
                meta: { title: 'APP版本管理' },
                component: () =>
                    import ('@/views/systemManage/appManage')
            },
            {
                path: 'feedback',
                name: 'feedBack',
                meta: { title: '意见反馈' },
                component: () =>
                    import ('@/views/systemManage/feedBack')
            },
            {
                path: 'feedbackdetail',
                name: 'feedBackdetail',
                meta: { title: '意见反馈详情' },
                component: () =>
                    import ('@/views/systemManage/feedBackDetail')
            },
            {
                path: 'systemmessage',
                name: 'systemMessage',
                meta: { title: '系统消息' },
                component: () =>
                    import ('@/views/systemManage/systemMessage')
            },
            {
                path: 'bannermanage',
                name: 'bannerManage',
                meta: { title: 'banner管理' },
                component: () =>
                    import ('@/views/systemManage/bannerManage')
            },
            {
                path: 'modifyinformation',
                name: 'ModifyInformation',
                meta: { title: '个人信息' },
                component: () =>
                    import ('@/views/modifyinformation/index')
            }
        ]
    },
    //基础管理
    {
        path: '/basicmanage',
        component: Layout,
        children: [{
            path: 'bigLandlordList',
            component: () => import ('@/views/BasicManage/bigLandlord'),
            name: 'bigLandlordList',
            meta: { title: '大房东列表' }
        },{
            path: 'agreement',
            component: () => import ('@/views/BasicManage/agreement'),
            name: 'agreement',
            meta: { title: '合同管理' }
        },{
            path: 'area',
            component: () => import ('@/views/BasicManage/areaList'),
            name: 'areaList',
            meta: { title: '套房管理' }
        },{
            path: 'areaAdd',
            component: () => import ('@/views/BasicManage/areaAdd'),
            name: 'areaAdd',
            meta: { title: '添加套房' }
        },{
            path: 'room',
            component: () => import ('@/views/BasicManage/roomList'),
            name: 'roomList',
            meta: { title: '小房间管理' }
        },{
            path: 'renant',
            component: () => import ('@/views/BasicManage/renantList'),
            name: 'renantList',
            meta: { title: '租客管理' }
        }]
    },

    //统计数据
    {
        path: '/statistics',
        component: Layout,
        children: [{
            path: 'classpractice',
            component: () => import ('@/views/dataStatistics/classPractice'),
            name: 'classpractice',
            meta: { title: '班级练习统计' }
        },{
            path: 'graderank',
            component: () => import ('@/views/dataStatistics/gradeRank'),
            name: 'graderank',
            meta: { title: '年级排名统计' }
        },{
            path: 'teacherstatistic',
            component: () => import ('@/views/dataStatistics/teacherStatistic'),
            name: 'teacherstatistic',
            meta: { title: '教师参测率统计' }
        },{
            path: 'teacherstatisticdetail',
            component: () => import ('@/views/dataStatistics/teacherStatisticDetail'),
            name: 'teacherstatisticdetail',
            meta: { title: '参测率详情' }
        }]
    },

    {
        path: '/error',
        component: Layout,
        redirect: 'noredirect',
        name: 'ErrorPages',
        meta: {
            title: 'errorPages',
            icon: '404'
        },
        children: [{
                path: '401',
                component: () =>
                    import ('@/views/errorPage/401'),
                name: 'Page401',
                meta: { title: 'page401', noCache: true }
            },
            {
                path: '404',
                component: () =>
                    import ('@/views/errorPage/404'),
                name: 'Page404',
                meta: { title: 'page404', noCache: true }
            }
        ]
    },
    // { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
// export const asyncRoutes = [
//     /** 当路由图太长时，可以将其拆分为小模块。 **/
//     componentsRouter,
//     chartsRouter,

//     { path: '*', redirect: '/404', hidden: true }
// ]

const createRouter = () => new Router({
    // mode: 'history', // 需要服务支持
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router