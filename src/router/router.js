export default [
  {
    path: '/login',
    name: 'Login',
    redirect: 'login/phone_login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    children: [{
      path: 'phone_login',
      name: 'PhoneLogin',
      meta: { isRequired: false, title: '登录' },
      component: () => import(/* webpackChunkName: "phoneLogin" */ '@/views/login/components/phoneLogin')
    },
    {
      path: 'input_code',
      name: 'inputCode',
      meta: { isRequired: false, title: '登录' },
      component: () => import(/* webpackChunkName: "inputCode" */ '@/views/login/components/inputCode/index.vue')
    },
    {
      path: 'register',
      name: 'Register',
      meta: { isRequired: false, title: '注册' },
      component: () => import(/* webpackChunkName: "register" */ '@/views/login/components/Register/index.vue')
    },
    {
      path: 'forget_pwd',
      name: 'ForgetPwd',
      meta: { isRequired: false, title: '忘记密码' },
      component: () => import(/* webpackChunkName: "ForgetPwd" */ '@/views/login/components/forgetPwd/index.vue')
    },
    {
      path: 'scal_login',
      name: 'ScalLogin',
      meta: { isRequired: false, title: '扫码登录' },
      component: () => import(/* webpackChunkName: "scalLogin" */ '@/views/login/components/scalLogin/index.vue')
    }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    meta: { isRequired: true, title: '首页', keepAlive: true, savePosition: true },
    component: () => import(/* webpackChunkName: "Home" */ '@/views/home/index.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    meta: { isRequired: true, title: '发现', keepAlive: true, savePosition: true },
    component: () => import(/* webpackChunkName: "Explore" */ '@/views/explore/index.vue')
  },
  {
    path: '/library',
    name: 'Library',
    meta: { isRequired: true, title: '音乐库', keepAlive: true, savePosition: true },
    component: () => import(/* webpackChunkName: "Library" */ '@/views/library/index.vue')
  },
  {
    path: '/next',
    name: 'Next',
    component: () => import(/* webpackChunkName: "Next" */ '@/views/next/index.vue'),
    meta: {
      keepAlive: true,
      savePosition: true
    }
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: () => import(/* webpackChunkName: "playlist" */ '@/views/playlist/index.vue'),
    meta: { isRequired: true, title: '歌单列表' }
  },
  {
    path: '/daily/songs',
    name: 'dailySongs',
    component: () => import('@/views/dailyTracks'),
    meta: {
      isRequired: true
    }
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('@/views/artist'),
    meta: {
      keepAlive: true,
      savePosition: true
    }
  },
  {
    path: '/album/:id',
    name: 'album',
    component: () => import('@/views/album')
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: () => import('@/views/search'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mv/:id',
    name: 'mv',
    component: () => import('@/views/mv')
  },
  {
    path: '/search/:keywords/:type',
    name: 'searchType',
    component: () => import('@/views/searchType')
  },
  {
    path: '/library/liked-songs',
    name: 'likedSongs',
    component: () => import('@/views/playlist'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/setting')
  }
]
