export interface CompanyDetail {
    companyDetailId?: number;
    companyName: string;
    designation: string;
    endedDate: string;
    form16: boolean;
    pf: boolean;
    staredtDate: string;
    studentId?: number;
    uan: string;
    id?: number;
    isActive?: boolean;
}

export interface EducationDetail {
    documentNumber: string;
    educationDetailId?: number;
    isSubmitted: boolean;
    percentage: number;
    schoolAddress: string;
    schoolName: string;
    studentId?: number;
    submissionDate: string;
    type: string;
    yearOfPassOut: string;
    id?: number;
    isActive?: boolean;
}

export interface Student {
    aadharNumber: string;
    candidateId: number;
    companyDetails: CompanyDetail[];
    educationDetails: EducationDetail[];
    fatherName: string;
    fatherOccupation: string;
    joinedDate: string;
    maritalStatus: string;
    motherName: string;
    motherOccupation: string;
    panNumber: string;
    permanentAddress: string;
    studentId?: number;
    id?: number;
    isActive?: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    type: string;
    pageMetaData?: {
        skipPagination: boolean;
        size: number;
        currentPage: number;
        sort: string;
        totalRecords: number;
        totalPages: number;
    };
} 