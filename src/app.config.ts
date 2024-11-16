export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contribute/contribute',
    'pages/login/login',
    'pages/my/my',
    'pages/notice/notice',
    'pages/noticeDetail/noticeDetail',
    'pages/content/content',
    'pages/search/search',
    'pages/searchResult/searchResult',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#333',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: 'static/tabs/home_default.png',
        selectedIconPath: 'static/tabs/home_selected.png',
      },
      {
        text: '投稿',
        pagePath: 'pages/contribute/contribute',
        iconPath: 'static/tabs/contribute_default.png',
        selectedIconPath: 'static/tabs/contribute_selected.png',
      },
      {
        text: '我的',
        pagePath: 'pages/my/my',
        iconPath: 'static/tabs/my_default.png',
        selectedIconPath: 'static/tabs/my_selected.png',
      },
    ],
  },
})
