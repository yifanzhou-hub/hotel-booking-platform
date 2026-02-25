// src/pages/HotelList/index.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  SearchBar, 
  DatePicker, 
 
  Grid, 
  List, 
  InfiniteScroll,
  Selector,
  Tag,
  Divider
} from 'antd-mobile';
import { 
  FilterOutline, 
  EnvironmentOutline, 
  CalendarOutline,
  StarFill,
  DownOutline 
} from 'antd-mobile-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockHotelList } from './mockData'; // 我们马上创建这个模拟数据文件
import styles from './index.module.css';

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从URL查询参数或默认值初始化搜索条件
  const queryParams = new URLSearchParams(location.search);
  const [searchParams, setSearchParams] = useState({
    city: queryParams.get('city') || '北京',
    checkIn: queryParams.get('checkIn') || '2024-02-27',
    checkOut: queryParams.get('checkOut') || '2024-02-28',
    keyword: queryParams.get('keyword') || '',
  });

  // 筛选状态
  const [filters, setFilters] = useState({
    priceRange: [200, 800] as [number, number],
    starRating: [] as number[],
    facilities: [] as string[],
    sortBy: 'default' as 'default' | 'priceAsc' | 'priceDesc' | 'rating',
  });

  // 列表数据 & 分页
  const [hotels, setHotels] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const pageSize = 10;

  // 详细筛选面板的显示状态
  const [filterVisible, setFilterVisible] = useState(false);

  // 初始化加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // 模拟首次加载
    const initialData = mockHotelList.slice(0, pageSize);
    setHotels(initialData);
    pageRef.current = 2;
    setHasMore(initialData.length >= pageSize);
  };

  // 加载更多的函数（用于 InfiniteScroll 组件）
  const loadMore = useCallback(async () => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = (pageRef.current - 1) * pageSize;
    const end = start + pageSize;
    const newData = mockHotelList.slice(start, end);
    
    if (newData.length > 0) {
      setHotels(prev => [...prev, ...newData]);
      pageRef.current += 1;
      setHasMore(end < mockHotelList.length);
    } else {
      setHasMore(false);
    }
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value }));
    // 在实际项目中，这里会触发重新查询
  };

  // 处理筛选变化
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // 重置分页并重新加载数据
    pageRef.current = 1;
    setHotels([]);
    // 这里应该触发带有筛选条件的重新查询
    setTimeout(() => {
      loadInitialData();
    }, 300);
  };

  // 跳转到详情页
  const goToDetail = (id: number) => {
    navigate(`/hotels/${id}`);
  };

  // 渲染酒店卡片
  const renderHotelCard = (hotel: any) => (
    <div 
      key={hotel.id} 
      className={styles.hotelCard}
      onClick={() => goToDetail(hotel.id)}
    >
      <div className={styles.hotelImageContainer}>
        <img src={hotel.images[0]} alt={hotel.name} className={styles.hotelImage} />
        <Tag className={styles.discountTag} color='danger'>
          立减{hotel.discount}元
        </Tag>
      </div>
      
      <div className={styles.hotelInfo}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>¥{hotel.price}</span>
            <span className={styles.originalPrice}>¥{hotel.originalPrice}</span>
          </div>
        </div>
        
       <div style={{ display: 'flex', alignItems: 'center' }} className={styles.ratingSection}>
         <StarFill className={styles.starIcon} />
        <span className={styles.rating}>{hotel.rating}</span>
        <span className={styles.reviewCount}>({hotel.reviewCount}条评价)</span>
         <Tag color='primary' fill='outline'>
      {hotel.type}
          </Tag>

        </div>

        
        <p className={styles.address}>
          <EnvironmentOutline /> {hotel.address}
        </p>
        
        <div className={styles.facilities}>
          {hotel.facilities.slice(0, 3).map((facility: string, index: number) => (
            <Tag key={index} fill='outline' className={styles.facilityTag}>
              {facility}
            </Tag>
          ))}
          {hotel.facilities.length > 3 && (
            <span className={styles.moreFacilities}>等{hotel.facilities.length}项设施</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 顶部固定搜索栏 */}
      <div className={styles.stickyHeader}>
       <div style={{ display: 'flex', alignItems: 'center' }} className={styles.searchBar}>
  <div 
    className={styles.locationSelector}
    onClick={() => {/* 实现城市选择 */}}
  >
    <EnvironmentOutline />
    <span>{searchParams.city}</span>
    <DownOutline fontSize={12} />
  </div>
  
  <SearchBar
    placeholder='酒店名、地点、关键词'
    value={searchParams.keyword}
    onChange={handleSearch}
    className={styles.searchInput}
  />
  
  <div 
    className={styles.filterButton}
    onClick={() => setFilterVisible(true)}
  >
    <FilterOutline />
  </div>
</div>


        {/* 快捷筛选条件 */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }} className={styles.quickFilters}>
  <Selector
    style={{ '--border-radius': '20px' }}
    columns={3}
    options={[
      { label: '价格最低', value: 'priceAsc' },
      { label: '评分最高', value: 'rating' },
      { label: '距离最近', value: 'distance' },
    ]}
    value={[filters.sortBy]}
    onChange={(v) => v.length > 0 && handleFilterChange('sortBy', v[0])}
  />
  
  <Divider direction='vertical' className={styles.divider} />
  
  <Tag 
    className={styles.dateTag}
    onClick={() => {/* 实现日期选择 */}}
  >
    <CalendarOutline />
    {searchParams.checkIn} - {searchParams.checkOut}
  </Tag>
</div>

      </div>

      {/* 酒店列表 */}
      <div className={styles.listContainer}>
        <List>
          {hotels.map(hotel => renderHotelCard(hotel))}
        </List>
        
        {/* 无限滚动加载组件 - 这是实现"上滑自动加载"的关键 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={250}>
          <div className={styles.loadingText}>
            {hasMore ? '加载中...' : '没有更多了'}
          </div>
        </InfiniteScroll>
      </div>

      {/* 详细筛选面板（模态框） */}
      {/* 由于实现较复杂，这里先预留位置，你可以后续完善 */}
      {filterVisible && (
        <div className={styles.filterPanel}>
          {/* 筛选面板内容 */}
          <div className={styles.filterHeader}>
            <span>筛选条件</span>
            <button onClick={() => setFilterVisible(false)}>关闭</button>
          </div>
          {/* 这里可以添加价格滑块、星级选择等 */}
        </div>
      )}
    </div>
  );
};

export default HotelList;