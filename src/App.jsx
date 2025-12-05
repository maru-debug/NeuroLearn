import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="my-courses" element={<MyCoursesPage />} />
        </Route>

        {/* Публичные страницы */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
