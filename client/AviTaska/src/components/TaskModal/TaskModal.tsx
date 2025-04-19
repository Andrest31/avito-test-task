import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import './TaskModal.css';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    board: string;
    priority: string;
    status: string;
    assignee: string;
  };
  isFromBoard?: boolean;
};

const TaskModal = ({ isOpen, onClose, initialData, isFromBoard }: TaskModalProps) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    board: '',
    priority: 'medium',
    status: 'todo',
    assignee: ''
  });

  // Определяем режим работы модалки
  const isEditMode = !!initialData;
  const isBoardPage = location.pathname.includes('/board/') || isFromBoard;

  // Заполняем форму начальными данными
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        board: initialData.board,
        priority: initialData.priority,
        status: initialData.status,
        assignee: initialData.assignee
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика сохранения/обновления задачи
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Редактирование задачи' : 'Создание задачи'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Проект</label>
            {isBoardPage ? (
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
            >
              <option value="">Выберите исполнителя</option>
              <option value="Иванов">Иванов</option>
              <option value="Петров">Петров</option>
              <option value="Сидоров">Сидоров</option>
            </select>
          </div>

          <div className="modal-actions">
            {!isBoardPage && isEditMode && (
              <NavLink 
                to={`/board/${formData.board}`}
                className="go-to-board-button"
              >
                Перейти на доску
              </NavLink>
            )}
            
            <button type="submit" className="submit-button">
              {isEditMode ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>

        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default TaskModal;