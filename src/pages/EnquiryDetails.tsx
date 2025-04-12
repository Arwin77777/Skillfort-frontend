import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
} from '@mui/material';
import Config from '../../config.json';
import type { EnquiryDetails as EnquiryDetailsType, EnquiryHistory, ApiResponse } from '../types/enquiry';
import EnquiryHistoryTable from '../components/EnquiryHistoryTable';
import EditHistoryDialog from '../components/EditHistoryDialog';

interface EditableEnquiryFields {
    candidateId: number;
    course: string;
    currentlyWorking: boolean;
    isActive: boolean;
    placementRequired: boolean;
    profession: string;
    referredBy: string;
    referrerPhoneNumber: string;
    source: string;
    totalExperience: number;
}

interface EditEnquiryDialogProps {
    open: boolean;
    onClose: () => void;
    enquiry: EnquiryDetailsType;
    onUpdate: (updatedEnquiry: EnquiryDetailsType) => void;
}

const EditEnquiryDialog: React.FC<EditEnquiryDialogProps> = ({ open, onClose, enquiry, onUpdate }) => {
    const [formData, setFormData] = useState<EditableEnquiryFields>({
        candidateId: enquiry.candidateId,
        course: enquiry.course,
        currentlyWorking: enquiry.currentlyWorking,
        isActive: enquiry.isActive || false,
        placementRequired: enquiry.placementRequired,
        profession: enquiry.profession,
        referredBy: enquiry.referredBy,
        referrerPhoneNumber: enquiry.referrerPhoneNumber,
        source: enquiry.source,
        totalExperience: enquiry.totalExperience,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log(formData);
            const token = localStorage.getItem('token');
            const response = await fetch(`${Config.backendUrl}/enquiry/${enquiry.enquiryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update enquiry');
            }

            const updatedEnquiry = { ...enquiry, ...formData };
            onUpdate(updatedEnquiry);
            onClose();
        } catch (error) {
            console.error('Error updating enquiry:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Enquiry Details</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="Course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Referred By"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Referrer Phone Number"
                        name="referrerPhoneNumber"
                        value={formData.referrerPhoneNumber}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Total Experience"
                        name="totalExperience"
                        type="number"
                        value={formData.totalExperience}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.currentlyWorking}
                                onChange={handleChange}
                                name="currentlyWorking"
                            />
                        }
                        label="Currently Working"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.placementRequired}
                                onChange={handleChange}
                                name="placementRequired"
                            />
                        }
                        label="Placement Required"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleChange}
                                name="isActive"
                            />
                        }
                        label="Is Active"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const EnquiryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [enquiry, setEnquiry] = useState<EnquiryDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<EnquiryHistory | null>(null);
    const [editEnquiryDialogOpen, setEditEnquiryDialogOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEnquiryDetails = async () => {
            try {
                const response = await fetch(`${Config.backendUrl}/enquiry/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': `${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch enquiry details');
                }
                const data: ApiResponse<EnquiryDetailsType> = await response.json();
                setEnquiry(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiryDetails();
    }, [id]);

    const handleHistoryRowClick = (history: EnquiryHistory) => {
        console.log(history);
        setSelectedHistory(history);
        setEditDialogOpen(true);
    };

    const handleHistoryUpdate = (updatedHistory: EnquiryHistory) => {
        if (enquiry) {
            const updatedHistories = enquiry.enquiryHistories.map(history =>
                history.id === updatedHistory.id ? updatedHistory : history
            );
            setEnquiry({ ...enquiry, enquiryHistories: updatedHistories });
        }
    };

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

    if (!enquiry) {
        return (
            <Box p={3}>
                <Alert severity="warning">Enquiry not found</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Enquiry Details</Typography>
                    <Button variant="contained" color="primary" onClick={() => setEditEnquiryDialogOpen(true)}>
                        Edit Details
                    </Button>
                </Box>
                <Box mb={3}>
                    <Typography variant="h6">Course: {enquiry.course}</Typography>
                    <Typography variant="body1">Source: {enquiry.source}</Typography>
                    <Typography variant="body1">Status: {enquiry.status}</Typography>
                    <Typography variant="body1">Placement Required: {enquiry.placementRequired ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1">Currently Working: {enquiry.currentlyWorking ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1">Profession: {enquiry.profession}</Typography>
                    <Typography variant="body1">Referred By: {enquiry.referredBy}</Typography>
                    <Typography variant="body1">Referrer Phone: {enquiry.referrerPhoneNumber}</Typography>
                    <Typography variant="body1">Total Experience: {enquiry.totalExperience} years</Typography>
                    <Typography variant="body1">Is Active: {enquiry.isActive ? 'Yes' : 'No'}</Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Paper>

            <Typography variant="h5" gutterBottom>
                Enquiry History
            </Typography>
            <EnquiryHistoryTable
                histories={enquiry.enquiryHistories}
                onRowClick={handleHistoryRowClick}
            />

            <EditHistoryDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                history={selectedHistory!}
                onUpdate={handleHistoryUpdate}
            />

            {enquiry && (
                <EditEnquiryDialog
                    open={editEnquiryDialogOpen}
                    onClose={() => setEditEnquiryDialogOpen(false)}
                    enquiry={enquiry}
                    onUpdate={setEnquiry}
                />
            )}
        </Box>
    );
};

export default EnquiryDetails; 