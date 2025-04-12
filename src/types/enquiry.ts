export interface Attender {
    ID: number;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
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

export interface EnquiryHistory {
    attenderComment: string;
    joiningDate?: string;
    callBackDate: string;
    enquiryDate: string;
    responseStatus: string;
    attenderId: number;
    attender: Attender;
    id: number;
    enquiryId: number;
    candidateComment: string;
    isActive: boolean;
}

export interface EnquiryDetails {
    enquiryId: number;
    source: string;
    totalExperience: number;
    isActive: boolean;
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

export interface EnquiryUpdatePayload {
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
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    type: string;
    pageMetaData: {
        skipPagination: boolean;
    };
} 