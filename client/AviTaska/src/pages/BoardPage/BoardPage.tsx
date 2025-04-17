// src/pages/BoardPage/BoardPage.tsx
import { useParams } from "react-router-dom";
import "./BoardPage.css";
import TaskColumn from "../../components/TaskColumn/TaskColumn";
import { Task } from "../../components/TaskCard/TaskCard"; // Правильный импорт типа

const BoardPage = () => {
  const { id } = useParams();
  
  const columns: { status: string; tasks: Task[] }[] = [
    { 
      status: 'To Do', 
      tasks: [
        { 
          id: '1', 
          title: 'Добавить тесты', 
          description: 'Написать unit-тесты для компонентов',
          priority: 'high',
          boardId: id // Добавляем boardId
        }
      ] 
    },
    { 
      status: 'In Progress', 
      tasks: [
        { 
          id: '2', 
          title: 'Интеграция с API', 
          description: 'Подключить endpoints бэкенда',
          priority: 'medium',
          boardId: id
        }
      ] 
    },
    { 
      status: 'Done', 
      tasks: [
        { 
          id: '3', 
          title: 'Создать базовые компоненты', 
          description: 'Реализовать Header, Sidebar и TaskCard',
          priority: 'low',
          boardId: id
        }
      ] 
    }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Доска проекта #{id}</h1>
      <div className="board-columns">
        {columns.map(column => (
          <TaskColumn 
            key={column.status} 
            status={column.status} 
            tasks={column.tasks} 
          />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;