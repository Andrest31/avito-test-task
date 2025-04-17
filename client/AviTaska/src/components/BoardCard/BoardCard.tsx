import { Link } from "react-router-dom";

const BoardCard = ({ board }: { board: { id: string; name: string; tasksCount: number } }) => {
  return (
    <Link to={`/board/${board.id}`} className="board-card">
      <h3>{board.name}</h3>
      <p>Задач: {board.tasksCount}</p>
    </Link>
  );
};

export default BoardCard;