import "./BoardsPage.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  taskCount: number;
  description: string;
}

interface ApiResponse {
  data: Project[];
}

const BoardsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/boards");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data format from API");
        }

        setProjects(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading-message">Загрузка проектов...</div>;
  }

  if (error) {
    return <div className="error-message">Ошибка: {error}</div>;
  }

  return (
    <div className="projects-container">
      <h2 className="page-title">Мои проекты</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className="tasks-count">{project.taskCount} задач</span>
            </div>
            <div className="project-meta">
              <span className="description">{project.description}</span>
            </div>
            <div className="project-footer">
              <a href={`/board/${project.id}`} className="project-link">
                Перейти к доске
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;
