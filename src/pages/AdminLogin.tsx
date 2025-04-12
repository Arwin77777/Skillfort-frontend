import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Container,
} from '@mui/material';
import Config from '../../config.json';

interface LoginForm {
    email: string;
    password: string;
}

interface LoginResponse {
    data: string;
    message: string;
    type: string;
}

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${Config.backendUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.type === 'Success') {
                console.log(data.data);
                localStorage.setItem('token', data.data);
                // Redirect to the main page or dashboard
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Admin Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default AdminLogin;
