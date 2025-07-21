import { axiosInstance } from "./axios";

// Used to send post request to backend of signup with the help of frontend of signup (by calling it from signup's frontend)
export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
};

// Used to send post request to backend of login with the help of frontend of login (by calling it from login's frontend)
export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

// Used to send post request to backend of logout with the help of frontend of logout (by calling it from logout's frontend)
export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

// Used to send get request to backend of me to obtain user details with the help of frontend of any page we required it to be
export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null; // Helps in logging out functionality where it wasn't redirecting to login page if logging out before
    }
};

// Used to send post request to backend of onboarding with the help of frontend of onboarding (by calling it from onboarding's frontend)
export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
};

// Used to send get request to backend of user route with the help of frontend of homepage (by calling it from homepage's frontend) to get friends of authenticated user
export async function getUserFriends() {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
};

// Used to send get request to backend of user route with the help of frontend of homepage (by calling it from homepage's frontend) to get users to send friend req to
export async function getRecommendedUsers() {
    const response = await axiosInstance.get("/users");
    return response.data;
}

// Used to send get request to backend of user route with the help of frontend of homepage (by calling it from homepage's frontend) to get requests already sent by authenticated user
export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}


// Used to send post request to backend of user route with the help of frontend of homepage to send friend req to users
export async function sendFriendRequest(userId) {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

// Used to send get request to backend of user route with the help of frontend of notifications to get the friend requests sent to authenticated user
export async function getFriendRequests() {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}

// Used to send put request to backend of user route with the help of frontend of notifications to accept friend requests
export async function acceptFriendRequest(requestId) {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}

// Fetching the stream token created in backend of chat route controller to the frontend of chat page
export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}