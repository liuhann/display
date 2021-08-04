import { Pagination } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
export default {
  component: Pagination,
  description: '采用分页的形式分隔长列表，适用场合当加载/渲染所有数据将花费很多时间时；可切换页码浏览数据。',
  d: PaginationProps
}
