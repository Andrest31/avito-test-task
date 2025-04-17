import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import IssuesPage from "./pages/IssuesPage/IssuesPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/boards" element={<BoardsPage />} />
              <Route path="/board/:id" element={<BoardPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/" element={<BoardsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;