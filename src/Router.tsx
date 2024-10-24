import {
  BrowserRouter,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CrewHeader from "pages/crew/CrewHeader";
import MyPage from "./pages/mypage/MyPage";
import CommunityPage from "./pages/community/CommunityPage";
import RecodePage from "./pages/recode/RecodePage";
import AboutPage from "./pages/about/AboutPage";
import LoginPage from "./pages/login/LoginPage";
import Header from "../src/components/layout/Header";

import BadgeStatusPage from "pages/badge/BadgeStatusPage";


function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/crewpage" element={<CrewHeader />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/communitypage" element={<CommunityPage />}></Route>
        <Route path="/recodepage" element={<RecodePage />}></Route>
        <Route path="/aboutpage" element={<AboutPage />}></Route>
        <Route path="/loginpage" element={<LoginPage />}></Route>
        <Route path="/badgestatuspage" element={<BadgeStatusPage />}></Route>
 
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
