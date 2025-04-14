import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Button,
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import Config from '../../config.json';
import { Student, CompanyDetail, EducationDetail, ApiResponse } from '../types/student';

interface EditableFields extends Omit<Student, 'studentId' | 'companyDetails' | 'educationDetails'> {
    id?: number;
}

const StudentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<EditableFields | null>(null);
    const [editingCompany, setEditingCompany] = useState<CompanyDetail | null>(null);
    const [editingEducation, setEditingEducation] = useState<EducationDetail | null>(null);
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await fetch(`${Config.backendUrl}/student/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student details');
                }

                const data: ApiResponse<Student> = await response.json();
                if (data.type === 'Success') {
                    setStudent(data.data);
                    setEditData({
                        aadharNumber: data.data.aadharNumber,
                        candidateId: data.data.candidateId,
                        fatherName: data.data.fatherName,
                        fatherOccupation: data.data.fatherOccupation,
                        joinedDate: data.data.joinedDate,
                        maritalStatus: data.data.maritalStatus,
                        motherName: data.data.motherName,
                        motherOccupation: data.data.motherOccupation,
                        panNumber: data.data.panNumber,
                        permanentAddress: data.data.permanentAddress,
                        id: data.data.id,
                        isActive: data.data.isActive,
                    });
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id, navigate]);

    const handleSave = async () => {
        try {
            if (!editData || !student) return;

            const token = localStorage.getItem('token');
            const response = await fetch(`${Config.backendUrl}/student/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${token}`,
                },
                body: JSON.stringify({
                    ...editData,
                    companyDetails: student.companyDetails,
                    educationDetails: student.educationDetails,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }

            const data: ApiResponse<Student> = await response.json();
            if (data.type === 'Success') {
                setStudent(data.data);
                setEditMode(false);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editData) return;
        const { name, value, type, checked } = e.target;
        setEditData({
            ...editData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleEducationSave = async (education: EducationDetail) => {
        if (!student) return;

        const updatedEducationDetails = editingEducation
            ? student.educationDetails?.map(edu => 
                (edu.id === editingEducation.id || edu.educationDetailId === editingEducation.educationDetailId)
                    ? { ...education, id: edu.id || edu.educationDetailId }
                    : edu
            )
            : [...student.educationDetails, { ...education, isActive: true }];

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${Config.backendUrl}/student/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${token}`,
                },
                body: JSON.stringify({
                    ...student,
                    educationDetails: updatedEducationDetails,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update education details');
            }

            const data: ApiResponse<Student> = await response.json();
            if (data.type === 'Success') {
                setStudent(data.data);
                setEducationDialogOpen(false);
                setEditingEducation(null);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleCompanySave = async (company: CompanyDetail) => {
        if (!student) return;

        const updatedCompanyDetails = editingCompany
            ? student.companyDetails?.map(comp => 
                (comp.id === editingCompany.id || comp.companyDetailId === editingCompany.companyDetailId)
                    ? { ...company, id: comp.id || comp.companyDetailId }
                    : comp
            )
            : [...student.companyDetails, { ...company, isActive: true }];

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${Config.backendUrl}/student/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${token}`,
                },
                body: JSON.stringify({
                    ...student,
                    companyDetails: updatedCompanyDetails,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update company details');
            }

            const data: ApiResponse<Student> = await response.json();
            if (data.type === 'Success') {
                setStudent(data.data);
                setCompanyDialogOpen(false);
                setEditingCompany(null);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
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

    if (!student || !editData) {
        return (
            <Box p={3}>
                <Alert severity="warning">Student not found</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Student Details</Typography>
                    <Box>
                        <Button
                            variant="contained"
                            color={editMode ? "success" : "primary"}
                            onClick={() => editMode ? handleSave() : setEditMode(true)}
                            sx={{ mr: 1 }}
                        >
                            {editMode ? "Save" : "Edit"}
                        </Button>
                        {editMode && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Aadhar Number"
                            name="aadharNumber"
                            value={editMode ? editData.aadharNumber : student.aadharNumber}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="PAN Number"
                            name="panNumber"
                            value={editMode ? editData.panNumber : student.panNumber}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Father's Name"
                            name="fatherName"
                            value={editMode ? editData.fatherName : student.fatherName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Father's Occupation"
                            name="fatherOccupation"
                            value={editMode ? editData.fatherOccupation : student.fatherOccupation}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Mother's Name"
                            name="motherName"
                            value={editMode ? editData.motherName : student.motherName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Mother's Occupation"
                            name="motherOccupation"
                            value={editMode ? editData.motherOccupation : student.motherOccupation}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Permanent Address"
                            name="permanentAddress"
                            value={editMode ? editData.permanentAddress : student.permanentAddress}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Marital Status"
                            name="maritalStatus"
                            value={editMode ? editData.maritalStatus : student.maritalStatus}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Joined Date"
                            name="joinedDate"
                            type="date"
                            value={editMode ? editData.joinedDate.split('T')[0] : student.joinedDate.split('T')[0]}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Education Details Section */}
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Education Details</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingEducation(null);
                            setEducationDialogOpen(true);
                        }}
                    >
                        Add Education
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>School Name</TableCell>
                                <TableCell>Percentage</TableCell>
                                <TableCell>Year of Passout</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {student.educationDetails?.map((edu) => (
                                <TableRow key={edu.educationDetailId || edu.id}>
                                    <TableCell>{edu.type}</TableCell>
                                    <TableCell>{edu.schoolName}</TableCell>
                                    <TableCell>{edu.percentage}%</TableCell>
                                    <TableCell>{edu.yearOfPassOut}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setEditingEducation(edu);
                                            setEducationDialogOpen(true);
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Company Details Section */}
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Company Details</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingCompany(null);
                            setCompanyDialogOpen(true);
                        }}
                    >
                        Add Company
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Designation</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {student?.companyDetails?.map((company) => (
                                <TableRow key={company.companyDetailId || company.id}>
                                    <TableCell>{company.companyName}</TableCell>
                                    <TableCell>{company.designation}</TableCell>
                                    <TableCell>{new Date(company.staredtDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(company.endedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setEditingCompany(company);
                                            setCompanyDialogOpen(true);
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Education Dialog */}
            <Dialog 
                open={educationDialogOpen} 
                onClose={() => {
                    setEducationDialogOpen(false);
                    setEditingEducation(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingEducation ? 'Edit Education Details' : 'Add Education Details'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Type"
                                    name="type"
                                    defaultValue={editingEducation?.type || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="School Name"
                                    name="schoolName"
                                    defaultValue={editingEducation?.schoolName || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="School Address"
                                    name="schoolAddress"
                                    defaultValue={editingEducation?.schoolAddress || ''}
                                    multiline
                                    rows={2}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Document Number"
                                    name="documentNumber"
                                    defaultValue={editingEducation?.documentNumber || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Percentage"
                                    name="percentage"
                                    type="number"
                                    defaultValue={editingEducation?.percentage || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Year of Passout"
                                    name="yearOfPassOut"
                                    defaultValue={editingEducation?.yearOfPassOut || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Submission Date"
                                    name="submissionDate"
                                    type="date"
                                    defaultValue={editingEducation?.submissionDate.split('T')[0] || new Date().toISOString().split('T')[0]}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="isSubmitted"
                                            defaultChecked={editingEducation?.isSubmitted || false}
                                        />
                                    }
                                    label="Documents Submitted"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setEducationDialogOpen(false);
                        setEditingEducation(null);
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            const form = document.querySelector('form');
                            if (form) {
                                const formData = new FormData(form);
                                const education: EducationDetail = {
                                    type: formData.get('type') as string,
                                    schoolName: formData.get('schoolName') as string,
                                    schoolAddress: formData.get('schoolAddress') as string,
                                    documentNumber: formData.get('documentNumber') as string,
                                    percentage: Number(formData.get('percentage')),
                                    yearOfPassOut: formData.get('yearOfPassOut') as string,
                                    submissionDate: formData.get('submissionDate') as string,
                                    isSubmitted: Boolean(formData.get('isSubmitted')),
                                    studentId: Number(id),
                                    id: editingEducation?.id,
                                    isActive: true,
                                };
                                handleEducationSave(education);
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Company Dialog */}
            <Dialog 
                open={companyDialogOpen} 
                onClose={() => {
                    setCompanyDialogOpen(false);
                    setEditingCompany(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingCompany ? 'Edit Company Details' : 'Add Company Details'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="companyName"
                                    defaultValue={editingCompany?.companyName || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Designation"
                                    name="designation"
                                    defaultValue={editingCompany?.designation || ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    name="staredtDate"
                                    type="date"
                                    defaultValue={editingCompany?.staredtDate.split('T')[0] || new Date().toISOString().split('T')[0]}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    name="endedDate"
                                    type="date"
                                    defaultValue={editingCompany?.endedDate.split('T')[0] || new Date().toISOString().split('T')[0]}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="UAN"
                                    name="uan"
                                    defaultValue={editingCompany?.uan || ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="form16"
                                            defaultChecked={editingCompany?.form16 || false}
                                        />
                                    }
                                    label="Form 16 Available"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="pf"
                                            defaultChecked={editingCompany?.pf || false}
                                        />
                                    }
                                    label="PF Available"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setCompanyDialogOpen(false);
                        setEditingCompany(null);
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            const form = document.querySelector('form');
                            if (form) {
                                const formData = new FormData(form);
                                const company: CompanyDetail = {
                                    companyName: formData.get('companyName') as string,
                                    designation: formData.get('designation') as string,
                                    staredtDate: formData.get('staredtDate') as string,
                                    endedDate: formData.get('endedDate') as string,
                                    uan: formData.get('uan') as string,
                                    form16: Boolean(formData.get('form16')),
                                    pf: Boolean(formData.get('pf')),
                                    studentId: Number(id),
                                    id: editingCompany?.id,
                                    isActive: true,
                                };
                                handleCompanySave(company);
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)}
                sx={{ mt: 3 }}
            >
                Back
            </Button>
        </Box>
    );
};

export default StudentDetails; 