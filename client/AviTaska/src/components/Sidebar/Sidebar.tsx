import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink 
              to="/issues" 
              className={({isActive}) => 
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              Все задачи
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/boards" 
              className={({isActive}) => 
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              Мои доски
            </NavLink>
          </li>
          <li className="divider"></li>
          <li>
            <NavLink to="/settings" className="sidebar-item">
              Настройки
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;