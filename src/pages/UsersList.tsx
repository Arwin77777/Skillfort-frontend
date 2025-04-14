import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    TablePagination,
    Chip,
    TextField,
    Autocomplete,
    debounce,
} from '@mui/material';
import Config from '../../config.json';
import { User, ApiResponse } from '../types/user';

interface AutocompleteUser {
    userId: number;
    firstName: string;
    lastName: string;
}

const UsersList: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState<AutocompleteUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (!query.trim()) {
                setSearchSuggestions([]);
                setIsSearching(false);
                setIsSearchActive(false);
                fetchUsers();
                return;
            }

            const searchUsers = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate('/');
                        return;
                    }

                    setIsSearchActive(true);
                    const response = await fetch(`${Config.backendUrl}/user/autocomplete?name=${encodeURIComponent(query)}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': token,
                        },
                    });

                    if (!response.ok) {
                        setSearchSuggestions([]);
                        setUsers([]);
                        setTotalRecords(0);
                        return;
                    }

                    const data: ApiResponse<AutocompleteUser[]> = await response.json();
                    if (data?.type === 'Success' && data?.data?.length > 0) {
                        setSearchSuggestions(data?.data);
                        const userPromises = data?.data?.map(user => fetchUsers(user?.userId));
                        await Promise.all(userPromises);
                    } else {
                        setSearchSuggestions([]);
                        setUsers([]);
                        setTotalRecords(0);
                    }
                } catch (err) {
                    console.log(err);
                    setSearchSuggestions([]);
                    setUsers([]);
                    setTotalRecords(0);
                } finally {
                    setIsSearching(false);
                }
            };

            searchUsers();
        }, 300),
        [navigate]
    );

    const fetchUsers = async (userId?: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            
            const url = userId 
                ? `${Config.backendUrl}/user/${userId}`
                : `${Config.backendUrl}/user`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data: ApiResponse<User[]> = await response.json();
            if (data?.type === 'Success') {
                if (userId) {
                    // If fetching a single user, add it to the existing users
                    const newUser = Array.isArray(data?.data) ? data?.data[0] : data?.data;
                    setUsers(prevUsers => {
                        const userExists = prevUsers?.some(u => u?.ID === newUser?.ID);
                        if (!userExists) {
                            return [...prevUsers, newUser];
                        }
                        return prevUsers;
                    });
                } else {
                    setUsers(Array.isArray(data?.data) ? data?.data : [data?.data]);
                    setTotalRecords(data?.pageMetaData?.totalRecords || (Array.isArray(data?.data) ? data?.data?.length : 1));
                }
            } else {
                throw new Error(data?.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigate]);

    const handleSearchChange = (event: React.SyntheticEvent, value: string) => {
        console.log(event, value);
        setSearchQuery(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    const handleSearchSelect = (event: React.SyntheticEvent, value: AutocompleteUser | string | null) => {
        console.log(event, value);
        if (value && typeof value !== 'string') {
            setUsers([]); // Clear existing users
            fetchUsers(value.userId);
        } else if (!value) {
            setIsSearchActive(false);
            fetchUsers();
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        console.log(event, newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (userId: number) => {
        navigate(`/user/${userId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Users List
                </Typography>
                <Autocomplete
                    freeSolo
                    options={searchSuggestions}
                    getOptionLabel={(option) => 
                        typeof option === 'string' ? option : `${option.firstName} ${option.lastName}`
                    }
                    value={searchQuery}
                    onInputChange={handleSearchChange}
                    onChange={handleSearchSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Users"
                            variant="outlined"
                            size="small"
                            sx={{ width: 300 }}
                        />
                    )}
                    loading={isSearching}
                    loadingText="Searching..."
                    noOptionsText="No users found"
                />
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell>Channel</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    {isSearchActive ? 'No users match your search' : 'No users found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            users?.map((user) => (
                                <TableRow 
                                    key={user?.ID}
                                    onClick={() => handleRowClick(user?.ID)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{user?.ID}</TableCell>
                                    <TableCell>{`${user?.firstName} ${user?.lastName}`}</TableCell>
                                    <TableCell>{user?.email}</TableCell>
                                    <TableCell>{user?.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user?.role}
                                            color={user?.role === 'ADMIN' ? 'primary' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user?.isActive ? 'Active' : 'Inactive'}
                                            color={user?.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user?.lastLoginTime ? new Date(user?.lastLoginTime).toLocaleString() : 'Never'}
                                    </TableCell>
                                    <TableCell>{user?.channelName || '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalRecords}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default UsersList;
