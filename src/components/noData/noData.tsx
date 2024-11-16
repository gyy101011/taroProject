import { View , Image , Text} from "@tarojs/components"
import './noData.scss'

const NoData = () => {
  return (
    <View className='noData'>
      <View className='img'>
        <Image src='src\static\images\12.gif' mode='aspectFit'>
        </Image>
      </View>
      <Text className='text'>暂无数据</Text>
    </View>
  )
};

export default NoData;
