import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import IssuesPage from "./pages/IssuesPage/IssuesPage";
import "./App.css";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/" element={<BoardsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;