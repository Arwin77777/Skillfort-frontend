import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Chip,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import Config from '../../config.json';

interface Attender {
    ID: number;
    channelId: number;
    channelName: string;
    createdAt: string;
    createdById: number;
    email: string;
    extension: string;
    firstName: string;
    isActive: boolean;
    isLoggedIn: boolean;
    isLoginDisabled: boolean;
    lastLoginTime: string;
    lastName: string;
    loginFailureCounter: number;
    phoneNumber: string;
    resetPasswordString: string;
    role: string;
    updatedAt: string;
    updatedById: number;
}

interface EnquiryHistory {
    attender: Attender;
    attenderComment: string;
    attenderId: number;
    callBackDate: string;
    candidateComment: string;
    enquiryDate: string;
    enquiryHistoryId: number;
    enquiryId: number;
    joiningDate: string;
    responseStatus: string;
}

interface EnquiryDetails {
    candidateId: number;
    course: string;
    currentlyWorking: boolean;
    enquiryHistories: EnquiryHistory[];
    enquiryId: number;
    placementRequired: boolean;
    profession: string;
    referredBy: string;
    referrerPhoneNumber: string;
    source: string;
    totalExperience: number;
}

interface EnquiryUpdatePayload {
    candidateId: number;
    course: string;
    currentlyWorking: boolean;
    id: number;
    isActive: boolean;
    placementRequired: boolean;
    profession: string;
    referredBy: string;
    referrerPhoneNumber: string;
    source: string;
    totalExperience: number;
}

interface EnquiryHistoryForm {
    attenderComment: string;
    candidateComment: string;
    joiningDate: Date | null;
    callBackDate: Date | null;
    responseStatus: string;
}

// Dummy data for testing
const dummyEnquiryDetails: EnquiryDetails = {
    candidateId: 1,
    course: "Full Stack Development",
    currentlyWorking: true,
    enquiryHistories: [
        {
            attender: {
                ID: 1,
                channelId: 1,
                channelName: "Main Channel",
                createdAt: "2024-01-01T10:00:00Z",
                createdById: 1,
                email: "john.attender@example.com",
                extension: "Ext1",
                firstName: "John",
                isActive: true,
                isLoggedIn: true,
                isLoginDisabled: false,
                lastLoginTime: "2024-03-20T15:30:00Z",
                lastName: "Attender",
                loginFailureCounter: 0,
                phoneNumber: "9876543210",
                resetPasswordString: "",
                role: "ADMIN",
                updatedAt: "2024-03-20T15:30:00Z",
                updatedById: 1
            },
            attenderComment: "Candidate seems interested in the course. Good communication skills.",
            attenderId: 1,
            callBackDate: "2024-03-25T14:00:00Z",
            candidateComment: "I'm very interested in learning full stack development.",
            enquiryDate: "2024-03-20T10:00:00Z",
            enquiryHistoryId: 1,
            enquiryId: 1,
            joiningDate: "2024-04-01T00:00:00Z",
            responseStatus: "PENDING"
        },
        {
            attender: {
                ID: 2,
                channelId: 1,
                channelName: "Main Channel",
                createdAt: "2024-01-02T10:00:00Z",
                createdById: 1,
                email: "jane.attender@example.com",
                extension: "Ext2",
                firstName: "Jane",
                isActive: true,
                isLoggedIn: true,
                isLoginDisabled: false,
                lastLoginTime: "2024-03-21T16:00:00Z",
                lastName: "Attender",
                loginFailureCounter: 0,
                phoneNumber: "9876543211",
                resetPasswordString: "",
                role: "SUPERADMIN",
                updatedAt: "2024-03-21T16:00:00Z",
                updatedById: 2
            },
            attenderComment: "Followed up with candidate. Confirmed interest in joining.",
            attenderId: 2,
            callBackDate: "2024-03-28T11:00:00Z",
            candidateComment: "I have completed the prerequisites and ready to join.",
            enquiryDate: "2024-03-21T11:00:00Z",
            enquiryHistoryId: 2,
            enquiryId: 1,
            joiningDate: "2024-04-01T00:00:00Z",
            responseStatus: "COMPLETED"
        }
    ],
    enquiryId: 1,
    placementRequired: true,
    profession: "Software Engineer",
    referredBy: "LinkedIn",
    referrerPhoneNumber: "9876543212",
    source: "Online",
    totalExperience: 3
};

