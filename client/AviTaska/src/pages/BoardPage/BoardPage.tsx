import { useState } from "react";
import { useParams } from "react-router-dom";
import TaskModal, { TaskData } from "../../components/TaskModal/TaskModal";
import "./BoardPage.css";

type Task = {
  id: string;
  title: string;
  description: string;
  board: string;
  boardId: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
};

const BoardPage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Пример данных задач с полной структурой и правильными типами
  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        { 
          id: "1", 
          title: "Задача 1", 
          description: "Описание задачи 1",
          board: "Проект 'Авто'",
          boardId: "1",
          assignee: "Иванов",
          priority: "medium" as const,
          status: "todo" as const
        },
        { 
          id: "3", 
          title: "Задача 3", 
          description: "Описание задачи 3",
          board: "Проект 'Дизайн'",
          boardId: "2",
          assignee: "Петров",
          priority: "high" as const,
          status: "todo" as const
        },
      ]
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        { 
          id: "4", 
          title: "Задача 4", 
          description: "Описание задачи 4",
          board: "Проект 'Авто'",
          boardId: "1",
          assignee: "Сидоров",
          priority: "low" as const,
          status: "in_progress" as const
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        { 
          id: "2", 
          title: "Задача 2", 
          description: "Описание задачи 2",
          board: "Проект 'Дизайн'",
          boardId: "2",
          assignee: "Петров",
          priority: "medium" as const,
          status: "done" as const
        }
      ]
    }
  ];

  const handleTaskCreated = (updatedTask: Omit<TaskData, 'id'>) => {
    // Здесь должна быть логика обновления задачи в columns
    console.log('Задача обновлена:', updatedTask);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <h2 className="board-title">Название проекта ({id})</h2>
      </div>
      
      <div className="board-content">
        <div className="board-columns">
          {columns.map(column => (
            <div key={column.id} className="board-column">
              <h3 className="column-title">{column.title} - {column.tasks.length}</h3>
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