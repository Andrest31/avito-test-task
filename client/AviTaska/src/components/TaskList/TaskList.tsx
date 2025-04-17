const TaskList = () => {
  const tasks = [
    { id: 1, title: "Рефакторинг кода", board: "Avito Clone", status: "В работе" },
    { id: 2, title: "Добавить тесты", board: "Avito Clone", status: "To Do" },
    { id: 3, title: "Интеграция с API", board: "Avito Clone", status: "В работе" },
    { id: 4, title: "Адаптивная верстка", board: "Avito Clone", status: "Готово" },
  ];

  return (
    <div className="task-grid">
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <h3 className="task-title">{task.title}</h3>
          <p className="task-meta">Доска: {task.board}</p>
          <span className="task-status">{task.status}</span>
          <button className="edit-button">Редактировать</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;