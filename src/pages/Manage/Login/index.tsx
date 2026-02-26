import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('表单数据:', values);
      
      if (isLogin) {
        // 模拟登录成功
        message.success('登录成功！正在跳转到管理后台...');
        localStorage.setItem('adminToken', 'mock-token-123'); // 模拟存储token
        setTimeout(() => navigate('/manage/hotels'), 1000);
      } else {
        // 模拟注册成功
        message.success('注册成功！请使用新账号登录。');
        setIsLogin(true); // 切换回登录标签页
        form.resetFields(); // 清空表单
      }
    } catch (error) {
      message.error(isLogin ? '登录失败，请检查用户名和密码' : '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="易宿酒店管理后台">
        <Tabs 
          activeKey={isLogin ? 'login' : 'register'} 
          onChange={(key) => setIsLogin(key === 'login')}
          centered
        >
          <Tabs.TabPane tab="管理员登录" key="login">
            <Form
              form={form}
              onFinish={onFinish}
              className={styles.form}
              initialValues={{ username: 'admin', password: '123456' }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
                className={styles.formItem}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
                className={styles.formItem}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码" 
                  size="large"
                />
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
                className={styles.submitButton}
              >
                {loading ? '处理中...' : '登录'}
              </Button>
              
              <div className={styles.tip}>
                演示账号：admin / 123456
              </div>
            </Form>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="注册管理员" key="register">
            <Form
              form={form}
              onFinish={onFinish}
              className={styles.form}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
                className={styles.formItem}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="邮箱地址" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
                className={styles.formItem}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
                className={styles.formItem}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
                className={styles.formItem}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="确认密码" 
                  size="large"
                />
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
                className={styles.submitButton}
              >
                {loading ? '注册中...' : '注册'}
              </Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPage;