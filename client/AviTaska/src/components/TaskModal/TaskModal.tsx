import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import './TaskModal.css';

export type TaskData = {
  id?: string;
  title: string;
  description: string;
  board: string;
  boardId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
  assigneeId?: string;
};

interface Board {
  id: number;
  name: string;
}

interface Assignee {
  id: number;
  fullName: string;
}

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TaskData;
  isFromBoard?: boolean;
  initialBoard?: string;
  onTaskCreated: (task: TaskData) => void;
};

const TaskModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  isFromBoard = false, 
  initialBoard = '',
  onTaskCreated 
}: TaskModalProps) => {
  const location = useLocation();
  const [formData, setFormData] = useState<Omit<TaskData, 'id'>>({
    title: '',
    description: '',
    board: initialBoard,
    priority: 'medium',
    status: 'todo',
    assignee: '',
    assigneeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);

  const isCalledFromBoardPage = isFromBoard || location.pathname.includes('/board/');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isCalledFromBoardPage) {
          const boardsResponse = await fetch('http://localhost:8080/api/v1/boards');
          if (!boardsResponse.ok) throw new Error('Ошибка загрузки досок');
          const boardsData = await boardsResponse.json();
          setBoards(boardsData.data || []);
        }

        const assigneesResponse = await fetch('http://localhost:8080/api/v1/users');
        if (!assigneesResponse.ok) throw new Error('Ошибка загрузки исполнителей');
        const assigneesData = await assigneesResponse.json();
        setAssignees(assigneesData.data || []);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, isCalledFromBoardPage]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        board: initialData.board,
        priority: initialData.priority,
        status: initialData.status,
        assignee: initialData.assignee,
        assigneeId: initialData.assigneeId || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        board: initialBoard,
        priority: 'medium',
        status: 'todo',
        assignee: '',
        assigneeId: ''
      });
    }
  }, [isOpen, initialData, initialBoard]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const assigneeId = selectedOption.dataset.id || '';
    const assignee = selectedOption.value;
    
    setFormData(prev => ({ 
      ...prev, 
      assignee,
      assigneeId 
    }));
  };

  const mapStatusToApi = (status: string): string => {
    switch (status) {
      case 'todo': return 'Backlog';
      case 'in_progress': return 'InProgress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const priorityMap = {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      };
  
      const currentAssigneeId = formData.assigneeId || initialData?.assigneeId || '';
  
      const taskPayload = {
        title: formData.title,
        description: formData.description,
        priority: priorityMap[formData.priority],
        status: mapStatusToApi(formData.status),
        assigneeId: currentAssigneeId ? parseInt(currentAssigneeId) : 0
      };
  
      if (initialData?.id) {
        // Обновление задачи
        const response = await fetch(`http://localhost:8080/api/v1/tasks/update/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskPayload)
        });
  
        if (!response.ok) throw new Error(`Ошибка при обновлении задачи: ${response.status}`);
  
        onTaskCreated({
          ...formData,
          id: initialData.id,
          boardId: initialData.boardId,
          assigneeId: currentAssigneeId
        });
      } else {
        // Создание новой задачи
        const boardIdString = isCalledFromBoardPage 
          ? location.pathname.split('/').pop() 
          : boards.find(b => b.name === formData.board)?.id?.toString();
  
        if (!boardIdString) throw new Error('Не выбран проект');
  
        const boardId = parseInt(boardIdString); // 🔥 ВАЖНО: привести к числу
  
        const response = await fetch('http://localhost:8080/api/v1/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...taskPayload,
            boardId: boardId // 👈 передаём числом, а не строкой
          })
        });
  
        if (!response.ok) throw new Error(`Ошибка при создании задачи: ${response.status}`);
  
        const responseData = await response.json();
        const newTaskId = responseData.id?.toString() || responseData.data?.id?.toString();
        if (!newTaskId) throw new Error('Не удалось получить ID созданной задачи');
  
        onTaskCreated({
          ...formData,
          id: newTaskId,
          boardId: boardId.toString(),
          assigneeId: currentAssigneeId
        });
      }
  
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Редактирование задачи' : 'Создание задачи'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Проект</label>
            {isCalledFromBoardPage ? (
              <input
                type="text"
                value={formData.board}
                readOnly
                className="read-only"
              />
            ) : (
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Выберите проект</option>
                {boards.map(board => (
                  <option key={board.id} value={board.name}>
                    {board.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Приоритет</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>

          <div className="form-group">
            <label>Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label>Исполнитель</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleAssigneeChange}
              required
              disabled={loading}
            >
              <option value="">Выберите исполнителя</option>
              {assignees.map(user => (
                <option 
                  key={user.id} 
                  value={user.fullName}
                  data-id={user.id}
                  selected={formData.assigneeId === user.id.toString()}
                >
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            {!isCalledFromBoardPage && initialData && (
              <NavLink 
                to={`/board/${initialData.boardId}?taskId=${initialData.id}`}
                className="go-to-board-button"
              >
                Перейти на доску
              </NavLink>
            )}
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Отправка...' : initialData ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>

        <button 
          className="close-button" 
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TaskModal;