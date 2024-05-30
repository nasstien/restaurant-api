export const getResetPasswordHTML = (userName: string, resetUrl: string) => {
    return `<div class="container" style="font-family: Arial, sans-serif; text-align: center">
        <h1 style="font-size: 24px">Password Reset</h1>
        <p>Hello, ${userName}!</p>
        <p>You are receiving this email because a password reset request was made for your account.</p>
        <p>Please click the link below to reset your password.</p>
        <span style="font-weight: 600">This link is valid for 10 minutes:</span>
        <a href="${resetUrl}">${resetUrl}</a>
    </div>`;
};
