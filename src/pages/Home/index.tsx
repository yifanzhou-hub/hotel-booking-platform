import React, { useState } from 'react';
import { 
  SearchBar, 
  DatePicker, 
  Button, 
  Swiper,
  Grid,
  Toast
} from 'antd-mobile';
import { SearchOutline, EnvironmentOutline, CalendarOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const Home = () => {
  const navigate = useNavigate();
  
  // 统一的状态管理：将所有搜索参数放在一个对象中
  const [searchParams, setSearchParams] = useState({
    city: '北京',
    keyword: '',  // 添加 keyword 字段
    checkIn: '2026-02-27',
    checkOut: '2026-02-28'
  });

  // Banner轮播图数据
  const banners = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop'
  ];

  // 快捷城市
  const quickCities = ['北京', '上海', '广州', '深圳', '杭州', '成都'];

  // 处理搜索功能
  const handleSearch = () => {
    // 验证日期
    if (searchParams.checkIn >= searchParams.checkOut) {
      Toast.show('离店日期必须晚于入住日期');
      return;
    }

    // 构建查询参数
    const params = new URLSearchParams({
      city: searchParams.city,
      keyword: searchParams.keyword || '',
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut
    }).toString();
    
    // 跳转到列表页
    navigate(`/hotels?${params}`);
  };

  // 处理城市选择
  const handleCitySelect = (city: string) => {
    setSearchParams(prev => ({ ...prev, city }));
    Toast.show(`已选择城市: ${city}`);
  };

  // 处理搜索框输入
  const handleSearchChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value }));
  };

  // 处理日期选择
  const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSearchParams(prev => ({ ...prev, [type]: dateStr }));
  };

  return (
    <div className={styles.container}>
      {/* 顶部搜索栏 */}
      <div className={styles.searchSection}>
        <div 
          className={styles.location}
          onClick={() => Toast.show('城市选择功能开发中')}
        >
          <EnvironmentOutline />
          <span>{searchParams.city}</span>
        </div>
        
        <SearchBar
          placeholder="搜索酒店、地址、商圈..."
          value={searchParams.keyword}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          className={styles.searchBar}
        />
      </div>

      {/* 日期选择 */}
      <div className={styles.dateSection}>
        <DatePicker
          title="入住日期"
          value={new Date(searchParams.checkIn)}
          onConfirm={(date) => handleDateChange('checkIn', date)}
          min={new Date()} // 不能选择今天之前的日期
        >
          {() => (
            <div className={styles.dateItem}>
              <CalendarOutline />
              <span>{searchParams.checkIn}</span>
            </div>
          )}
        </DatePicker>
        
        <div className={styles.dateDivider}>—</div>
        
        <DatePicker
          title="离店日期"
          value={new Date(searchParams.checkOut)}
          onConfirm={(date) => handleDateChange('checkOut', date)}
          min={new Date(searchParams.checkIn)}
        >
          {() => (
            <div className={styles.dateItem}>
              <CalendarOutline />
              <span>{searchParams.checkOut}</span>
            </div>
          )}
        </DatePicker>
      </div>

      {/* Banner轮播图 */}
      <Swiper className={styles.banner} autoplay loop>
        {banners.map((img, index) => (
          <Swiper.Item key={index}>
            <img 
              src={img} 
              alt={`酒店推荐 ${index + 1}`} 
              className={styles.bannerImg} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Hotel+Banner';
              }}
            />
          </Swiper.Item>
        ))}
      </Swiper>

      {/* 快捷城市 */}
      <div className={styles.quickCities}>
        <h3>热门城市</h3>
        <Grid columns={3} gap={16}>
          {quickCities.map(cityName => (
            <Grid.Item key={cityName}>
              <div 
                className={`${styles.cityCard} ${searchParams.city === cityName ? styles.selectedCity : ''}`}
                onClick={() => handleCitySelect(cityName)}
              >
                {cityName}
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      {/* 搜索按钮 */}
      <div className={styles.searchButton}>
        <Button 
          color="primary" 
          block 
          size="large"
          onClick={handleSearch}
          disabled={!searchParams.city}
        >
          搜索酒店
        </Button>
      </div>
    </div>
  );
};

export default Home;