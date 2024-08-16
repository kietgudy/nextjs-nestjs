"use client";

import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;
  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Manage User ©{new Date().getFullYear()} By Admin Kiet
      </Footer>
    </>
  );
};

export default AdminFooter;
