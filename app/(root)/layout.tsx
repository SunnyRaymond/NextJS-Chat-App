/* eslint-disable @typescript-eslint/no-empty-object-type */
import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";
import React from "react";

type props = React.PropsWithChildren<{}>;

const Layout = ({ children }: props) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;
