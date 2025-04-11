import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Alert,
} from '@mui/material';
import Config from '../../config.json';

interface EnquiryHistoryDetails {
    attenderComment: string;
    attenderId: number;
    callBackDate: string;
    candidateComment: string;
    enquiryDate: string;
    enquiryId: number;
    id: number;
    isActive: boolean;
    joiningDate: string;
    responseStatus: string;
}

const responseStatusOptions = [
    { value: 'RESPONDED', label: 'Responded' },
    { value: 'NOT_RESPONDED', label: 'Not Responded' },
    { value: 'REFUSED', label: 'Refused' }
];

const EnquiryHistoryDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const history = location.state?.history as EnquiryHistoryDetails;
    
    const [formData, setFormData] = useState<EnquiryHistoryDetails>(history || {
        attenderComment: '',
        attenderId: 0,
        callBackDate: '',
        candidateComment: '',
        enquiryDate: '',
        enquiryId: 0,
        id: 0,
        isActive: true,
        joiningDate: '',
        responseStatus: 'NOT_RESPONDED'
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!history) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">No history data found</Alert>
            </Box>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${Config.backendUrl}/enquiryHistory/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update history');
            }

            setUpdateSuccess(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating');
            setUpdateSuccess(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Enquiry History Details
            </Typography>
            {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    History updated successfully
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Attender Comment"
                            name="attenderComment"
                            value={formData.attenderComment}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Candidate Comment"
                            name="candidateComment"
                            value={formData.candidateComment}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Joining Date"
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Call Back Date"
                            type="date"
                            name="callBackDate"
                            value={formData.callBackDate ? new Date(formData.callBackDate).toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Response Status</InputLabel>
                            <Select
                                name="responseStatus"
                                value={formData.responseStatus}
                                onChange={handleSelectChange}
                                label="Response Status"
                            >
                                {responseStatusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdate}
                            >
                                Update History
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default EnquiryHistoryDetails; 