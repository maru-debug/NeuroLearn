import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
  const { user } = useAuth();

  // Если пользователь не авторизован — отправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован — рендерим вложенные маршруты
  return <Outlet />;
}

export default ProtectedRoute;