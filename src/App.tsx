import "./App.css";
import AppRouter from "./Router";

function App() {
  // 유저 recoil 세팅 해야함
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<HomePage />}></Route>
    //   </Routes>
    // </BrowserRouter>
    <>
      <AppRouter />
    </>
  );
}

export default App;
