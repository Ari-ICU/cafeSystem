import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  MenuOpen as MenuOpenIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ProductionQuantityLimits,
  Category,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import LoginService from "../Services/LoginService";

import type { ReactElement } from "react";

interface MenuItem {
  text: string;
  icon: ReactElement;
  path: string;
  show?: boolean;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await LoginService.isAuthenticated();
        setIsAuthenticatedState(authStatus);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticatedState(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    setActiveItem(currentItem?.text || null);
  }, [location.pathname]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = async (item: MenuItem) => {
    console.log(`Clicked on: ${item.text}`);
    setActiveItem(item.text);

    if (item.text === "Login") {
      navigate("/login");
    } else if (item.text === "Logout") {
      try {
        await LoginService.logout();
        setIsAuthenticatedState(false);
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate(item.path);
    }

    setOpen(false);
  };

  const menuItems: MenuItem[] = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Product", icon: <ProductionQuantityLimits />, path: "/product" },
    { text: "Category", icon: <Category />, path: "/category" },
    { text: "Login", icon: <LoginIcon />, path: "/login", show: !isAuthenticatedState },
    { text: "Logout", icon: <LogoutIcon />, path: "/", show: isAuthenticatedState },
  ];

  const drawerContent = (
    <Box className="p-4 h-full flex flex-col">
      <Typography variant="h6" className="font-bold mb-4">
        Aside
      </Typography>
      <List className="flex-grow">
        {menuItems.map((item, index) =>
          (item.show === undefined || item.show) ? (
            <ListItem key={index} disablePadding className="relative">
              <ListItemButton
                onClick={() => handleItemClick(item)}
                className={activeItem === item.text ? "bg-blue-100 text-black" : ""}
              >
                <ListItemIcon style={{ color: activeItem === item.text ? "black" : "black" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {activeItem === item.text && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </ListItemButton>
            </ListItem>
          ) : null
        )}
      </List>
    </Box>
  );

  return (
    <Box className="flex">
      <div className="md:hidden flex items-center justify-between w-full p-4">
        <Typography variant="h6" className="font-bold">
          Aside
        </Typography>
        <IconButton
          onClick={toggleDrawer}
          aria-label={open ? "Close navigation drawer" : "Open navigation drawer"}
          style={{ backgroundColor: "rgb(0, 244, 255)" }}
          size="large"
        >
          {open ? <MenuOpenIcon style={{ color: "black" }} /> : <MenuIcon style={{ color: "black" }} />}
        </IconButton>
      </div>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        className="md:hidden"
        classes={{ paper: "w-64 bg-gray-800 text-white" }}
      >
        {drawerContent}
      </Drawer>

      <div className="hidden md:block w-72">
        <Drawer
          variant="permanent"
          open
          classes={{ paper: "w-72 bg-gray-800 text-white" }}
        >
          {drawerContent}
        </Drawer>
      </div>
    </Box>
  );
};

export default Sidebar;