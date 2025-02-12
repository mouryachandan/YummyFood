import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "../components/pages/navbar";
import Login from "../components/pages/Login";
import Home from "../components/pages/Homepage";
import AdminDashboard from "../components/pages/AdminDashboard";
import Idli from "../components/pages/foodpage";
import Menu from "../components/pages/Menu";
import About from "../components/pages/About";
import CartPage from "../components/pages/CartPage";
import ErrorPage from "../components/pages/ErrorPage"; 

interface AppRoutesProps {
  cart: any[];
  onAddToCart: (food: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userId: number;
}


const Layout: React.FC<AppRoutesProps> = ({ cart, searchQuery, setSearchQuery }) => {
  return (
    <>
      <Navbar cart={cart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Outlet />
    </>
  );
};


const createRouter = (props: AppRoutesProps) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <ErrorPage />, 
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/",
      element: <Layout {...props} />, 
      children: [
        {
           path: "home",
            element: <Home />
       },
        { 
          path: "food/:name",
           element: <Idli />
        },
        {
           path: "menu",
           element: <Menu cart={props.cart} onAddToCart={props.onAddToCart} searchQuery={props.searchQuery} /> 
        },
        {
           path: "about",
           element: <About /> 
        },
        {
           path: "cart",
           element: <CartPage userId={props.userId} /> 
        },
      ],
    },
  ]);


const AppRoutes: React.FC<AppRoutesProps> = (props) => {
  return <RouterProvider router={createRouter(props)} />;
};

export default AppRoutes;
