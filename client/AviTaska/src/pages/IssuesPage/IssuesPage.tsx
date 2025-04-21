import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import "./IssuesPage.css";

interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface ApiTask {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
  assignee: Assignee;
  boardId: number;
  boardName: string;
}

interface ApiResponse {
  data: ApiTask[];
}

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  board: string;
  boardId: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
};

const IssuesPage = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, assigneesResponse] = await Promise.all([
          fetch("http://localhost:8080/api/v1/tasks"),
          fetch("http://localhost:8080/api/v1/users")
        ]);

        if (!tasksResponse.ok) throw new Error(`HTTP error! status: ${tasksResponse.status}`);
        if (!assigneesResponse.ok) throw new Error(`HTTP error! status: ${assigneesResponse.status}`);

        const tasksResult: ApiResponse = await tasksResponse.json();
        const assigneesResult = await assigneesResponse.json();

        if (!tasksResult.data || !Array.isArray(tasksResult.data)) {
          throw new Error("Invalid data format from API");
        }

        const transformedTasks = tasksResult.data.map(task => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          status: mapStatus(task.status),
          board: task.boardName,
          boardId: task.boardId.toString(),
          assignee: task.assignee.fullName,
          assigneeId: task.assignee.id.toString(),
          priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high'
        }));

        setAllTasks(transformedTasks);
        setAssignees(assigneesResult.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapStatus = (apiStatus: string): string => {
    switch (apiStatus) {
      case 'Backlog': return 'To Do';
      case 'InProgress': return 'In Progress';
      case 'Done': return 'Done';
      default: return apiStatus;
    }
  };

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

  const handleTaskCreated = (newTaskData: TaskData) => {
    if (newTaskData.id) {
      const statusMap = {
        todo: 'To Do',
        in_progress: 'In Progress',
        done: 'Done'
      };
  
      if (editingTask) {
        setAllTasks(allTasks.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                ...newTaskData,
                boardId: newTaskData.boardId || task.boardId,
                status: statusMap[newTaskData.status as keyof typeof statusMap] || task.status
              }
            : task
        ));
      } else {
        const newTask: Task = {
          ...newTaskData,
          id: newTaskData.id,
          boardId: newTaskData.boardId || '1',
          status: statusMap[newTaskData.status as keyof typeof statusMap] || 'To Do',
          priority: newTaskData.priority,
          assignee: newTaskData.assignee,
          assigneeId: newTaskData.assigneeId
        };
        setAllTasks(prevTasks => [...prevTasks, newTask]); // Добавляем задачу в список
      }
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };
  

  const handleEditClick = (task: Task) => {
    const statusMap = {
      'To Do': 'todo',
      'In Progress': 'in_progress',
      'Done': 'done'
    };
    
    setEditingTask({
      ...task,
      status: statusMap[task.status as keyof typeof statusMap] || 'todo',
      board: task.board,
    } as Task);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="loading-message">Загрузка задач...</div>;
  }

  if (error) {
    return <div className="error-message">Ошибка: {error}</div>;
  }

  return (
    <div className="issues-page">
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
              <TaskCard 
                key={task.id} 
                task={task} 
                onEditClick={handleEditClick}
              />
            ))
          ) : (
            <div className="no-results">Задачи не найдены</div>
          )}
        </div>

        <nav className="page-nav">
          <button 
            className="nav-link create-btn"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            Создать задачу
          </button>
        </nav>

        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onTaskCreated={handleTaskCreated}
          initialData={editingTask ? {
            id: editingTask.id,
            title: editingTask.title,
            description: editingTask.description,
            board: editingTask.board,
            boardId: editingTask.boardId,
            priority: editingTask.priority,
            status: editingTask.status as 'todo' | 'in_progress' | 'done',
            assignee: editingTask.assignee,
            assigneeId: editingTask.assigneeId
          } : undefined}
          allAssignees={assignees}
        />
      </div>
    </div>
  );
};

export default IssuesPage;