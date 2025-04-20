import { Link } from 'react-router-dom';
import './TaskCard.css';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  board: string;
  boardId: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
};

type TaskCardProps = {
  task: Task;
  onEditClick?: (task: Task) => void;
};

const TaskCard = ({ task, onEditClick }: TaskCardProps) => {
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
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="meta-left">
          <span className="task-status">{task.status}</span>
          <span className="assignee-label">Исполнитель: {task.assignee}</span>
        </div>
        
        <Link 
          to={`/board/${task.boardId}?taskId=${task.id}`}
          className="board-link"
          onClick={(e) => {
            e.stopPropagation();
            if (onEditClick) {
              onEditClick(task);
            }
          }}
        >
          Доска: {task.board}
        </Link>
      </div>
      
      <div className="task-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.(task);
          }}
          className="edit-button"
        >
          Редактировать
        </button>
      </div>
    </div>
  );
};

export default TaskCard;