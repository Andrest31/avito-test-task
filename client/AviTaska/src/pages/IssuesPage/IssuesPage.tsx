import TaskCard from "../../components/TaskCard/TaskCard";

const IssuesPage = () => {
  const tasks = [
    { 
      id: '1', 
      title: 'Рефакторинг кода', 
      description: 'Улучшить структуру компонентов',
      status: 'In Progress',
      board: 'Проект "Авто"'
    },
    { 
      id: '2', 
      title: 'Добавить DnD', 
      description: 'Реализовать drag-and-drop для задач',
      status: 'To Do',
      board: 'Проект "Дизайн"'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Все задачи</h1>
      </div>
      <div className="tasks-grid">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default IssuesPage;