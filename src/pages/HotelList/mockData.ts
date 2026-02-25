export const mockHotelList = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `北京王府井大酒店 ${index + 1}号店`,
  rating: 4.5 + Math.random() * 0.5,
  reviewCount: Math.floor(Math.random() * 1000) + 100,
  address: `北京市东城区王府井大街${index + 1}号`,
  price: Math.floor(Math.random() * 500) + 300,
  originalPrice: Math.floor(Math.random() * 200) + 800,
  discount: Math.floor(Math.random() * 100) + 20,
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
}));