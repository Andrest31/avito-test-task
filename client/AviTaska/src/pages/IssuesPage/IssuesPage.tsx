import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import "./IssuesPage.css";
import { AnimatePresence, motion } from "framer-motion";

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
    const statusMap = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };

    if (newTaskData.id) {
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
        setAllTasks(prevTasks => [...prevTasks, newTask]);
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
    <motion.div
      className="issues-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-container">
        <div className="page-header">
          <motion.h1
            className="page-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Все задачи
          </motion.h1>

          <div className="controls">
            <motion.div
              className="search-container"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по задачам..."
                className="search-input"
              />
            </motion.div>

            <div className="filters-wrapper">
              <motion.button
                className="filters-button"
                onClick={() => setShowFilters(!showFilters)}
                whileTap={{ scale: 0.95 }}
              >
                Фильтры
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className="filters-dropdown"
                    onMouseLeave={() => setShowFilters(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div
          className="tasks-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <TaskCard task={task} onEditClick={handleEditClick} />
              </motion.div>
            ))
          ) : (
            <div className="no-results">Задачи не найдены</div>
          )}
        </motion.div>

        <nav className="page-nav">
          <motion.button
            className="nav-link create-btn"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Создать задачу
          </motion.button>
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
    </motion.div>
  );
};

export default IssuesPage;
