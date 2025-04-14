import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Grid,
    Chip,
    Button,
} from '@mui/material';
import Config from '../../config.json';
import { User, ApiResponse } from '../types/user';

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await fetch(`${Config.backendUrl}/user/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data: ApiResponse<User> = await response.json();
                if (data?.type === 'Success') {
                    setUser(data?.data);
                } else {
                    throw new Error(data?.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={3}>
                <Alert severity="warning">User not found</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">User Details</Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                        <Typography variant="body1">{`${user?.firstName} ${user?.lastName}`}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                        <Typography variant="body1">{user?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
                        <Typography variant="body1">{user?.phoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Extension</Typography>
                        <Typography variant="body1">{user?.extension || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Role</Typography>
                        <Chip 
                            label={user?.role}
                            color={user?.role === 'ADMIN' ? 'primary' : 'default'}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                        <Box display="flex" gap={1}>
                            <Chip 
                                label={user?.isActive ? 'Active' : 'Inactive'}
                                color={user?.isActive ? 'success' : 'error'}
                                size="small"
                            />
                            {user?.isLoginDisabled && (
                                <Chip 
                                    label="Login Disabled"
                                    color="warning"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Channel</Typography>
                        <Typography variant="body1">{user?.channelName || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Last Login</Typography>
                        <Typography variant="body1">
                            {user?.lastLoginTime ? new Date(user?.lastLoginTime).toLocaleString() : 'Never'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                        <Typography variant="body1">{user?.createdAt ? new Date(user?.createdAt).toLocaleString() : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
                        <Typography variant="body1">{user?.updatedAt ? new Date(user?.updatedAt).toLocaleString() : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Login Failure Count</Typography>
                        <Typography variant="body1">{user?.loginFailureCounter || 0}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserDetails; 