import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Home from './pages/Home/Home';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import News from './pages/News/News';
import MyOrders from './pages/MyOrders/MyOrders';
import SearchResults from './components/Searching/Searching';
import PostDetail from './components/CommentSection/PostDetail';
import { useTheme } from './context/ThemeContext';
import './App.css'
import './i18n';
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const userId = "67221db1852e20a83b9032d7";
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
        <Navbar setShowLogin={setShowLogin} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path="/news" element={<News />} />
          <Route path="/post/:postId" element={<PostDetail userId={userId} />} />
        </Routes>
      </div>

      <a className='comments' href='/post/:postId' style={{ marginBottom: '100px', textDecoration: 'underline', color: 'blue' }} >
        View Comments
      </a>

      <Footer />
    </>
  );
};

export default App;
