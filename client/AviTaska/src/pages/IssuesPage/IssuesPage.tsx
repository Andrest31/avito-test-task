import { useState } from "react";
import { NavLink } from "react-router-dom";
import TaskCard from "../../components/TaskCard/TaskCard";
import "./IssuesPage.css";

const IssuesPage = () => {
  const allTasks = [
    { id: '1', title: 'Рефакторинг кода', status: 'In Progress', board: 'Проект "Авто"', assignee: 'Иванов' },
    { id: '2', title: 'Добавить DnD', status: 'To Do', board: 'Проект "Дизайн"', assignee: 'Петров' },
    { id: '3', title: 'Обновить API', status: 'Done', board: 'Проект "Авто"', assignee: 'Сидоров' }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);

  const boards = [...new Set(allTasks.map(task => task.board))];
  const statuses = [...new Set(allTasks.map(task => task.status))];

  const filteredTasks = allTasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      task.title.toLowerCase().includes(searchLower) || 
      task.assignee.toLowerCase().includes(searchLower);
    const matchesBoard = !activeBoard || task.board === activeBoard;
    const matchesStatus = !activeStatus || task.status === activeStatus;
    return matchesSearch && matchesBoard && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Все задачи</h1>
        
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по задачам..."
              className="search-input"
            />
          </div>

          <div className="filters-wrapper">
            <button 
              className="filters-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              Фильтры
            </button>

            {showFilters && (
              <div 
                className="filters-dropdown"
                onMouseLeave={() => setShowFilters(false)}
              >
                <div 
                  className="filter-category"
                  onMouseEnter={() => setHoveredSubmenu('boards')}
                >
                  Доски {activeBoard && `→ ${activeBoard}`}
                  {hoveredSubmenu === 'boards' && (
                    <div className="submenu">
                      {boards.map(board => (
                        <div
                          key={board}
                          className={`submenu-item ${activeBoard === board ? 'active' : ''}`}
                          onClick={() => setActiveBoard(board)}
                        >
                          {board}
                        </div>
                      ))}
                      <div className="submenu-divider"></div>
                      <div 
                        className="submenu-item"
                        onClick={() => setActiveBoard(null)}
                      >
                        Сбросить
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="filter-category"
                  onMouseEnter={() => setHoveredSubmenu('statuses')}
                >
                  Статусы {activeStatus && `→ ${activeStatus}`}
                  {hoveredSubmenu === 'statuses' && (
                    <div className="submenu">
                      {statuses.map(status => (
                        <div
                          key={status}
                          className={`submenu-item ${activeStatus === status ? 'active' : ''}`}
                          onClick={() => setActiveStatus(status)}
                        >
                          {status}
                        </div>
                      ))}
                      <div className="submenu-divider"></div>
                      <div 
                        className="submenu-item"
                        onClick={() => setActiveStatus(null)}
                      >
                        Сбросить
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="no-results">Задачи не найдены</div>
        )}
      </div>

      <nav className="page-nav">
        <NavLink 
          to="/create-issue" 
          className={({ isActive }) => 
            `nav-link create-btn ${isActive ? 'active-create' : ''}`
          }
        >
          Создать задачу
        </NavLink>
      </nav>
    </div>
  );
};

export default IssuesPage;