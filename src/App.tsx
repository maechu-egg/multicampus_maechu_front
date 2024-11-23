import "./App.css";
import AppRouter from "./Router";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider 임포트
import { ScrollToTop } from "./components/ui/scrolltotop/ScrollToTop";

function App() {
  // 유저 recoil 세팅 해야함
  return (
    <AuthProvider>
      {" "}
      {/* AuthProvider로 애플리케이션 감싸기 */}
      <AppRouter />
      <ScrollToTop />
    </AuthProvider>
  );
}

export default App;
