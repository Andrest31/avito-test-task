import { useParams } from "react-router-dom";
import "./BoardPage.css";

const BoardPage = () => {
  const { id } = useParams();

  return (
    <div className="project-container">
      <div className="project-header">
        <h2 className="project-title">Название проекта ({id})</h2>
        <a href="/boards" className="back-link">← Все проекты</a>
      </div>
      
      <div className="project-content">
        {/* Здесь будет доска с задачами */}
        <p>Доска проекта будет здесь</p>
      </div>
    </div>
  );
};

export default BoardPage;