import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">AviTaska</Link>
      
      <div className="search-bar">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск задач..." 
        />
        <button className="search-button">Найти</button>
      </div>

      <div className="user-nav">
        <Link to="/issues" className="nav-button">Все задачи</Link>
        <Link to="/boards" className="nav-button">Мои доски</Link>
      </div>
    </header>
  );
};

export default Header;