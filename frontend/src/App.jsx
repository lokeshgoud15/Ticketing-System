import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import MainContainer from "./pages/MainContainer/MainContainer";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((store) => store.user.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <MainContainer /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
