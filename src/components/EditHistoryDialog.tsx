import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Alert,
    Grid,
} from '@mui/material';
import Config from '../../config.json';
import type { EnquiryHistory } from '../types/enquiry';

interface EditHistoryDialogProps {
    open: boolean;
    onClose: () => void;
    history: EnquiryHistory;
    onUpdate: (updatedHistory: EnquiryHistory) => void;
}

const responseStatusOptions = [
    { value: 'RESPONDED', label: 'Responded' },
    { value: 'NOTRESPONDED', label: 'Not Responded' },
    { value: 'REFUSED', label: 'Refused' }
];

const EditHistoryDialog: React.FC<EditHistoryDialogProps> = ({ open, onClose, history, onUpdate }) => {
    const [formData, setFormData] = useState<EnquiryHistory>(history);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setFormData(history);
    }, [history]);

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
                    'Token': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update history');
            }

            const data = await response.json();
            if (data.type === 'Success') {
                onUpdate(data.data);
                onClose();
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Enquiry History</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Attender Comment"
                            name="attenderComment"
                            value={formData?.attenderComment}
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
                            value={formData?.candidateComment}
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
                            value={formData?.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
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
                            value={formData?.callBackDate ? new Date(formData.callBackDate).toISOString().split('T')[0] : ''}
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
                                value={formData?.responseStatus}
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
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdate} variant="contained" color="primary">
                    Update History
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditHistoryDialog; 