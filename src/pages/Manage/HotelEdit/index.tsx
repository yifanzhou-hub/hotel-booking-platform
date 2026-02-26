import React, { useState } from 'react';

import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  DatePicker,
  InputNumber,
  Select,
  message,
  Space,
  Table,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const { Option } = Select;
const { TextArea } = Input;


// 定义房型类型
interface RoomType {
  id: number;
  name: string;
  area: number;
  bed: string;
  facilities: string[];
  price: number;
}

const HotelEditPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState([]);
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: '标准大床房', area: 30, bed: '大床1.8m', facilities: ['WiFi', '空调'], price: 399 },
    { id: 2, name: '豪华双床房', area: 45, bed: '双床1.2m', facilities: ['WiFi', '空调', '浴缸'], price: 599 },
  ]);

  // 表单提交处理
  const onFinish = (values: any) => {
    console.log('表单提交数据:', values);
    message.success('酒店信息保存成功！');
    // 实际开发中：此处应调用API，然后跳转或刷新
    // navigate('/manage/hotels');
  };

  // 图片上传处理（模拟）
  const handleUploadChange = (info: any) => {
    // 简化处理，实际应处理上传状态和URL
    setImageList(info.fileList);
  };

  // 动态增加房型
  const addRoomType = () => {
    const newId = roomTypes.length + 1;
    setRoomTypes([
      ...roomTypes,
      { id: newId, name: `新房型${newId}`, area: 25, bed: '大床', facilities: [], price: 300 },
    ]);
  };

  // 删除房型
  const removeRoomType = (id: number) => {
    setRoomTypes(roomTypes.filter(room => room.id !== id));
  };

  // 房型表格列定义
  const roomColumns = [
    { title: '房型名称', dataIndex: 'name', key: 'name' },
    { title: '面积 (㎡)', dataIndex: 'area', key: 'area' },
    { title: '床型', dataIndex: 'bed', key: 'bed' },
    { title: '设施', dataIndex: 'facilities', key: 'facilities', render: (facils: string[]) => facils.join(', ') },
    { title: '价格 (元/晚)', dataIndex: 'price', key: 'price' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RoomType) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small" onClick={() => removeRoomType(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1>酒店信息管理</h1>
      <p className={styles.subTitle}>填写或修改酒店信息，带 * 为必填项</p>

      <Card className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: '北京王府井大酒店',
            star: '4',
            address: '北京市东城区王府井大街88号',
          }}
        >
          {/* 第一部分：酒店基本信息 */}
          <div className={styles.section}>
            <h2>基本信息</h2>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="酒店名称 (中/英)"
                  name="name"
                  rules={[{ required: true, message: '请输入酒店名称' }]}
                >
                  <Input placeholder="请输入酒店名称，支持中英文" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="酒店星级"
                  name="star"
                  rules={[{ required: true, message: '请选择星级' }]}
                >
                  <Select placeholder="请选择星级">
                    <Option value="3">三星级</Option>
                    <Option value="4">四星级</Option>
                    <Option value="5">五星级</Option>
                    <Option value="luxury">豪华型</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="详细地址"
                  name="address"
                  rules={[{ required: true, message: '请输入详细地址' }]}
                >
                  <Input placeholder="请输入酒店所在的详细地址，便于用户定位" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="开业时间" name="openDate">
                  <DatePicker style={{ width: '100%' }} placeholder="选择开业日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话" name="phone">
                  <Input placeholder="酒店前台联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="酒店描述" name="description">
              <TextArea rows={4} placeholder="描述酒店的特色、服务、周边环境等" />
            </Form.Item>
          </div>

          {/* 第二部分：图片上传 */}
          <div className={styles.section}>
            <h2>酒店图片</h2>
            <Form.Item label="上传展示图片" name="images">
              <Upload
                listType="picture-card"
                fileList={imageList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // 阻止自动上传，使用模拟
              >
                {imageList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <p className={styles.tip}>建议上传至少3张图片，最多8张，第一张将作为封面</p>
          </div>

          {/* 第三部分：房型与价格管理 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>房型与价格</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={addRoomType}>
                添加房型
              </Button>
            </div>
            <Table
              dataSource={roomTypes}
              columns={roomColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
            
            {/* 简化版动态添加房型表单（也可展开） */}
            <div className={styles.quickAddRoom}>
              <h3>快捷添加房型</h3>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name={['newRoom', 'name']} label="房型名">
                    <Input placeholder="如：标准大床房" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name={['newRoom', 'price']} label="价格(元)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name={['newRoom', 'discount']} label="折扣">
                    <Select placeholder="选择优惠">
                      <Option value="0.95">国庆节95折</Option>
                      <Option value="0.9">会员专享9折</Option>
                      <Option value="package">机票+酒店套餐</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/* 第四部分：周边信息（可选维度） */}
          <div className={styles.section}>
            <h2>周边信息 (可选)</h2>
            <Form.Item label="附近景点" name="attractions">
              <Select mode="tags" placeholder="输入景点后回车添加，如：故宫、天安门">
                <Option value="故宫">故宫</Option>
                <Option value="天安门">天安门</Option>
              </Select>
            </Form.Item>
            <Form.Item label="交通信息" name="transport">
              <TextArea rows={2} placeholder="地铁线路、公交车站、机场距离等" />
            </Form.Item>
          </div>

          {/* 表单操作按钮 */}
          <div className={styles.formActions}>
            <Button onClick={() => navigate('/manage/hotels')}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存信息
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default HotelEditPage;