import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import { EnquiryHistory } from '../types/enquiry';

interface EnquiryHistoryTableProps {
    histories: EnquiryHistory[];
    onRowClick: (history: EnquiryHistory) => void;
}

const EnquiryHistoryTable: React.FC<EnquiryHistoryTableProps> = ({ histories, onRowClick }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Enquiry Date</TableCell>
                        <TableCell>Attender</TableCell>
                        <TableCell>Attender Comment</TableCell>
                        <TableCell>Joining Date</TableCell>
                        <TableCell>Call Back Date</TableCell>
                        <TableCell>Response Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {histories?.map((history) => (
                        <TableRow 
                            key={history.id}
                            onClick={() => onRowClick(history)}
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <TableCell>{new Date(history.enquiryDate).toLocaleString()}</TableCell>
                            <TableCell>{`${history.attender.firstName} ${history.attender.lastName}`}</TableCell>
                            <TableCell>{history.attenderComment}</TableCell>
                            <TableCell>{history.joiningDate && history.joiningDate !== "0001-01-01" ? new Date(history.joiningDate).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>{history.callBackDate ? new Date(history.callBackDate).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                                <Chip 
                                    label={history.responseStatus} 
                                    color={
                                        history.responseStatus === 'RESPONDED' ? 'success' :
                                        history.responseStatus === 'NOTRESPONDED' ? 'warning' :
                                        history.responseStatus === 'REFUSED' ? 'error' : 'default'
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EnquiryHistoryTable; 