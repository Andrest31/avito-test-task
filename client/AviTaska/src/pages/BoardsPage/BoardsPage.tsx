import "./BoardsPage.css";

const BoardsPage = () => {
  const projects = [
    { id: 1, name: "Название проекта 1", tasksCount: 5, description: "Оптимизация серверных методов" },
    { id: 2, name: "Название проекта 2", tasksCount: 3, description: "Улучшение Core Web Vitals" },
    { id: 3, name: "Мобильное приложение", tasksCount: 12, description: "Оптимизация серверных методов" },
    { id: 4, name: "Веб-сайт компании", tasksCount: 8, description: "Улучшение Core Web Vitals" },
  ];

  return (
    <div className="projects-container">
      <h2 className="page-title">Мои проекты</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className="tasks-count">{project.tasksCount} задач</span>
            </div>
            <div className="project-meta">
              <span className="description">{project.description}</span>
            </div>
            <div className="project-footer">
              <a href={`/board/${project.id}`} className="project-link">
                Перейти к доске
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;