// client/src/pages/Boards.tsx
import { Link } from 'react-router-dom';

export default function Boards() {
  // Заглушка данных (позже заменим на API)
  const boards = [
    { id: '1', name: 'Проект «Авто»', issuesCount: 5 },
    { id: '2', name: 'Проект «Дизайн»', issuesCount: 3 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Доски проектов</h1>
      <div className="grid grid-cols-3 gap-4">
        {boards.map(board => (
          <Link
            key={board.id}
            to={`/board/${board.id}`}
            className="border p-4 rounded-lg hover:bg-gray-50"
          >
            <h3>{board.name}</h3>
            <p>Задач: {board.issuesCount}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}