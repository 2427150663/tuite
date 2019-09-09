import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/HomePage'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/HomePage',
                    component: resolve => require(['../components/page/HomePage.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/Release',
                    component: resolve => require(['../components/page/Release.vue'], resolve),
                    meta: { title: '发布推特' }
                },
                {
                    path: '/Commentary',
                    component: resolve => require(['../components/page/Commentary.vue'], resolve),
                    meta: { title: '推特跟评' }
                },
                {
                    path: '/AccountCenter',
                    component: resolve => require(['../components/page/AccountCenter.vue'], resolve),
                    meta: { title: '账号中心' }
                },
                {
                    path: '/AccountCancellation',
                    component: resolve => require(['../components/page/AccountCancellation.vue'], resolve),
                    meta: { title: '账号解封' }
                },
                {
                    path: '/Operationlog',
                    component: resolve => require(['../components/page/Operationlog.vue'], resolve),
                    meta: { title: '操作日志' }
                },
                {
                    path: '/ReleaseList',
                    component: resolve => require(['../components/page/ReleaseList.vue'], resolve),
                    redirect: "/ReleaseExecuting",
                    meta: { title: '发布列表' },
                    children: [
                        {
                            path: "/ReleaseExecuting",
                            component: resolve => require(['../components/common/ReleaseExecuting.vue'], resolve),
                            meta: { title: 'CommentaryList' }
                        },
                        {
                            path: '/ReleaseFinished',
                            component: resolve => require(['../components/common/ReleaseFinished.vue'], resolve),
                            meta: { title: 'CommentaryList' }
                        }
                    ]
                },
                {
                    path: '/CommentaryList',
                    component: resolve => require(['../components/page/CommentaryList.vue'], resolve),
                    meta: { title: 'CommentaryList' },
                    redirect: "/CommentaryExecuting",
                    children: [
                        {
                            path: "/CommentaryExecuting",
                            component: resolve => require(['../components/common/CommentaryExecuting.vue'], resolve),
                            meta: { title: 'CommentaryList' }
                        },
                        {
                            path: '/CommentaryFinished',
                            component: resolve => require(['../components/common/CommentaryFinished.vue'], resolve),
                            meta: { title: 'CommentaryList' }
                        }
                    ]
                },
                {
                    path: '/Collection',
                    component: resolve => require(['../components/page/Collection.vue'], resolve),
                    meta: { title: 'Collection' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/Details',
                    component: resolve => require(['../components/common/Details.vue'], resolve),
                },
                {
                    path: '/CommentaryDetails',
                    component: resolve => require(['../components/common/CommentaryDetails.vue'], resolve),
                },
                {
                    path: '/Yucai',
                    component: resolve => require(['../components/page/Yucai.vue'], resolve)
                }
            ]
        }
    ]
})
