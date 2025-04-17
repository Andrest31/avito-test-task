// src/components/TaskColumn/TaskColumn.tsx
import "./TaskColumn.css";
import TaskCard from "../TaskCard/TaskCard";
import { Task } from "../TaskCard/TaskCard"; // Правильный импорт типа

const TaskColumn = ({ status, tasks }: { status: string; tasks: Task[] }) => {
  return (
    <div className="task-column">
      <h3 className="column-title">{status}</h3>
      <div className="tasks-list">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={{ 
              ...task, 
              status,
              boardId: task.boardId // Убедимся, что boardId передается
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;