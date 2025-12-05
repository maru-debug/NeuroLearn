function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="container py-4 text-xs sm:text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
        <span>
          © {new Date().getFullYear()} Интеллектуальная рекомендательная система
          для обучения
        </span>
        <span>Учебный проект (демо-версия системы рекомендаций)</span>
      </div>
    </footer>
  );
}

export default Footer;