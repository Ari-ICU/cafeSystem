import React, { useState } from "react";
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
  ContactMail as ContactIcon,
  MenuOpen as MenuOpen,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ProductionQuantityLimits,
  Category,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = (item: { text: string; path: string }) => {
    console.log(`Clicked on: ${item.text}`);
    setActiveItem(item.text);

    // Handle login/logout logic
    if (item.text === "Login") {
      setShowLogin(true);
    } else if (item.text === "Logout") {
      setShowLogin(false);
    }

    // Navigate to the corresponding path
    navigate(item.path);
    // Close the drawer after clicking an item
    setOpen(false);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Product", icon: <ProductionQuantityLimits />, path: "/product" },
    { text: "Category", icon: <Category />, path: "/category" },
    { text: "Contact", icon: <ContactIcon />, path: "/contact" },
    { text: "Login", icon: <LoginIcon />, path: "/login", show: !showLogin },
    { text: "Logout", icon: <LogoutIcon />, path: "/", show: showLogin },
  ];

  const drawerContent = (
    <Box className="p-4 h-full flex flex-col">
      <Typography variant="h6" className="font-bold mb-4">
        Aside
      </Typography>
      <List className="flex-grow">
        {menuItems.slice(0, 4).map((item, index) => (
          <ListItem key={index} disablePadding className="relative">
            <ListItemButton
              onClick={() => handleItemClick(item)}
              className={`${activeItem === item.text ? "" : ""}`}
            >
              <ListItemIcon style={{ color: "black" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {activeItem === item.text && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        {menuItems
          .slice(3)
          .filter((item) => item.show) // only show items where `show === true`
          .map((item, index) => (
            <ListItem key={index + 3} disablePadding className="relative">
              <ListItemButton
                onClick={() => handleItemClick(item)}
                className={`${activeItem === item.text ? "" : ""}`}
              >
                <ListItemIcon style={{ color: "black" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {activeItem === item.text && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box className="flex" style={{ padding: "10px" }}>
      {/* Mobile: Show toggle button and temporary drawer */}
      <div className="md:hidden flex items-center justify-between w-full">
        <Typography variant="h6" className="font-bold">
          Aside
        </Typography>
        <IconButton
          className="m-2 bg-gray-800 hover:bg-gray-900 transition-colors duration-200"
          onClick={toggleDrawer}
          aria-label={
            open ? "Close navigation drawer" : "Open navigation drawer"
          }
          style={{ backgroundColor: "rgb(0, 244, 255)" }}
        >
          {open ? (
            <MenuOpen style={{ color: "black" }} />
          ) : (
            <MenuIcon style={{ color: "black" }} />
          )}
        </IconButton>
      </div>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        className="md:hidden w-64"
        classes={{
          paper: "w-64 bg-gray-800 text-white",
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop: Permanent sidebar */}
      <div className="hidden md:block w-72">
        <Drawer
          variant="permanent"
          open
          className="w-72"
          classes={{
            paper: "w-72 bg-gray-800 text-white",
          }}
        >
          {drawerContent}
        </Drawer>
      </div>
    </Box>
  );
};

export default Sidebar;
