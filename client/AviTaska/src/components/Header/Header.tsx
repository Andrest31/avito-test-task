import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="main-nav">
        <NavLink 
          to="/issues" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          Все задачи
        </NavLink>
        <NavLink 
          to="/boards" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          Проекты
        </NavLink>
      </nav>
      <h1 className="logo">Taska</h1>
      <nav className="main-nav">
        <NavLink 
          to="/create-issue" 
          className={({ isActive }) => 
            `nav-link create-btn ${isActive ? 'active-create' : ''}`
          }
        >
          Создать задачу
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;