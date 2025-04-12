import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    ChannelId: number;
    ChannelName: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Role: string;
    UserId: number;
    exp: number;
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const token = localStorage.getItem('token');
    
    let decodedToken: DecodedToken | null = null;
    try {
        if (token) {
            decodedToken = jwtDecode(token) as DecodedToken;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }

    const isAdmin = decodedToken?.Role === 'ADMIN';
    const userInitials = decodedToken ? 
        `${decodedToken.FirstName[0]}${decodedToken.LastName[0]}`.toUpperCase() 
        : '';

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    SkillFort
                </Typography>

                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/enquiries')}
                    >
                        Enquiries
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/students')}
                    >
                        Students
                    </Button>
                    {isAdmin && (
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/users')}
                        >
                            Users
                        </Button>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {decodedToken && (
                        <Chip
                            label={`${decodedToken.FirstName} ${decodedToken.LastName}`}
                            color="secondary"
                            size="small"
                        />
                    )}
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {userInitials}
                        </Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem 
                            onClick={handleClose}
                            sx={{ pointerEvents: 'none' }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                {decodedToken?.Email}
                            </Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={handleClose}
                            sx={{ pointerEvents: 'none' }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                Role: {decodedToken?.Role}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleClose();
                            navigate('/profile');
                        }}>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 