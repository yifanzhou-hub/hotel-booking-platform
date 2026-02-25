const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '重庆'];
const hotelTypes = ['经济型', '舒适型', '豪华型', '商务型', '度假型', '民宿'];
const hotelNames = [
  '王府井大酒店', '外滩华尔道夫', '珠江新城威斯汀', 
  '西湖国宾馆', '春熙路君悦', '大唐不夜城酒店'
];

export const mockHotelList = Array.from({ length: 50 }, (_, index) => {
  const city = cities[index % cities.length];
  const type = hotelTypes[index % hotelTypes.length];
  const name = `${city}${hotelNames[index % hotelNames.length]}${index % 5 + 1}号店`;
  
  return {
    id: index + 1,
    name,
    rating: Number((4 + Math.random()).toFixed(1)), // 4.0-5.0的评分
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    address: `${city}${['区', '路', '大街'][index % 3]}${index + 1}号`,
    price: Math.floor(Math.random() * 400) + 200,
    originalPrice: Math.floor(Math.random() * 200) + 600,
    discount: Math.floor(Math.random() * 80) + 20,
  type: ['经济型', '舒适型', '豪华型', '商务型'][index % 4],
  images: [
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&${index}`,
    `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&${index}`,
  ],
  facilities: [
    '免费WiFi',
    '停车场',
    '游泳池',
    '健身房',
    '餐厅',
    '商务中心',
    '会议室',
    '洗衣服务'
  ].slice(0, Math.floor(Math.random() * 5) + 3),
  latitude: 39.9042 + Math.random() * 0.1,
  longitude: 116.4074 + Math.random() * 0.1,
  distance: (Math.random() * 10).toFixed(1) + 'km',
}
});