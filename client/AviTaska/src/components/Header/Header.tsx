import { useState } from "react";
import { NavLink } from "react-router-dom";
import TaskModal from "../TaskModal/TaskModal";
import "./Header.css";

type HeaderProps = {
  onTaskCreated?: () => void;
};

const Header = ({ onTaskCreated }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
          <button 
            className="nav-link create-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Создать задачу
          </button>
        </nav>
      </header>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={onTaskCreated}
      />
    </>
  );
};

export default Header;