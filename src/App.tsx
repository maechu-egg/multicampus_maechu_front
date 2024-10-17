import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CrewModal from "./components/ui/modal/CrewModal";
import CrewIntroModal from "./components/ui/modal/CrewIntroModal";
import CrewBattleModal from "./components/ui/modal/CrewBattleModal";
import CrewBattleFeedModal from "./components/ui/modal/CrewBattleFeedModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/crewmodal" element={<CrewModal />}></Route>
        <Route path="/crewintromodal" element={<CrewIntroModal />}></Route>
        <Route path="/crewbattlemodal" element={<CrewBattleModal />}></Route>
        <Route path="/crewbattlefeedmodal" element={<CrewBattleFeedModal />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
