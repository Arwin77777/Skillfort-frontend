import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
    

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const Home: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1">Home</Typography>
            <Typography variant="h2">Welcome to the Home page</Typography>
        </Box>
    );
};

export default Home;
