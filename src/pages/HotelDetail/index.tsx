import React, { useState } from 'react';
import {
  NavBar,
  Swiper,
  Image,

  Grid,
  Tag,
  DatePicker,
  Stepper,
  List,
  Button,
  Toast,
  Divider,
  Card
} from 'antd-mobile';
import { LeftOutline, StarFill, EnvironmentOutline, CheckCircleOutline } from 'antd-mobile-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockHotelDetail } from './mockData'; // 需要创建的模拟数据
import styles from './index.module.css';

const HotelDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // 从URL获取酒店ID
  const [hotel] = useState(mockHotelDetail); // 实际开发中应根据id请求数据
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date('2024-02-27'),
    new Date('2024-02-28'),
  ]);
  const [roomCount, setRoomCount] = useState(1);
  const [guestCount, setGuestCount] = useState(2);

  // 房型列表，应按价格从低到高排序
  const roomTypes = [
    { id: 1, name: '高级大床房', facilities: ['免费WiFi', '早餐'], price: 599, originalPrice: 799 },
    { id: 2, name: '豪华双床房', facilities: ['免费WiFi', '早餐', '海景'], price: 899, originalPrice: 1099 },
    { id: 3, name: '行政套房', facilities: ['免费WiFi', '早餐', '海景', '行政酒廊'], price: 1299, originalPrice: 1599 },
  ];

  const handleBook = (roomId: number) => {
    Toast.show(`预订房型 ${roomId} 成功！`);
    // 实际应跳转到订单确认页
  };

return (
    <div className={styles.container}>
      {/* 1. 顶部导航头 */}
      <NavBar
        className={styles.navBar}
        back={<LeftOutline />}
        onBack={() => navigate(-1)}
        backArrow={true}
      >
        {hotel.name}
      </NavBar>

      {/* 2. 大图Banner */}
      <Swiper className={styles.banner} loop autoplay>
        {hotel.images.map((img, index) => (
          <Swiper.Item key={index}>
            <Image src={img} className={styles.bannerImg} fit='cover' />
          </Swiper.Item>
        ))}
      </Swiper>

      <div className={styles.content}>
        {/* 3. 酒店基础信息 */}
        <div className={styles.baseInfo}>
          <h1 className={styles.hotelName}>{hotel.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center' }} className={styles.ratingRow}>
            <StarFill className={styles.starIcon} />
            <span className={styles.rating}>{hotel.rating}</span>
            <span className={styles.reviewCount}>({hotel.reviewCount}条评价)</span>
            <Tag color='primary' fill='outline'>{hotel.type}</Tag>
          </div>
          
          <p className={styles.address}>
            <EnvironmentOutline /> {hotel.address}
          </p>
          
          <Divider />
          
          <div className={styles.facilities}>
            <h3>酒店设施</h3>
            <Grid columns={4} gap={16}>
              {hotel.facilities.map((facility, index) => (
                <Grid.Item key={index}>
                  <div className={styles.facilityItem}>
                    <CheckCircleOutline />
                    <span>{facility}</span>
                  </div>
                </Grid.Item>
              ))}
            </Grid>
          </div>
        </div>  {/* 这里闭合 baseInfo */}

        {/* 4. 日历+人间夜选择 */}
        <Card className={styles.bookingCard}>
          <h3>选择日期与房客</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }} className={styles.dateSelector}>
            <DatePicker
              title='入住日期'
              value={dateRange[0]}
              onConfirm={date => setDateRange([date, dateRange[1]])}
            >
              {(value) => <div className={styles.dateBox}>入住<br/>{value?.toLocaleDateString()}</div>}
            </DatePicker>
            <div className={styles.dateDivider}>—</div>
            <DatePicker
              title='离店日期'
              value={dateRange[1]}
              onConfirm={date => setDateRange([dateRange[0], date])}
            >
              {(value) => <div className={styles.dateBox}>离店<br/>{value?.toLocaleDateString()}</div>}
            </DatePicker>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }} className={styles.guestSelector}>
            <div>
              <div>房间数</div>
              <Stepper min={1} max={5} value={roomCount} onChange={setRoomCount} />
            </div>
            <div>
              <div>住客数</div>
              <Stepper min={1} max={10} value={guestCount} onChange={setGuestCount} />
            </div>
          </div>
        </Card>  {/* 这里闭合 Card */}

        {/* 5. 房型价格列表 */}
        <div className={styles.roomList}>
          <h3>可订房型</h3>
          <List>
            {roomTypes.sort((a, b) => a.price - b.price).map(room => (
              <List.Item
                key={room.id}
                prefix={
                  <div className={styles.roomInfo}>
                    <div className={styles.roomName}>{room.name}</div>
                    <div className={styles.roomFacilities}>
                      {room.facilities.map(f => <Tag key={f} >{f}</Tag>)}
                    </div>
                  </div>
                }
                extra={
                  <div className={styles.priceSection}>
                    <div className={styles.currentPrice}>¥{room.price}</div>
                    <div className={styles.originalPrice}>¥{room.originalPrice}</div>
                    <Button color='primary' size='small' onClick={() => handleBook(room.id)}>
                      预订
                    </Button>
                  </div>
                }
              >
              </List.Item>
            ))}
          </List>
        </div>
      </div>  {/* 这里闭合 content */}

      {/* 底部预订栏 */}
      <div className={styles.bottomBar}>
        <div className={styles.priceSummary}>
          <span>总计：</span>
          <span className={styles.totalPrice}>¥{roomTypes[0].price * roomCount}</span>
        </div>
        <Button color='primary' block size='large' className={styles.bookButton}>
          立即预订
        </Button>
      </div>
    </div>  // 闭合 container
  );
};

export default HotelDetail;