import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import LoginPage from './Components/UserRegistrationComp/LoginPage';
import Registration from './Components/UserRegistrationComp/Registration';
import ForgotPassword from './Components/UserRegistrationComp/ForgotPassword';
import ChangePassword from './Components/UserRegistrationComp/ChangePassword';
import UserProfilePage from './Components/UserRegistrationComp/UserProfilePage';
import HeaderBar from './Components/HeaderComp/Headerbar'; 
import Banquet from './Components/BanquetPageComp/Banquet' ;
import MenuImage from './Components/MenuPageComp/MenuImage';
import Catering from './Components/CateringCom/Catering';
import Gallery from './Components/GalleryComp/Gallery';
import Order from './Components/OrderPageComp/Order';
import Location from './Components/LocationComp/Location';
import MenuOrder from './Components/OrderPageComp/MenuOrder';
import Cart from './Components/OrderPageComp/Cart';
import Address from './Components/OrderPageComp/Address';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/userProfile/*" element={<UserProfilePage />} />
        <Route path="/headerHome/*" element={<HeaderBar />} />
        <Route path="/banquetPage/*" element={<Banquet />} />
        <Route path="/orderPage/*" element={<Order />} />
        <Route path="/menuPage/*" element={<MenuImage />} />
        <Route path="/cateringPage/*" element={<Catering />} />
        <Route path="/galleryPage/*" element={<Gallery />} />
        <Route path="/locationPage/*" element={<Location />} />
        <Route path="/menuOrder" element={<MenuOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
