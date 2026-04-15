import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <main style={{
      marginLeft: "var(--sidebar-width)",
      minHeight: "100vh",
      flex: 1,
      padding: "32px",
      maxWidth: "calc(100vw - var(--sidebar-width))",
    }}>
      <Outlet />
    </main>
  </div>
);

export default Layout;