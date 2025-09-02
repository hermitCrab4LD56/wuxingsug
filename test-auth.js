// 测试认证状态和后端连接
import axios from 'axios';

// 检查后端健康状态
async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ 后端服务器正常运行:', response.data);
    return true;
  } catch (error) {
    console.log('❌ 后端服务器连接失败:', error.message);
    return false;
  }
}

// 测试登录
async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      phone: '13800138000',
      password: '123456'
    });
    console.log('✅ 登录成功:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.log('❌ 登录失败:', error.response?.data || error.message);
    return null;
  }
}

// 测试获取用户信息
async function testGetProfile(token) {
  try {
    const response = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ 获取用户信息成功:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ 获取用户信息失败:', error.response?.data || error.message);
    return null;
  }
}

// 测试八字信息接口
async function testBaziInfo(token) {
  try {
    const response = await axios.get('http://localhost:3001/api/bazi/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ 获取八字信息成功:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ 获取八字信息失败:', error.response?.data || error.message);
    return null;
  }
}

// 主测试函数
async function runTests() {
  console.log('🔍 开始测试后端连接和认证...');
  
  // 1. 检查后端健康状态
  const isHealthy = await checkBackendHealth();
  if (!isHealthy) {
    console.log('❌ 后端服务器未运行，请先启动服务器');
    return;
  }
  
  // 2. 测试登录
  const token = await testLogin();
  if (!token) {
    console.log('❌ 无法获取有效token，请检查登录凭据');
    return;
  }
  
  console.log('🔑 Token:', token.substring(0, 20) + '...');
  
  // 3. 测试获取用户信息
  await testGetProfile(token);
  
  // 4. 测试八字信息接口
  await testBaziInfo(token);
  
  console.log('✅ 所有测试完成');
}

runTests().catch(console.error);