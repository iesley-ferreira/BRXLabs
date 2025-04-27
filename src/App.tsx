import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ServicoRouter from "./pages/Servicos/ServicoRouter";
import Dashboard from "./pages/UserDashboard/UserDashboard";
import AdminRoute from "./routes/AdminRoute";
// import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cliente" element={<Dashboard />} />
      <Route path="/servicos/:path" element={<ServicoRouter />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
