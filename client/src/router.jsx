// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import SellerLayout from "./components/layout/SellerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import LoadingScreen from "./components/common/LoadingScreen";
import ErrorPage from "./components/common/ErrorPage";
import { useAuth } from "./hooks/useAuth";

// Lazy load components
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const HomePage = lazy(() => import("./pages/buyer/HomePage/HomePage"));
// const ProductDetailPage = lazy(() => import('./components/page/ProductDetailPage'));

// Buyer pages
// const CartPage = lazy(() => import('./components/page/buyer/CartPage'));
// const OrdersPage = lazy(() => import('./components/page/buyer/OrdersPage'));
// const OrderDetailPage = lazy(() => import('./components/page/buyer/OrderDetailPage'));

// Seller pages
// const SellerDashboard = lazy(() => import('./components/page/seller/DashboardPage'));
const ProductsPage = lazy(() =>
  import("./pages/seller/ProductPage/ProductsPage")
);
const SellerOrders = lazy(() => import("./pages/seller/Orders"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement"));
const OrdersManagement = lazy(() => import("./pages/admin/OrderManagment"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
// const ProductForm = lazy(() => import('./components/page/seller/ProductForm'));

// // Admin pages
// const AdminDashboard = lazy(() => import('./components/page/admin/DashboardPage'));
// const UserManagement = lazy(() => import('./components/page/admin/UsersPage'));
// const ProductManagement = lazy(() => import('./components/page/admin/ProductsPage'));
// const CategoryManagement = lazy(() => import('./components/page/admin/CategoriesPage'));

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/seller",
    element: (
      <PrivateRoute allowedRoles={["SELLER"]}>
        <SellerLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerOrders />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      // <PrivateRoute allowedRoles={["ADMIN"]}>
      <AdminLayout />
      // </PrivateRoute>
    ),
    children: [
      // {
      //   index: true,
      //   element: (
      //     <Suspense fallback={<LoadingScreen />}>
      //       <AdminDashboard />
      //     </Suspense>
      //   ),
      // },
      {
        path: "users",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProductManagement />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OrdersManagement />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
