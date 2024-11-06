import { View, Text, RichText, Navigator, ScrollView } from '@tarojs/components';
import { useEffect, useState } from 'react';

import { getNoticePage } from '../../service/notice';
import Taro from '@tarojs/taro';
import './notice.scss';

const Notice = () => {
  // const [noticeList, setNoticeList] = useState<IndexNotice>({
  //   list: [
  //     {
  //       pkId: 1,
  //       createTime: '2024-01-01',
  //       title: '资源分享应用维护',
  //       content: '<p>资源分享应用维护</p>',
  //       adminId: 1,
  //       isTop: 0,
  //       adminName: 'admin',
  //     },
  //     {
  //       pkId: 2,
  //       createTime: '2024-01-01',
  //       title: '资源分享应用关闭',
  //       content: '<p>资源分享应用关闭</p>',
  //       adminId: 1,
  //       isTop: 0,
  //       adminName: 'admin',
  //     }
  //   ],
  //   total: 0,
  // });
  const [noticeList, setNoticeList] = useState<IndexNotice>({
    list: [],
    total: 0
  });
  const [finish, setFinish] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getAllNotice = async () => {
    if (!finish) {
      try {
        const res = await getNoticePage({
          page,
          limit
        });

        setNoticeList(prev => {
          const newList = [...prev.list, ...res.data.list];
          const newTotal = res.data.total;

          console.log('查询条件：', page, limit);

          const isFinished = newList.length >= newTotal;
          if (isFinished) {
            setFinish(true);
          }

          if (newList.length <= newTotal) {
            setPage(pre => pre + 1);
          }

          return {
            list: newList,
            total: newTotal
          };
        });
      } catch (error) {
        console.error('获取公告列表失败', error);
        Taro.showToast({ title: '加载失败，请重试', icon: 'none' });
      }
    } else {
      Taro.showToast({ title: '没有更多数据', icon: 'none' });
    }
  };

  useEffect(() => {
    getAllNotice();
  }, []);

  const handleReachBottom = () => {
    console.log('触底了');
    getAllNotice();
  };

  return (
    <ScrollView scrollY
      onScrollToLower={handleReachBottom}
      style={{ height: '100vh' }} className='noticePage'
    >
      {noticeList.list.map((item) => (
        <View className='item-card' key={item.pkId}>
          <View className='time'>{item.createTime}</View>
          <View className='content-card'>
            <View className='top'>
              <View className='tips'>{item.title}</View>
              <RichText className='content' nodes={item.content} />
            </View>
            <View className='bottom'>
              <Navigator
                url={`/pages/noticeDetail/noticeDetail?id=${item.pkId}`}
                className='more'
              >
                查看详情 &gt;
              </Navigator>
            </View>
          </View>
        </View>
      ))}
      <View className='loading-text'>
        {finish ? '没有更多数据' : '加载中...'}
      </View>
    </ScrollView>
  );
};

export default Notice;
