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
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TaskData;
  isFromBoard?: boolean;
  initialBoard?: string;
  onTaskCreated: (task: Omit<TaskData, 'id'>) => void;
};

const TaskModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  isFromBoard, 
  initialBoard,
  onTaskCreated 
}: TaskModalProps) => {
  const location = useLocation();
  const [formData, setFormData] = useState<Omit<TaskData, 'id'>>({
    title: '',
    description: '',
    board: initialBoard || '',
    priority: 'medium',
    status: 'todo',
    assignee: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        board: initialData.board,
        priority: initialData.priority,
        status: initialData.status,
        assignee: initialData.assignee
      });
    } else if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        board: initialBoard || '',
        priority: 'medium',
        status: 'todo',
        assignee: ''
      });
    }
  }, [isOpen, initialData, initialBoard]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!initialData) {
        // Создание новой задачи
        const priorityMap = {
          low: 'Low',
          medium: 'Medium',
          high: 'High'
        };

        const assigneeMap = {
          'Иванов': 1,
          'Петров': 2,
          'Сидоров': 3
        };

        const boardMap = {
          "Проект 'Авто'": 1,
          "Проект 'Дизайн'": 2
        };

        const response = await fetch('http://localhost:8080/api/v1/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            boardId: boardMap[formData.board as keyof typeof boardMap] || 1,
            priority: priorityMap[formData.priority],
            assigneeId: assigneeMap[formData.assignee as keyof typeof assigneeMap] || 1
          })
        });

        if (!response.ok) {
          throw new Error(`Ошибка при создании задачи: ${response.status}`);
        }

        const createdTask = await response.json();
        console.log('Задача создана:', createdTask);
      }

      // Вызываем колбэк для обновления UI
      onTaskCreated(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      console.error('Ошибка при создании задачи:', err);
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
            {isFromBoard || location.pathname.includes('/board/') ? (
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
                <option value="Проект 'Авто'">Проект "Авто"</option>
                <option value="Проект 'Дизайн'">Проект "Дизайн"</option>
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
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Выберите исполнителя</option>
              <option value="Иванов">Иванов</option>
              <option value="Петров">Петров</option>
              <option value="Сидоров">Сидоров</option>
            </select>
          </div>

          <div className="modal-actions">
            {initialData && !isFromBoard && !location.pathname.includes('/board/') && (
              <NavLink 
                to={`/board/${formData.board === "Проект 'Авто'" ? '1' : '2'}`}
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