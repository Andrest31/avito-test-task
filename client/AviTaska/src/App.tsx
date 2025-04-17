import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import IssuesPage from "./pages/IssuesPage/IssuesPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/" element={<BoardsPage />} /> // Перенаправление на /boards
      </Routes>
    </BrowserRouter>
  );
}

export default App
