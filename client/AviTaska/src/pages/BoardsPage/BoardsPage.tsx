import BoardCard from "../../components/BoardCard/BoardCard";

const BoardsPage = () => {
  const boards = [
    { id: '1', name: 'Проект "Авто"', tasksCount: 5 },
    { id: '2', name: 'Проект "Дизайн"', tasksCount: 3 },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Мои доски</h1>
      <div className="grid-container">
        {boards.map(board => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;