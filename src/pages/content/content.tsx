import { getResourceById, userExchangeResource, userLikeResoucre, userCollectResource } from "../../service/resource";
import { View, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";
import { AtIcon } from "taro-ui";
import { clearUserInfo } from "../../store/modules/user";
import { useAppDispatch } from "../../store";
import './content.scss'


const Content = () => {
  const dispatch = useAppDispatch();
  const [resource, setResource] = useState<IndexResourceType>();

  useLoad((options) => {
    const { id } = options;
    if (id) {
      getResourceInfo(id);
    }
  });

  const getResourceInfo = async (id: number) => {
    const res = await getResourceById(id);
    if (res.code === 0) {
      setResource(res.data);
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none'
      });
    }
  };

  const handleResourceAction = async (action: () => Promise<any>, id: number) => {
    const res = await action();
    if (res.code === 0) {
      Taro.showToast({ title: '操作成功', icon: 'success' });
      getResourceInfo(id);
    } else if (res.code === 3001 || res.code === 401) {
      Taro.showToast({ title: res.msg, icon: 'none' });
      dispatch(clearUserInfo({}));
      Taro.navigateTo({ url: '/pages/login/login' })
    } else {
      Taro.showToast({ title: res.msg, icon: 'none' });
    }
  };

  const handleExchangeResourceClick = async () => {
    handleResourceAction(() => userExchangeResource(+resource!.pkId), +resource!.pkId);
  };

  const handleLikeResourceClick = () => {
    handleResourceAction(() => userLikeResoucre(+resource!.pkId), +resource!.pkId);
  }

  const handleCollectionResourceedClick = () => {
    handleResourceAction(() => userCollectResource(+resource!.pkId), +resource!.pkId);
  }
  return (
    <View className='contentLayout'>
      {resource && (
        <>
          <View className='contentTopBox'>
            <View className='top'>资源分享</View>
            <View className='content'>
              欢迎收藏，感谢分享
            </View>
          </View>
          <View className='contentBox'>
            <View className='title'>{resource.title}</View>
            <View className='info'>
              <View className='dateAndCount'>
                <View className='txt left'>更新时间：{resource.createTime}</View>
                <View className='txt right'>
                  <AtIcon value='heart' color={resource.isLike ? '#1296db' : '#ccc'} size={16}></AtIcon>
                  <Text>{resource.likeNum}</Text>
                </View>
                <View className='txt'>
                  <AtIcon value='download' color={resource.isDownload ? '#1296db' : '#ccc'} size={16}></AtIcon>
                  <Text>{resource.downloadNum}</Text>
                </View>
                <View className='txt'>
                  <AtIcon value='star' color={resource.isCollect ? '#1296db' : '#ccc'} size={16}></AtIcon>
                  <Text>{resource.collectNum}</Text>
                </View>
              </View>
              <View className='row'>
                <View className='txt'>网盘分类：</View>
                <View className='txt'>{resource.diskType}</View>
              </View>
              <View className='row'>
                <View className='txt'>资源类型：</View>
                <View className='tag'>
                  {resource.resType.map((item, index) => (
                    <View key={index} className='tag-item'>
                      {item}
                    </View>
                  ))}
                </View>
              </View>
              <View className='row'>
                <View className='txt'>资源标签：</View>
                <View className='tag'>
                  {resource.tags.map((item, index) => (
                    <View key={index} className='tag-item'>
                      {item}
                    </View>
                  ))}
                </View>
              </View>
              <View className='row'>
                <View className='txt'>资源链接：</View>
                <View className='txt'>
                  {resource.isDownload ? resource.downloadUrl : '没有兑换请先兑换'}
                </View>
              </View>
              <View className='infoContentBox'>
                <View className='txt'>资源详情：</View>
                <View className='infoContent'>{resource.detail}</View>
              </View>
            </View>
          </View>
          {resource.isDownload ? (
            <View className='actionBar'>
              <View className='action'>
                <View className='action-btn' onClick={handleLikeResourceClick}>
                  <AtIcon value='heart' color={resource.isLike ? '#1296db' : '#ccc'} size={20}></AtIcon>
                  <Text>{resource.isLike ? '取消点赞' : '点赞'}</Text>
                </View>
                <View className='action-btn' onClick={handleCollectionResourceedClick}>
                  <AtIcon value='star' color={resource.isCollect ? '#1296db' : '#ccc'} size={20}></AtIcon>
                  <Text>{resource.isCollect ? '取消收藏' : '收藏'}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className='toolbar'>
              <View className='price symbol'>
                <Text className='number'>需要积分{resource.price}</Text>
              </View>
              <View className='button' onClick={handleExchangeResourceClick}>兑换资源</View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Content;
