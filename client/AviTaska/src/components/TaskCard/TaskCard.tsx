import { Link } from 'react-router-dom';
import './TaskCard.css';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  board?: string;
  boardId?: string;
  assignee?: string; // Добавляем поле исполнителя
  priority?: 'low' | 'medium' | 'high';
};

const TaskCard = ({ task }: { task: Task }) => {
  const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336'
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        {task.priority && (
          <span 
            className="priority-badge"
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority}
          </span>
        )}
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="meta-left">
          {task.status && (
            <span className="task-status">{task.status}</span>
          )}
          {task.assignee && (
            <span className="assignee-label">Исполнитель: {task.assignee}</span>
          )}
        </div>
        
        
        {(task.board || task.boardId) && (
          <Link 
            to={`/board/${task.boardId || '1'}`} 
            className="board-link"
          >
            Доска: {task.board || 'Неизвестная доска'}
          </Link>
        )}
      </div>
      
      <div className="task-actions">
        <Link to={`/tasks/${task.id}`} className="edit-button">
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;