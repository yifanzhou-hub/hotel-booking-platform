import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Tag, Space, Input, Select, Card, Row, Col, 
  message, Modal, DatePicker, Tooltip, Statistic 
} from 'antd';
import { 
  SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, 
  EditOutlined, ReloadOutlined, LineChartOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './index.module.css';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// 模拟数据
const mockData = Array.from({ length: 35 }, (_, index) => {
  const statuses = ['pending', 'published', 'offline'];
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都'];
  const status = statuses[index % 3];
  
  return {
    id: index + 1,
    name: `${cities[index % 6]}${['王府井', '外滩', '珠江新城', '西湖', '春熙路', '大唐不夜城'][index % 6]}大酒店${index + 1}号店`,
    city: cities[index % 6],
    status: status,
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    price: Math.floor(Math.random() * 400) + 200,
    roomCount: Math.floor(Math.random() * 50) + 20,
    createTime: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
    updateTime: dayjs().subtract(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD'),
  };
});

const HotelReviewPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [loading, setLoading] = useState(false);
   // 定义搜索参数类型
  interface SearchParams {
    keyword: string;
    status: 'all' | 'pending' | 'published' | 'offline';
    city: string;
     dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
;
  }

  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: 'all',
    city: 'all',
    dateRange: null,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: mockData.length,
  });

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            <Tag color="blue">{record.city}</Tag>
            <span style={{ marginLeft: 8 }}>评分: {record.rating}</span>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '待审核', value: 'pending' },
        { text: '已发布', value: 'published' },
        { text: '已下线', value: 'offline' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => {
        const statusMap: any = {
          pending: { text: '待审核', color: 'orange' },
          published: { text: '已发布', color: 'green' },
          offline: { text: '已下线', color: 'red' },
        };
        const config = statusMap[status] || { text: '未知', color: 'gray' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '价格/房量',
      key: 'priceRoom',
      width: 120,
      render: (_: any, record: any) => (
        <div>
          <div>¥{record.price}起</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.roomCount}间房</div>
        </div>
      ),
    },
    {
      title: '时间',
      key: 'time',
      width: 150,
      render: (_: any, record: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>创建: {record.createTime}</div>
          <div>更新: {record.updateTime}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: any) => (
        <div className={styles.operationCell}>
          <Tooltip title="查看详情">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => navigate(`/hotels/${record.id}`)}
            />
          </Tooltip>
          
          <Tooltip title="编辑信息">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => navigate(`/manage/hotels/edit?id=${record.id}`)}
            />
          </Tooltip>
          
          {record.status !== 'published' && (
            <Tooltip title="审核通过">
              <Button 
                icon={<CheckOutlined />} 
                type="primary" 
                size="small"
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}
          
          {record.status !== 'offline' && (
            <Tooltip title="下线酒店">
              <Button 
                icon={<CloseOutlined />} 
                danger 
                size="small"
                onClick={() => handleOffline(record.id)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // 处理搜索
  const handleSearch = () => {
    setLoading(true);
    
    let filtered = [...data];
    
    // 关键词搜索（名称或城市）
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.city.toLowerCase().includes(keyword)
      );
    }
    
    // 状态筛选
    if (searchParams.status !== 'all') {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }
    
    // 城市筛选
    if (searchParams.city !== 'all') {
      filtered = filtered.filter(item => item.city === searchParams.city);
    }
    
    // 日期筛选
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createDate = dayjs(item.createTime);
        return createDate.isAfter(start) && createDate.isBefore(end);
      });
    }
    
    // 模拟网络延迟
    setTimeout(() => {
      setFilteredData(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: 'all',
      city: 'all',
      dateRange: null,
    });
    setFilteredData(mockData);
    setPagination(prev => ({ ...prev, total: mockData.length, current: 1 }));
  };

  // 审核通过
  const handleApprove = (id: number) => {
    Modal.confirm({
      title: '确认审核通过',
      content: '确定要通过该酒店的审核并发布吗？',
      onOk: () => {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'published' } : item
        ));
        setFilteredData(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'published' } : item
        ));
        message.success('酒店审核通过并已发布！');
      },
    });
  };

  // 下线酒店
  const handleOffline = (id: number) => {
    Modal.confirm({
      title: '确认下线酒店',
      content: '确定要将该酒店下线吗？下线后用户将无法看到该酒店。',
      onOk: () => {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'offline' } : item
        ));
        setFilteredData(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'offline' } : item
        ));
        message.success('酒店已下线！');
      },
    });
  };

  // 统计信息
  const stats = {
    total: data.length,
    pending: data.filter(item => item.status === 'pending').length,
    published: data.filter(item => item.status === 'published').length,
    offline: data.filter(item => item.status === 'offline').length,
  };

  // 表格分页变化
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // 初始化加载
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>酒店信息审核</h1>
        <p className={styles.subTitle}>管理所有酒店的审核、发布和下线操作</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="酒店总数" value={stats.total} prefix={<LineChartOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待审核" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已发布" value={stats.published} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已下线" value={stats.offline} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* 搜索栏 */}
      <Card className={styles.searchBar}>
        <Row gutter={16} className={styles.searchBarRow}>
          <Col span={8}>
            <Search
              placeholder="搜索酒店名称或城市"
              value={searchParams.keyword}
              onChange={e => setSearchParams({ ...searchParams, keyword: e.target.value })}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="状态筛选"
              value={searchParams.status}
              onChange={value => setSearchParams({ ...searchParams, status: value })}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待审核</Option>
              <Option value="published">已发布</Option>
              <Option value="offline">已下线</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="城市筛选"
              value={searchParams.city}
              onChange={value => setSearchParams({ ...searchParams, city: value })}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="all">全部城市</Option>
              {['北京', '上海', '广州', '深圳', '杭州', '成都'].map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              size="large"
              value={searchParams.dateRange}
              onChange={dates => setSearchParams({ ...searchParams, dateRange: dates })}
            />
          </Col>
          <Col span={2}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset} 
              block 
              size="large"
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default HotelReviewPage;