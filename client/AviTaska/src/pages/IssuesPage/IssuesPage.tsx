// client/src/pages/Issues.tsx
export default function Issues() {
    // Заглушка данных
    const issues = [
      { id: '1', title: 'Исправить баг', board: 'Проект «Авто»', status: 'In Progress' },
      { id: '2', title: 'Обновить документацию', board: 'Проект «Дизайн»', status: 'To Do' },
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Все задачи</h1>
        <div className="space-y-2">
          {issues.map(issue => (
            <div key={issue.id} className="border p-3 rounded-lg hover:bg-gray-50">
              <h3>{issue.title}</h3>
              <p>Доска: {issue.board} • Статус: {issue.status}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }