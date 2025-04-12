import React, { useEffect, useState } from 'react';
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
    Chip,
    TablePagination,
    Tabs,
    Tab,
} from '@mui/material';
import Config from '../../config.json';

interface Attender {
    ID: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    extension: string;
    phoneNumber: string;
    email: string;
    role: string;
    isLoginDisabled: boolean;
    isLoggedIn: boolean;
    lastLoginTime: string;
    resetPasswordString: string | null;
    ChannelName: string | null;
}

interface EnquiryHistory {
    attenderComment: string;
    joiningDate?: string;
    callBackDate: string;
    enquiryDate: string;
    responseStatus: string;
    attenderId: number;
    attender: Attender;
}

interface Enquiry {
    enquiryId: number;
    source: string;
    referredBy: string;
    referrerPhoneNumber: string;
    course: string;
    placementRequired: boolean;
    currentlyWorking: boolean;
    profession: string;
    status: string;
    candidateId: number;
    enquiryHistories: EnquiryHistory[];
}

interface PageMetaData {
    skipPagination: boolean;
    size: number;
    currentPage: number;
    sort: string;
    totalRecords: number;
    totalPages: number;
}

interface ApiResponse {
    data: Enquiry[];
    message: string;
    type: string;
    pageMetaData: PageMetaData;
}

const EnquiryList: React.FC = () => {
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedTab, setSelectedTab] = useState<string>('new');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
        setPage(0); // Reset page when changing tabs
    };

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                const response = await fetch(`${Config.backendUrl}/enquiry`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': `${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch enquiries');
                }

                const data: ApiResponse = await response.json();
                if (data.type === 'Success') {
                    setEnquiries(data.data);
                    setTotalRecords(data.pageMetaData.totalRecords);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, [navigate, page, rowsPerPage, selectedTab]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (enquiryId: number) => {
        navigate(`/enquiry/${enquiryId}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Enquiry List
            </Typography>
            
            <Paper sx={{ mb: 2 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="New" value="new" />
                    <Tab label="Accepted" value="accepted" />
                    <Tab label="Rejected" value="rejected" />
                    <Tab label="Callback" value="callback" />
                </Tabs>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="enquiry table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Referred By</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Profession</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>History Count</TableCell>
                                <TableCell>Working Status</TableCell>
                                <TableCell>Placement</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enquiries.map((enquiry) => (
                                <TableRow 
                                    key={enquiry.enquiryId}
                                    onClick={() => handleRowClick(enquiry.enquiryId)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{enquiry.enquiryId}</TableCell>
                                    <TableCell>{enquiry.source}</TableCell>
                                    <TableCell>{enquiry.referredBy}</TableCell>
                                    <TableCell>{enquiry.course}</TableCell>
                                    <TableCell>{enquiry.profession}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={enquiry.status} 
                                            color={
                                                enquiry.status === 'NEW' ? 'primary' :
                                                enquiry.status === 'ACCEPTED' ? 'success' :
                                                enquiry.status === 'REJECTED' ? 'error' :
                                                enquiry.status === 'CALLBACK' ? 'warning' : 'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{enquiry.enquiryHistories.length}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={enquiry.currentlyWorking ? 'Working' : 'Not Working'}
                                            color={enquiry.currentlyWorking ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={enquiry.placementRequired ? 'Required' : 'Not Required'}
                                            color={enquiry.placementRequired ? 'info' : 'default'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
            )}
        </Box>
    );
};

export default EnquiryList; 