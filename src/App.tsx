import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import Login from './pages/Manage/Login';
import HotelEdit from './pages/Manage/HotelEdit';
import HotelReview from './pages/Manage/HotelReview';

function App() {
  return (
    <Router>
      <Routes>
        {/* 用户端路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        
        {/* 管理端路由 */}
        <Route path="/manage/login" element={<Login />} />
        <Route path="/manage/hotels/edit" element={<HotelEdit />} />
        <Route path="/manage/hotels" element={<HotelReview />} />
      </Routes>
    </Router>
  );
}

export default App;