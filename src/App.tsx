import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppRouter from "./Router";

import HomePage from "./pages/home/HomePage";

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
