import React from 'react';
import { Box, Typography } from '@mui/material';


const Home: React.FC = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1">Home</Typography>
            <Typography variant="h2">Welcome to the Home page</Typography>
        </Box>
    );
};

export default Home;
