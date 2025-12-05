import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 12px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#1f2933",
    backgroundColor: isActive ? "#4f46e5" : "transparent",
    borderRadius: "6px",
    fontSize: "14px",
  });

  return (
    <nav
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "14px" }}>
        Интеллектуальная рекомендательная система для обучения
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <NavLink to="/" end style={linkStyle}>
          Главная
        </NavLink>
        <NavLink to="/materials" style={linkStyle}>
          Материалы
        </NavLink>
        <NavLink to="/catalog" style={linkStyle}>
          Каталог
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;