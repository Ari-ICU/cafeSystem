
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export const Footer = () => {
    const navigate = useNavigate();
  return (

    <div>
          {/* Footer */}
          <Box className="bg-gray-800 p-4 text-center">
            <Typography variant="body2" className="text-gray-400">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Typography>
          </Box>
    </div>
  )
}

export default Footer;
