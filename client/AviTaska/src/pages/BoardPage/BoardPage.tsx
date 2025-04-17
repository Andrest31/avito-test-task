// client/src/pages/Board.tsx
import { useParams } from 'react-router-dom';

export default function Board() {
  const { id } = useParams(); // ID доски из URL
  // Заглушка данных
  const tasks = [
    { id: '1', title: 'Рефакторинг кода', status: 'In Progress' },
    { id: '2', title: 'Добавить тесты', status: 'To Do' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Доска проекта #{id}</h1>
      <div className="flex gap-4">
        {/* Колонки по статусам */}
        {['To Do', 'In Progress', 'Done'].map(status => (
          <div key={status} className="flex-1 border p-2 rounded-lg">
            <h2 className="font-semibold">{status}</h2>
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <div key={task.id} className="p-2 my-2 bg-white rounded shadow">
                  {task.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}