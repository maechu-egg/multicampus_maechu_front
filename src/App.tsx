import "./App.css";
import AppRouter from "./Router";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider 임포트

function App() {
  // 유저 recoil 세팅 해야함
  return (
    <AuthProvider>
      {" "}
      {/* AuthProvider로 애플리케이션 감싸기 */}
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