const sourceOptions = [
    { value: 'Direct', label: 'Direct' },
    { value: 'Ads', label: 'Ads' },
    { value: 'Friends', label: 'Friends' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Other', label: 'Other' }
];

const courseOptions = [
    { value: 'Python', label: 'Python' },
    { value: 'FullStack', label: 'Full Stack Development' },
    { value: 'AI_ML', label: 'AI and ML' },
    { value: 'DataScience', label: 'Data Science' },
    { value: 'Java', label: 'Java' }
];

const responseStatusOptions = [
    { value: 'RESPONDED', label: 'Responded' },
    { value: 'NOT_RESPONDED', label: 'Not Responded' },
    { value: 'REFUSED', label: 'Refused' }
];

const EnquiryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [enquiry, setEnquiry] = useState<EnquiryDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingDummyData, setUsingDummyData] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [formData, setFormData] = useState<EnquiryUpdatePayload>({
        candidateId: 0,
        course: '',
        currentlyWorking: false,
        id: 0,
        isActive: true,
        placementRequired: false,
        profession: '',
        referredBy: '',
        referrerPhoneNumber: '',
        source: '',
        totalExperience: 0
    });
    const [historyFormOpen, setHistoryFormOpen] = useState(false);
    const [historyForm, setHistoryForm] = useState<EnquiryHistoryForm>({
        attenderComment: '',
        candidateComment: '',
        joiningDate: null,
        callBackDate: null,
        responseStatus: 'NOT_RESPONDED'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchEnquiryDetails = async () => {
            try {
                const response = await fetch(`${Config.backendUrl}/enquiry/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch enquiry details');
                }
                const data = await response.json();
                setEnquiry(data);
                // Initialize form data with fetched data
                setFormData({
                    candidateId: data.candidateId,
                    course: data.course,
                    currentlyWorking: data.currentlyWorking,
                    id: data.enquiryId,
                    isActive: data.isActive,
                    placementRequired: data.placementRequired,
                    profession: data.profession,
                    referredBy: data.referredBy,
                    referrerPhoneNumber: data.referrerPhoneNumber,
                    source: data.source,
                    totalExperience: data.totalExperience
                });
            } catch (err) {
                console.error('API call failed, using dummy data:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                setEnquiry(dummyEnquiryDetails);
                setUsingDummyData(true);
                // Initialize form data with dummy data
                setFormData({
                    candidateId: dummyEnquiryDetails.candidateId,
                    course: dummyEnquiryDetails.course,
                    currentlyWorking: dummyEnquiryDetails.currentlyWorking,
                    id: dummyEnquiryDetails.enquiryId,
                    isActive: true,
                    placementRequired: dummyEnquiryDetails.placementRequired,
                    profession: dummyEnquiryDetails.profession,
                    referredBy: dummyEnquiryDetails.referredBy,
                    referrerPhoneNumber: dummyEnquiryDetails.referrerPhoneNumber,
                    source: dummyEnquiryDetails.source,
                    totalExperience: dummyEnquiryDetails.totalExperience
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiryDetails();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? 0 : parseInt(value)
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${Config.backendUrl}/enquiry/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update enquiry');
            }

            setUpdateSuccess(true);
            setUpdateError(null);
            // Refresh the data after successful update
            const updatedData = await response.json();
            setEnquiry(prev => prev ? { ...prev, ...updatedData } : null);
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : 'An error occurred while updating');
            setUpdateSuccess(false);
        }
    };

    const handleHistoryFormOpen = () => {
        setHistoryFormOpen(true);
    };

    const handleHistoryFormClose = () => {
        setHistoryFormOpen(false);
        setHistoryForm({
            attenderComment: '',
            candidateComment: '',
            joiningDate: null,
            callBackDate: null,
            responseStatus: 'NOT_RESPONDED'
        });
    };

    const handleHistoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHistoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHistoryFormSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setHistoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHistoryFormDateChange = (name: string, date: Date | null) => {
        setHistoryForm(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const handleHistoryFormSubmit = async () => {
        try {
            const response = await fetch(`${Config.backendUrl}/enquiry/${id}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...historyForm,
                    enquiryDate: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add history');
            }

            const newHistory = await response.json();
            setEnquiry(prev => prev ? {
                ...prev,
                enquiryHistories: [...prev.enquiryHistories, newHistory]
            } : null);
            handleHistoryFormClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while adding history');
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleHistoryRowClick = (history: EnquiryHistory) => {
        navigate(`/enquiry/${id}/history/${history.enquiryHistoryId}`, { state: { history } });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Enquiry Details
            </Typography>
            {usingDummyData && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Using dummy data for demonstration purposes
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Enquiry updated successfully
                </Alert>
            )}
            {updateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {updateError}
                </Alert>
            )}
            {!enquiry ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    No enquiry details found
                </Alert>
            ) : (
                <Paper sx={{ p: 3, mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Edit Enquiry Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Source</InputLabel>
                                        <Select
                                            name="source"
                                            value={formData.source}
                                            onChange={handleSelectChange}
                                            label="Source"
                                        >
                                            {sourceOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {formData.source === 'Direct' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Referred By"
                                                name="referredBy"
                                                value={formData.referredBy}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Referrer Phone"
                                                name="referrerPhoneNumber"
                                                value={formData.referrerPhoneNumber}
                                                onChange={handleInputChange}
                                                margin="normal"
                                            />
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Course</InputLabel>
                                        <Select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleSelectChange}
                                            label="Course"
                                        >
                                            {courseOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.placementRequired}
                                                onChange={handleInputChange}
                                                name="placementRequired"
                                            />
                                        }
                                        label="Placement Required"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.currentlyWorking}
                                                onChange={handleInputChange}
                                                name="currentlyWorking"
                                            />
                                        }
                                        label="Currently Working"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.profession === 'IT'}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        profession: e.target.checked ? 'IT' : 'Non-IT'
                                                    }));
                                                }}
                                                name="profession"
                                            />
                                        }
                                        label="IT Professional"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Total Experience (Years)"
                                        name="totalExperience"
                                        type="number"
                                        value={formData.totalExperience}
                                        onChange={handleNumberInputChange}
                                        margin="normal"
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdate}
                                >
                                    Update Enquiry
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Enquiry ID: {enquiry.enquiryId}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Course: {enquiry.course}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Profession: {enquiry.profession}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Total Experience: {enquiry.totalExperience} years</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        Currently Working: {enquiry.currentlyWorking ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        Placement Required: {enquiry.placementRequired ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Referral Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Referred By: {enquiry.referredBy}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Referrer Phone: {enquiry.referrerPhoneNumber}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Source: {enquiry.source}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Enquiry History
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleHistoryFormOpen}>
                                    Add History
                                </Button>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Enquiry Date</TableCell>
                                            <TableCell>Attender Comment</TableCell>
                                            <TableCell>Candidate Comment</TableCell>
                                            <TableCell>Joining Date</TableCell>
                                            <TableCell>Call Back Date</TableCell>
                                            <TableCell>Response Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {enquiry.enquiryHistories
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((history) => (
                                                <TableRow 
                                                    key={history.enquiryHistoryId}
                                                    onClick={() => handleHistoryRowClick(history)}
                                                    sx={{ 
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{new Date(history.enquiryDate).toLocaleString()}</TableCell>
                                                    <TableCell>{history.attenderComment}</TableCell>
                                                    <TableCell>{history.candidateComment}</TableCell>
                                                    <TableCell>{history.joiningDate ? new Date(history.joiningDate).toLocaleDateString() : '-'}</TableCell>
                                                    <TableCell>{history.callBackDate ? new Date(history.callBackDate).toLocaleDateString() : '-'}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={history.responseStatus} 
                                                            color={
                                                                history.responseStatus === 'RESPONDED' ? 'success' :
                                                                history.responseStatus === 'NOT_RESPONDED' ? 'warning' :
                                                                history.responseStatus === 'REFUSED' ? 'error' : 'default'
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={enquiry.enquiryHistories.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            <Dialog open={historyFormOpen} onClose={handleHistoryFormClose} maxWidth="md" fullWidth>
                <DialogTitle>Add Enquiry History</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Attender Comment"
                                name="attenderComment"
                                value={historyForm.attenderComment}
                                onChange={handleHistoryFormChange}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Candidate Comment"
                                name="candidateComment"
                                value={historyForm.candidateComment}
                                onChange={handleHistoryFormChange}
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
                                value={historyForm.joiningDate ? new Date(historyForm.joiningDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleHistoryFormDateChange('joiningDate', e.target.value ? new Date(e.target.value) : null)}
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
                                value={historyForm.callBackDate ? new Date(historyForm.callBackDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleHistoryFormDateChange('callBackDate', e.target.value ? new Date(e.target.value) : null)}
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
                                    value={historyForm.responseStatus}
                                    onChange={handleHistoryFormSelectChange}
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
                    <Button onClick={handleHistoryFormClose}>Cancel</Button>
                    <Button onClick={handleHistoryFormSubmit} variant="contained" color="primary">
                        Add History
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnquiryDetails; 