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
} from '@mui/material';
import Config from '../../config.json';

interface Enquiry {
    ID: number;
    channelId: number;
    createdAt: string;
    createdById: number;
    dob: string;
    email: string;
    extension: string;
    firstName: string;
    highestQualification: string;
    isActive: boolean;
    lastName: string;
    phoneNumber: string;
    status: string;
    updatedAt: string;
    updatedById: number;
}

// Dummy data for testing
const dummyEnquiries: Enquiry[] = [
    {
        ID: 1,
        channelId: 1,
        createdAt: "2024-03-15T10:00:00Z",
        createdById: 1,
        dob: "1990-05-15",
        email: "john.doe@example.com",
        extension: "Ext1",
        firstName: "John",
        highestQualification: "UG",
        isActive: true,
        lastName: "Doe",
        phoneNumber: "9876543210",
        status: "NEW",
        updatedAt: "2024-03-15T10:00:00Z",
        updatedById: 1
    },
    {
        ID: 2,
        channelId: 1,
        createdAt: "2024-03-16T11:00:00Z",
        createdById: 1,
        dob: "1992-08-20",
        email: "jane.smith@example.com",
        extension: "Ext2",
        firstName: "Jane",
        highestQualification: "PG",
        isActive: true,
        lastName: "Smith",
        phoneNumber: "9876543211",
        status: "NEW",
        updatedAt: "2024-03-16T11:00:00Z",
        updatedById: 1
    },
    {
        ID: 3,
        channelId: 1,
        createdAt: "2024-03-17T12:00:00Z",
        createdById: 1,
        dob: "1995-03-10",
        email: "robert.j@example.com",
        extension: "Ext3",
        firstName: "Robert",
        highestQualification: "12th",
        isActive: true,
        lastName: "Johnson",
        phoneNumber: "9876543212",
        status: "NEW",
        updatedAt: "2024-03-17T12:00:00Z",
        updatedById: 1
    }
];

const EnquiryList: React.FC = () => {
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingDummyData, setUsingDummyData] = useState(false);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`${Config.backendUrl}/enquiry/status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'NEW' })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch enquiries');
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setEnquiries(data);
                } else {
                    setEnquiries(dummyEnquiries);
                    setUsingDummyData(true);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Use dummy data if API call fails
                setEnquiries(dummyEnquiries);
                setUsingDummyData(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    const handleRowClick = (enquiryId: number) => {
        navigate(`/enquiry/${enquiryId}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Enquiry List
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
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="enquiry table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {enquiries.map((enquiry) => (
                            <TableRow 
                                key={enquiry.ID}
                                onClick={() => handleRowClick(enquiry.ID)}
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <TableCell>{enquiry.ID}</TableCell>
                                <TableCell>{`${enquiry.firstName} ${enquiry.lastName}`}</TableCell>
                                <TableCell>{enquiry.email}</TableCell>
                                <TableCell>{enquiry.phoneNumber}</TableCell>
                                <TableCell>{new Date(enquiry.dob).toLocaleDateString()}</TableCell>
                                <TableCell>{enquiry.highestQualification}</TableCell>
                                <TableCell>{enquiry.status}</TableCell>
                                <TableCell>{new Date(enquiry.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EnquiryList; 