
import { Box, Typography } from '@mui/material';
export const Footer = () => {
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
