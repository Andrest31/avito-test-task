import { useParams } from "react-router-dom";
import "./BoardPage.css";

const BoardPage = () => {
  const { id } = useParams();

  // Пример данных задач
  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "1", title: "Задача 1", description: "Описание задачи 1" },
        { id: "3", title: "Задача 3", description: "Описание задачи 3" },
      ]
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        { id: "4", title: "Задача 4", description: "Описание задачи 4" }
      ]
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        { id: "2", title: "Задача 2", description: "Описание задачи 2" }
      ]
    }
  ];

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
                  <div key={task.id} className="task-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;