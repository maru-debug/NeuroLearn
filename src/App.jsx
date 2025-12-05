import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="catalog" element={<CatalogPage />} />
      </Route>
    </Routes>
  );
}

export default App;
