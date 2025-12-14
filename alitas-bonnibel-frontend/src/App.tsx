import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PublicHomePage from "./pages/PublicHomePage";
import MenuPage from "./pages/MenuPage";
import NosotrosPage from "./pages/NosotrosPage";
import SucursalesPage from "./pages/SucursalesPage";
import ContactoPage from "./pages/ContactoPage";
import OrdersPage from "./pages/OrdersPage";
import KitchenPage from "./pages/KitchenPage";
import UsersPage from "./pages/UsersPage";
import MenuAdminPage from "./pages/MenuAdminPage";
import TablesPage from "./pages/TablesPage";
import NewOrderPage from "./pages/NewOrderPage";

function PrivateRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />
      <Route path="/sucursales" element={<SucursalesPage />} />
      <Route path="/contacto" element={<ContactoPage />} />

      {/* Login admin */}
      <Route path="/login" element={<LoginPage />} />

      {/* Panel admin */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/kitchen"
        element={
          <PrivateRoute>
            <KitchenPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/menu-admin"
        element={
          <PrivateRoute>
            <MenuAdminPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/tables"
        element={
          <PrivateRoute>
            <TablesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders/new"
        element={
          <PrivateRoute>
            <NewOrderPage />
          </PrivateRoute>
        }
      />


      {/* Cualquier otra ruta manda a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
