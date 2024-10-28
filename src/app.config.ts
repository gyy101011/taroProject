export default defineAppConfig({

  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/contribute/contribute',
    'pages/my/my',
  ],

  window: {

    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Wechat',
    navigationBarTextStyle: 'black',
  },
  //设置 TabBar
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
});