import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import TaskModal, { TaskData } from "../TaskModal/TaskModal";
import "./Header.css";

type HeaderProps = {
  onTaskCreated?: (task: TaskData) => void;
  currentBoard?: string;
};

const Header = ({ onTaskCreated, currentBoard }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const isBoardPage = location.pathname.startsWith("/board/");

  return (
    <>
      <header className="header">
        <nav className="main-nav">
          <NavLink 
            to="/issues" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Все задачи
          </NavLink>
          <NavLink 
            to="/boards" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Проекты
          </NavLink>
        </nav>

        <h1 className="logo">
          Taska
        </h1>

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
        onTaskCreated={(task) => {
          setIsModalOpen(false);
          onTaskCreated?.(task);
        }}
        isFromBoard={isBoardPage}
        initialBoard={isBoardPage ? currentBoard : undefined}
      />
    </>
  );
};

export default Header;
