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
  Divider,
  Toast
} from 'antd-mobile';
import { 
  FilterOutline, 
  EnvironmentOutline, 
  CalendarOutline,
  StarFill,
  DownOutline 
} from 'antd-mobile-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockHotelList } from './mockData'; 
import styles from './index.module.css';

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. 从URL查询参数初始化搜索条件 (这是数据流的起点)
  const queryParams = new URLSearchParams(location.search);
  const initialSearchParams = {
    city: queryParams.get('city') || '北京',
    checkIn: queryParams.get('checkIn') || '2026-02-27', // 建议更新为接近的日期
    checkOut: queryParams.get('checkOut') || '2026-02-28',
    keyword: queryParams.get('keyword') || '',
  };
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  // 2. 筛选状态 (用于列表页顶部的快捷筛选)
  const [filters, setFilters] = useState({
    priceRange: [200, 800] as [number, number],
    starRating: [] as number[],
    facilities: [] as string[],
    sortBy: 'default' as 'default' | 'priceAsc' | 'priceDesc' | 'rating',
  });

  // 3. 列表数据 & 分页 (存储经过筛选的最终结果)
  const [filteredAndSortedHotels, setFilteredAndSortedHotels] = useState<any[]>([]);
  const [displayHotels, setDisplayHotels] = useState<any[]>([]); // 当前显示的数据（用于无限滚动）
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const pageSize = 10;

  // 4. 详细筛选面板的显示状态
  const [filterVisible, setFilterVisible] = useState(false);

  // ========== 核心：数据筛选与排序函数 ==========
  const filterAndSortHotels = useCallback(() => {
    let result = [...mockHotelList];

    // 1) 根据URL参数（来自首页）进行筛选
    if (searchParams.city && searchParams.city !== '全部') {
      // 假设 mockHotelList 中的对象有 `city` 属性
      result = result.filter(hotel => hotel.city === searchParams.city);
    }
    if (searchParams.keyword) {
      const kw = searchParams.keyword.toLowerCase();
      result = result.filter(hotel => 
        hotel.name.toLowerCase().includes(kw) || 
        hotel.address.toLowerCase().includes(kw)
      );
    }

    // 2) 根据列表页顶部的筛选器进行筛选 (这里以价格为例)
    const [minPrice, maxPrice] = filters.priceRange;
    result = result.filter(hotel => hotel.price >= minPrice && hotel.price <= maxPrice);

    if (filters.starRating.length > 0) {
      result = result.filter(hotel => filters.starRating.includes(Math.floor(hotel.rating)));
    }

    // 3) 排序
    switch (filters.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
   
      default:
        // 默认排序，例如按ID或评分
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredAndSortedHotels(result);
    // 重置分页
    pageRef.current = 1;
    const initialDisplay = result.slice(0, pageSize);
    setDisplayHotels(initialDisplay);
    setHasMore(initialDisplay.length >= pageSize && initialDisplay.length < result.length);

  }, [searchParams, filters]); // 当搜索参数或筛选条件变化时重新执行

  // ========== 副作用：当筛选条件变化时，重新计算数据 ==========
  useEffect(() => {
    filterAndSortHotels();
  }, [filterAndSortHotels]); // 依赖项是 memoized 的函数

  // ========== 无限滚动加载更多 ==========
  const loadMore = useCallback(async () => {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = pageRef.current * pageSize;
    const end = start + pageSize;
    const newData = filteredAndSortedHotels.slice(start, end);
    
    if (newData.length > 0) {
      setDisplayHotels(prev => [...prev, ...newData]);
      pageRef.current += 1;
      setHasMore(end < filteredAndSortedHotels.length);
    } else {
      setHasMore(false);
    }
  }, [filteredAndSortedHotels]); // 依赖筛选后的总数据

  // ========== 事件处理函数 ==========
  // 处理顶部搜索框变化
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value }));
    // 注意：filterAndSortHotels 会通过 useEffect 自动触发
  };

  // 处理列表页内筛选变化
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // 注意：filterAndSortHotels 会通过 useEffect 自动触发
  };

  // 处理城市选择 (简单示例)
  const handleCitySelect = (city: string) => {
    setSearchParams(prev => ({ ...prev, city }));
    Toast.show(`已切换至: ${city}`);
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
            <Tag key={index}fill='outline' className={styles.facilityTag}>
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
          <div className={styles.locationSelector}
            onClick={() => handleCitySelect(searchParams.city === '北京' ? '上海' : '北京')}
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
            onClick={() => Toast.show(`入住: ${searchParams.checkIn} - 离店: ${searchParams.checkOut}`)}
          >
            <CalendarOutline />
            {searchParams.checkIn} - {searchParams.checkOut}
          </Tag>
        </div>

      </div>

      {/* 酒店列表 */}
      <div className={styles.listContainer}>
        <List>
          {displayHotels.map(hotel => renderHotelCard(hotel))}
        </List>
        
        {/* 无限滚动加载组件 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={250}>
          <div className={styles.loadingText}>
            {hasMore ? '加载中...' : filteredAndSortedHotels.length === 0 ? '未找到符合条件的酒店' : '没有更多了'}
          </div>
        </InfiniteScroll>
      </div>

      {/* 详细筛选面板（模态框） */}
    
      {filterVisible && (
        <div className={styles.filterPanel}>
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