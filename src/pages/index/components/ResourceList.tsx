import { ScrollView, View } from "@tarojs/components"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import ResourceItem from "../components/resourceItem/resourceItem"
import { getCategoryList } from "src/service/contribute"
import { getIndexResourceList } from "src/service/resource"
import Taro from "@tarojs/taro"
import './resourceList.scss'
// const ResourceList = () => {
//   const [pageParams, setPageParams] = useState({
//     resType: 1,
//   });

//   const selectList = [
//     {
//       pkId: 1,
//       title: '动漫区',
//     },
//     {
//       pkId: 2,
//       title: '学习区',
//     },
//     {
//       pkId: 3,
//       title: '摄影区',
//     },
//     {
//       pkId: 4,
//       title: '全栈区',
//     },
//   ];
//   return (
//     <View className='resourceList'>
//       <ScrollView scrollX className='scroll-view' scrollWithAnimation>
//         {selectList.map(item => (
//           <View
//             key={item.pkId}
//             className={`scroll-view-item ${pageParams.resType === item.pkId ? 'active' : ''}`}
//             onClick={() => setPageParams({resType : item.pkId})}
//           >
//             {item.title}
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };
interface ResourceListProps {

}

export interface ResourceListRef {
  resetData: () => void
  getIndexResourceListData: () => void
}
const ResourceList = forwardRef<ResourceListRef, ResourceListProps>((_props, ref) => {
  const [pageParams, setPageParams] = useState({
    resType: 0,
    page: 1,
    limit: 10,
  })
  const [resourceList, setResourceList] = useState<IndexResource>({
    list: [],
    total: 0,
  })

  const finish = useRef(false)
  const getIndexResourceListData = async (params?: {
    resType: number
    page: number
    limit: number
  }) => {
    if (finish.current) {
      Taro.showToast({ icon: 'none', title: '没有更多数据~' })
      return
    }
    const res = await getIndexResourceList(params || pageParams)
    setResourceList(prev => ({
      total: res.data.total,
      list: [...prev.list, ...res.data.list],
    }))
    if (resourceList.list.length >= res.data.total) {
      finish.current = true
    }
    setPageParams(prev => ({
      ...prev,
      page: prev.page + 1
    }))
  }
  const resetData = () => {
    setPageParams({
      resType: 0,
      page: 1,
      limit: 10,
    })
    setResourceList({
      total: 0,
      list: [],
    })
    finish.current = false
  }
  useEffect(() => {
    getIndexResourceListData();
  }, [])

  useEffect(() => {
    getIndexCategoryListData();
  }, [])

  const handleSelectChange = (pkId: number) => {
    resetData()
    setPageParams(prevParams => {
      const newParams = { ...prevParams, resType: pkId, page: 1 };
      getIndexResourceListData(newParams);
      return newParams;
    });
  }

  const [selectList, setSelectList] = useState<CategoryType[]>([])
  const getIndexCategoryListData = async () => {
    const res = await getCategoryList()
    if (res.code === 0) {
      const filteredList = res.data.filter(item => item.type === 1).slice(0, 8)
      setSelectList([{ title: '推荐', pkId: 0, type: 0 }, ...filteredList])
    }
  }
  useImperativeHandle(ref, () => ({
    resetData,
    getIndexResourceListData,
  }))
  return (
    <View className='resourceList' >
      <ScrollView scrollX className='scroll-view' scrollWithAnimation>
        {selectList.map(item => (
          <View
            key={item.pkId}
            className={`scroll-view-item ${pageParams.resType === item.pkId ? 'active' : ''}`}
            onClick={() => handleSelectChange(item.pkId)}
          >
            {item.title}
          </View>
        ))}
      </ScrollView>
      {/*数据展示*/}
      {resourceList.list.map((item, index) => (
        <ResourceItem key={index} resource={item} />
      ))}
      <View className='loading-text'>{finish.current ? '没有更多数据~' : '正在加载...'}</View>
    </View >
  )
})
ResourceList.displayName = 'ResourceList';

export default ResourceList;
