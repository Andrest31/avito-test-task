import { useState } from "react";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import "./IssuesPage.css";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  board: string;
  boardId: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
};

const IssuesPage = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Рефакторинг кода', 
      description: 'Необходимо провести рефакторинг основного модуля',
      status: 'In Progress', 
      board: "Проект 'Авто'",
      boardId: '1',
      assignee: 'Иванов',
      priority: 'high'
    },
    { 
      id: '2', 
      title: 'Добавить DnD', 
      description: 'Реализовать drag and drop для задач',
      status: 'To Do', 
      board: "Проект 'Дизайн'",
      boardId: '2',
      assignee: 'Петров',
      priority: 'medium'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = allTasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) || 
      task.assignee.toLowerCase().includes(searchLower)
    );
  });

  const handleTaskCreated = (newTaskData: Omit<TaskData, 'id'>) => {
    const boardId = newTaskData.board === "Проект 'Авто'" ? '1' : '2';
    const statusMap = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };
    
    if (editingTask) {
      setAllTasks(allTasks.map(task => 
        task.id === editingTask.id ? { 
          ...task, 
          ...newTaskData,
          boardId,
          status: statusMap[newTaskData.status] || task.status
        } : task
      ));
    } else {
      setAllTasks([...allTasks, {
        ...newTaskData,
        id: `${allTasks.length + 1}`,
        boardId,
        status: statusMap[newTaskData.status] || 'To Do'
      }]);
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
      status: statusMap[task.status as keyof typeof statusMap] || 'todo'
    } as Task);
    setIsModalOpen(true);
  };

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
          assignee: editingTask.assignee
        } : undefined}
      />
    </div>
  );
};

export default IssuesPage;