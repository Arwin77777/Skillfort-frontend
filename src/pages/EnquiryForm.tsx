import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Grid,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import Config from '../../config.json';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dob: string;
    aadharNumber: string;
    panNumber: string;
    qualification: string;
    yearOfPassOut: string;
    extension: string;
    status: string;
    isActive: boolean;
}

interface FormErrors {
    [key: string]: string;
}

const EnquiryForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dob: '',
        aadharNumber: '',
        panNumber: '',
        qualification: '',
        yearOfPassOut: '',
        extension: '',
        status: 'Pending',
        isActive: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const qualifications = [
        'High School',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD',
        'Diploma',
        'Certificate',
    ];

    const statusOptions = [
        'Pending',
        'In Progress',
        'Completed',
        'Rejected',
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.aadharNumber) {
            newErrors.aadharNumber = 'Aadhar number is required';
        } else if (!/^[0-9]{12}$/.test(formData.aadharNumber)) {
            newErrors.aadharNumber = 'Aadhar number must be 12 digits';
        }
        if (!formData.panNumber) {
            newErrors.panNumber = 'PAN number is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
            newErrors.panNumber = 'Invalid PAN number format';
        }
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (!formData.yearOfPassOut) newErrors.yearOfPassOut = 'Year of pass out is required';
        if (!formData.status) newErrors.status = 'Status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            setSubmitSuccess(true);
            try{
                console.log(formData);
                const response = await fetch(`${Config.backendUrl}/candidate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if(response.ok){
                    setSubmitSuccess(true);
                }else{
                    setSubmitSuccess(false);
                }
            }catch(error){
                console.error('Error submitting form:', error);
            }
            // Reset form after successful submission
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 2,
                    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
                }}
            >
                <Stack spacing={3}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                mb: 1
                            }}
                        >
                            Candidate Enquiry Form
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please fill in your details below
                        </Typography>
                    </Box>

                    {submitSuccess && (
                        <Alert
                            severity="success"
                            sx={{
                                borderRadius: 1,
                                animation: 'fadeIn 0.5s ease-in'
                            }}
                        >
                            Form submitted successfully!
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <PersonIcon /> Personal Information
                                </Typography>
                                
                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="firstName"
                                            label="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="lastName"
                                            label="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            InputProps={{
                                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="phoneNumber"
                                            label="Phone Number"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber}
                                            InputProps={{
                                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        name="address"
                                        label="Address"
                                        multiline
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        InputProps={{
                                            startAdornment: <HomeIcon sx={{ mr: 1, mt: 1, color: 'action.active' }} />
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <BadgeIcon /> Identity Information
                                </Typography>

                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="dob"
                                            label="Date of Birth"
                                            type="date"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            error={!!errors.dob}
                                            helperText={errors.dob}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: <CakeIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="aadharNumber"
                                            label="Aadhar Number"
                                            value={formData.aadharNumber}
                                            onChange={handleChange}
                                            error={!!errors.aadharNumber}
                                            helperText={errors.aadharNumber}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="panNumber"
                                            label="PAN Number"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            error={!!errors.panNumber}
                                            helperText={errors.panNumber}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="extension"
                                            label="Extension"
                                            value={formData.extension}
                                            onChange={handleChange}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <SchoolIcon /> Educational Information
                                </Typography>

                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="qualification"
                                            select
                                            label="Qualification"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            error={!!errors.qualification}
                                            helperText={errors.qualification}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        >
                                            {qualifications.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="yearOfPassOut"
                                            label="Year of Pass Out"
                                            value={formData.yearOfPassOut}
                                            onChange={handleChange}
                                            error={!!errors.yearOfPassOut}
                                            helperText={errors.yearOfPassOut}
                                            type="number"
                                            InputProps={{ inputProps: { min: 1900, max: 2099 } }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <WorkIcon /> Status Information
                                </Typography>

                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="status"
                                            select
                                            label="Status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            error={!!errors.status}
                                            helperText={errors.status}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                        >
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="isActive"
                                                    checked={formData.isActive}
                                                    onChange={handleChange}
                                                    color="primary"
                                                />
                                            }
                                            label="Active Status"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 1,
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0'
                                    }
                                }}
                            >
                                Submit Application
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
};

export default EnquiryForm;
