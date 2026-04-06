const backendDomain = "http://localhost:8080";


const summaryApi = {

    registerUser:{
        url:`${backendDomain}/user/register`,
        method:"post",
    },
    registerSeller:{
        url:`${backendDomain}/user/seller/register`,
        method: "post",
    },
    verifySeller:{
        url:`${backendDomain}/user/seller/verify-otp`,
        method: "post",
    },
    resendOtpSeller:{
        url:`${backendDomain}/user/seller/resend-otp`,
        method: "post",
    },
    loginUser:{
        url:`${backendDomain}/user/login`,
        method:"post",
    },
    logout:{
        url: `${backendDomain}/user/logout`,
        method:"post"
    },
    logoutAllDevice:{
        url:`${backendDomain}/user/logout/all`,
        method:"post"
    },
    updateProfile:{
        url:`${backendDomain}/user/update/profile`,
        method:"patch"
    },
    getMe:{
        url:`${backendDomain}/user/profile`,
        method:"get"
    },





};



export default summaryApi;