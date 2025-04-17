import TaskList from '../TaskList/TaskList';

const MainContent = () => {
  return (
    <main className="main-content">
      <div className="categories">
        <div className="category-block">
          <div className="category-title">Срочные задачи</div>
          <div className="category-count">5</div>
        </div>
        <div className="category-block">
          <div className="category-title">Сегодня</div>
          <div className="category-count">3</div>
        </div>
      </div>

      <TaskList />
    </main>
  );
};

export default MainContent;