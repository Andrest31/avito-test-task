import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import "./BoardPage.css";

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
}

interface BoardInfo {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

interface ApiResponse {
  data: ApiTask[];
}

interface BoardsResponse {
  data: BoardInfo[];
}

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description: string;
  board: string;
  boardId: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

const BoardPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [allBoards, setAllBoards] = useState<BoardInfo[]>([]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const boardInfo = allBoards.find(b => b.id.toString() === id);
      const currentBoardName = boardInfo?.name || `Доска ${id}`;
      setBoardName(currentBoardName);

      const tasksResponse = await fetch(`http://localhost:8080/api/v1/boards/${id}`);
      if (!tasksResponse.ok) throw new Error(`HTTP error! status: ${tasksResponse.status}`);
      
      const result: ApiResponse = await tasksResponse.json();
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format from API");
      }

      const transformedTasks = result.data.map(task => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        board: currentBoardName,
        boardId: id || "",
        assignee: task.assignee.fullName,
        priority: task.priority.toLowerCase() as TaskPriority,
        status: mapStatus(task.status)
      }));

      updateColumns(transformedTasks);
      
      // Check for taskId in URL
      const taskId = searchParams.get('taskId');
      if (taskId) {
        const taskToEdit = transformedTasks.find(t => t.id === taskId);
        if (taskToEdit) {
          setEditingTask(taskToEdit);
          setIsModalOpen(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateColumns = (tasks: Task[]) => {
    const todoTasks = tasks.filter(task => task.status === 'todo');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const doneTasks = tasks.filter(task => task.status === 'done');

    setColumns([
      { id: 'todo', title: 'To Do', tasks: todoTasks },
      { id: 'in_progress', title: 'In Progress', tasks: inProgressTasks },
      { id: 'done', title: 'Done', tasks: doneTasks }
    ]);
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/boards');
        if (!response.ok) throw new Error('Failed to fetch boards');
        const result: BoardsResponse = await response.json();
        setAllBoards(result.data || []);
      } catch (err) {
        console.error('Error fetching boards:', err);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    if (id) fetchBoardData();
  }, [id, searchParams, allBoards]);

  const mapStatus = (apiStatus: string): TaskStatus => {
    switch (apiStatus) {
      case 'Backlog': return 'todo';
      case 'InProgress': return 'in_progress';
      case 'Done': return 'done';
      default: return 'todo';
    }
  };

  const handleTaskCreated = (updatedTask: TaskData) => {
    if (updatedTask.id) {
      // Update existing task
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task.id === updatedTask.id ? { 
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              priority: updatedTask.priority,
              status: updatedTask.status,
              assignee: updatedTask.assignee
            } : task
          )
        }))
      );
    } else {
      // Add new task (if needed)
      // ...
    }

    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (loading) return <div className="loading-message">Загрузка задач...</div>;
  if (error) return <div className="error-message">Ошибка: {error}</div>;

  return (
    <div className="board-container">
      <div className="board-header">
        <h2 className="board-title">{boardName}</h2>
      </div>
      
      <div className="board-content">
        <div className="board-columns">
          {columns.map(column => (
            <div key={column.id} className="board-column">
              <h3 className="column-title">{column.title} ({column.tasks.length})</h3>
              <div className="tasks-list">
                {column.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    onClick={() => handleTaskClick(task)}
                  >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                    <span 
                        className="task-priority"
                        data-priority={task.priority}
                      >                        
                      {task.priority}
                      </span>
                      <span className="task-assignee">{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          window.history.replaceState({}, '', `/board/${id}`);
        }}
        onTaskCreated={handleTaskCreated}
        initialData={editingTask ? {
          id: editingTask.id,
          title: editingTask.title,
          description: editingTask.description,
          board: editingTask.board,
          boardId: editingTask.boardId,
          priority: editingTask.priority,
          status: editingTask.status,
          assignee: editingTask.assignee
        } : undefined}
        isFromBoard={true}
        initialBoard={editingTask?.board}
      />
    </div>
  );
};

export default BoardPage;