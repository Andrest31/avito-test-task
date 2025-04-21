import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import IssuesPage from "./pages/IssuesPage/IssuesPage";
import Header from "./components/Header/Header";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  return (
    <BrowserRouter>
      <AppWithHeader />
    </BrowserRouter>
  );
}

interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

function AppWithHeader() {
  const location = useLocation();
  const isBoardPage = location.pathname.startsWith("/board/");

  const [allAssignees, setAllAssignees] = useState<Assignee[]>([]);

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const assigneesResponse = await fetch('http://localhost:8080/api/v1/users');
        if (!assigneesResponse.ok) throw new Error('Ошибка загрузки пользователей');
        const assigneesData = await assigneesResponse.json();
        setAllAssignees(assigneesData.data || []);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    };

    fetchAssignees();
  }, []);

  return (
    <div className="app">
      {!isBoardPage && <Header allAssignees={allAssignees}/>} {/* не показываем Header на /boards */}
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/" element={<BoardsPage />} />
      </Routes>
    </div>
  );
}

export default App;
