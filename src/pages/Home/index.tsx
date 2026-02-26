// src/pages/Home/index.tsx
import React, { useState } from 'react';
import { 
  SearchBar, 
  DatePicker, 
  Button, 
  Swiper,
  Grid,
  NavBar 
} from 'antd-mobile';
import { SearchOutline, EnvironmentOutline, CalendarOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('北京');
  const [dateRange, setDateRange] = useState(['2026-02-27', '2026-02-28']);

  const handleSearch = () => {
    // 跳转到列表页，携带搜索参数
    navigate(`/hotels?city=${city}&checkIn=${dateRange[0]}&checkOut=${dateRange[1]}`);
  };

  // Banner轮播图数据
  const banners = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w-800',
    'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w-800'
  ];

  // 快捷城市
  const quickCities = ['北京', '上海', '广州', '深圳', '杭州', '成都'];

  return (

    <div className={styles.container}>
      {/* 顶部搜索栏 */}
      <div className={styles.searchSection}>
        <div className={styles.location} onClick={() => {/* 选择城市 */}}>
          <EnvironmentOutline />
          <span>{city}</span>
        </div>
        <SearchBar
          placeholder="搜索酒店、地址、商圈..."
          className={styles.searchBar}
        />
      </div>

      {/* 日期选择 */}
      <div className={styles.dateSection}>
        <DatePicker
          title="入住日期"
          value={new Date(dateRange[0])}
         onConfirm={date => setDateRange([date.toISOString().split('T')[0], dateRange[1]])}
        >
          {() => (
            <div className={styles.dateItem}>
              <CalendarOutline />
              <span>{dateRange[0]}</span>
            </div>
          )}
        </DatePicker>
        <div className={styles.dateDivider}>—</div>
        <DatePicker
          title="离店日期"
          value={new Date(dateRange[1])}
          onConfirm={date => setDateRange([dateRange[0], date.toISOString().split('T')[0]])}
        >
          {() => (
            <div className={styles.dateItem}>
              <CalendarOutline />
              <span>{dateRange[1]}</span>
            </div>
          )}
        </DatePicker>
      </div>

      {/* Banner轮播图 */}
      <Swiper className={styles.banner} autoplay loop>
        {banners.map((img, index) => (
          <Swiper.Item key={index}>
            <img src={img} alt={`banner-${index}`} className={styles.bannerImg} />
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
                className={styles.cityCard}
                onClick={() => setCity(cityName)}
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
        >
          搜索酒店
        </Button>
      </div>
    </div>
  );
};

export default Home;