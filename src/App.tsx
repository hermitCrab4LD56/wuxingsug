import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useStore } from './store/useStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import DailyRecommendation from './pages/DailyRecommendation';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({ children, redirectTo = "/" }) => {
  const { user } = useStore();
  
  if (!user) {
    console.log(`🔒 ProtectedRoute: 用户未登录，跳转到 ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user, isAuthenticated } = useStore();
  
  useEffect(() => {
    // 调试信息
    console.log('🚀 App useEffect: 应用初始化');
    console.log('📱 App - localStorage token:', localStorage.getItem('token')?.substring(0, 50) + '...');
    console.log('💾 App - localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    console.log('👤 App - 当前用户状态:', {
      user,
      isAuthenticated,
      hasUser: !!user,
      userName: user?.name,
      userGender: user?.gender,
      userBirthDate: user?.birth_date,
      userBirthTime: user?.birth_time
    });
  }, [user, isAuthenticated]);
  
  // User state is automatically restored by zustand persist middleware
  // No manual localStorage handling needed

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/daily/:date" 
              element={
                <ProtectedRoute>
                  <DailyRecommendation />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
