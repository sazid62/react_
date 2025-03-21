import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Reg from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { useSelector } from "react-redux";
import { stateStruct } from "./interfaces/user_interface";
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const current_user = useSelector((state: stateStruct) => state.currentuser);
  if (!current_user.email) {
    navigate("/");
  }
  return (
    <>
      {location.pathname === "/home" && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Reg />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
