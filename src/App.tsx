import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import Modal from "./components/ui/modal/Modal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/modal" element={<Modal />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
