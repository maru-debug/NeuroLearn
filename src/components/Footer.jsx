function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "10px 16px",
        fontSize: "12px",
        color: "#6b7280",
        backgroundColor: "#ffffff",
      }}
    >
      © {new Date().getFullYear()} Интеллектуальная рекомендательная система
      для обучения — учебный проект
    </footer>
  );
}

export default Footer;