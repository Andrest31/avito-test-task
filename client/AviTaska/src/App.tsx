import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import IssuesPage from "./pages/IssuesPage/IssuesPage";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppWithHeader />
    </BrowserRouter>
  );
}

function AppWithHeader() {
  const location = useLocation();
  const isBoardPage = location.pathname.startsWith("/board/");

  return (
    <div className="app">
      {!isBoardPage && <Header />} {/* не показываем Header на /boards */}
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
