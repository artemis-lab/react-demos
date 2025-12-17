import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "../Footer";
import { Header } from "../Header";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-blue-50 to-purple-50">
      {!isHomePage && <Header />}

      <main className="grow p-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
