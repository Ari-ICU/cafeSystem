import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Aside from "./Aside"; // Assuming Aside is the sidebar component

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Aside />
      <div>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          p={2}
        >
          <Typography variant="h2" color="error" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Oops! Page Not Found.
          </Typography>
          <Typography variant="body1" mb={4}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default NotFound;
