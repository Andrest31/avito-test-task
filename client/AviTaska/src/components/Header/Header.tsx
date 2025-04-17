import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <nav className="flex gap-4">
        <Link to="/boards">Доски</Link>
        <Link to="/issues">Задачи</Link>
        <button className="ml-auto">Создать задачу</button>
      </nav>
    </header>
  );
}