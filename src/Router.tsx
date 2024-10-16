import {
  BrowserRouter,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CrewPage from "./pages/crew/CrewPage";
import MyPage from "./pages/mypage/MyPage";
import CommunityPage from "./pages/community/CommunityPage";
import RecodePage from "./pages/recode/RecodePage";
import AboutPage from "./pages/about/AboutPage";
import LoginPage from "./pages/login/LoginPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/crewpage" element={<CrewPage />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/communitypage" element={<CommunityPage />}></Route>
        <Route path="/recodepage" element={<RecodePage />}></Route>
        <Route path="/aboutpage" element={<AboutPage />}></Route>
        <Route path="/loginpage" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
