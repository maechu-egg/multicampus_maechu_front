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
import RecordPage from "./pages/recode/RecordPage";
import AboutPage from "./pages/about/AboutPage";
import LoginPage from "./pages/login/LoginPage";
import Header from "../src/components/layout/Header";
import Footer from "components/layout/Footer";
import SignPage from "./pages/login/SignPage";
import ForgotPwPage from "./pages/login/ForgotPwPage";
import UserInfoPage from "./pages/login/UserInfoPage";
import ProfilePage from "./pages/login/ProfilePage";

import BadgeStatusPage from "pages/badge/BadgeStatusPage";
import DietPage from "pages/recode/diet/ai/DietPage";
import DietDetailPage from "pages/recode/diet/DietDetailPage";
import ExercisePage from "pages/recode/exercise/ExercisePage";
function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signpage" element={<SignPage />}></Route>
        <Route path="/forgotpwpage" element={<ForgotPwPage />}></Route>
        <Route path="/userinfopage" element={<UserInfoPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/crewpage" element={<CrewHeader />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/communitypage" element={<CommunityPage />}></Route>
        <Route path="/recordpage" element={<RecordPage />}></Route>
        <Route path="/record/exercise/:selectedDate" element={<ExercisePage />}></Route>
        <Route path="/record/diet/:selectedDate" element={<DietPage />}></Route>
        <Route path="/record/diet/:selectedDate/:food" element={<DietDetailPage />}></Route>
        <Route path="/aboutpage" element={<AboutPage />}></Route>
        <Route path="/loginpage" element={<LoginPage />}></Route>
        <Route path="/badgestatuspage" element={<BadgeStatusPage />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;
