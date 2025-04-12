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
    TablePagination,
} from '@mui/material';
import Config from '../../config.json';
import { Student, ApiResponse } from '../types/student';

const StudentsList: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                const response = await fetch(`${Config.backendUrl}/student`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': `${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }

                const data: ApiResponse<Student[]> = await response.json();
                if (data.type === 'Success') {
                    setStudents(data.data);
                    setTotalRecords(data.pageMetaData?.totalRecords || data.data.length);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        console.log(event);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (studentId: number) => {
        navigate(`/student/${studentId}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Students List
            </Typography>

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
                    <Table sx={{ minWidth: 650 }} aria-label="students table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Candidate ID</TableCell>
                                <TableCell>Father's Name</TableCell>
                                <TableCell>Mother's Name</TableCell>
                                <TableCell>Marital Status</TableCell>
                                <TableCell>Joined Date</TableCell>
                                <TableCell>Education Count</TableCell>
                                <TableCell>Company Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow 
                                    key={student.studentId || student.id}
                                    onClick={() => handleRowClick(student.studentId || student.id!)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{student.studentId || student.id}</TableCell>
                                    <TableCell>{student.candidateId}</TableCell>
                                    <TableCell>{student.fatherName}</TableCell>
                                    <TableCell>{student.motherName}</TableCell>
                                    <TableCell>{student.maritalStatus}</TableCell>
                                    <TableCell>{new Date(student.joinedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{student.educationDetails.length}</TableCell>
                                    <TableCell>{student.companyDetails.length}</TableCell>
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

export default StudentsList;
