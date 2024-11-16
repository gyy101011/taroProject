import { http } from '../utils/http'

export const getNoticeSwiper = () => {
  return http<SwiperItem[]>({
    method: 'GET',
    url: '/notice/swiper',
  })
}

export const getIndexNotice = () => {
  return http<SwiperItem[]>({
    method: 'GET',
    url: '/notice/index',
  })
}

export const getNoticePage = (data: PageParams) => {
  return http<IndexNotice>({
    method: 'POST',
    url: '/notice/page',
    data,
  })
}

export const getNoticeById = (id: number) => {
  return http<NoticeItem>({
    method: 'GET',
    url: '/notice/detail/' + id,
  })
}
