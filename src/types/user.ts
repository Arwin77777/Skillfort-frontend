export interface User {
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