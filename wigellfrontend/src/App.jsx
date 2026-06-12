import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import Cars from './pages/Cars'
import Bookings from './pages/Bookings'
import BookCar from './pages/BookCar'

import UserProfile from './pages/user/UserProfile'

import AdminUsers from './pages/admin/AdminUsers'
import AdminCars from './pages/admin/AdminCars'
import AdminBookings from './pages/admin/AdminBookings'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookcar" element={<BookCar />} />
          <Route path="/userprofile" element={<UserProfile />} />
          {/* ADMIN ROUTES */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />{' '}
          {/* <--> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
