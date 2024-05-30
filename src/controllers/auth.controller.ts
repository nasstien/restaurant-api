import crypto from 'crypto';
import User from '@models/user';
import APIError from '@utils/classes/APIError';
import Email from '@utils/classes/Email';
import { comparePasswords, sendTokenCookie, signToken } from '@utils/auth';
import { handleAsyncErrors } from '@utils/utils';
import { sendSuccessResponse } from '@utils/responses';
import { IAuthRequest } from 'IAuthRequest';

export const signUp = handleAsyncErrors(async (req, res, next) => {
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNum: req.body.phoneNum,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    if (!user.isActive) {
        return next(new APIError(400, 'The account has been deleted by the user.'));
    }

    sendTokenCookie(res, signToken(user));
    sendSuccessResponse(res, 201, undefined, 'Account has been successfully created.');
});

export const logIn = handleAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new APIError(400, 'Both email and password must be provided.'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await comparePasswords(password, user.password))) {
        return next(new APIError(401, 'Invalid email or password.'));
    } else if (!user.isActive) {
        return next(new APIError(400, 'The account has been deleted by the user.'));
    }

    sendTokenCookie(res, signToken(user));
    sendSuccessResponse(res, 200, undefined, 'You have successfully logged in.');
});

export const logOut = handleAsyncErrors(async (req, res, next) => {
    const authReq = req as IAuthRequest;
    authReq.user = undefined;

    res.clearCookie('session');
    sendSuccessResponse(res, 200, undefined, 'You have successfully logged out.');
});

export const forgotPassword = handleAsyncErrors(async (req, res, next) => {
    if (!req.body.email) {
        return next(new APIError(400, 'Email is required.'));
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new APIError(400, 'No account found with this email address.'));
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const email = new Email(
        process.env.EMAIL_HOST!,
        parseInt(process.env.EMAIL_PORT!),
        process.env.EMAIL_USER!,
        process.env.EMAIL_USER_PASSWORD!,
    );
    const transporter = email.createTransport();

    try {
        await email.sendResetPasswordEmail(transporter, user, resetUrl);
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new APIError(500, 'An error occurred while sending the email.'));
    }

    sendSuccessResponse(res, 200, undefined, 'Password reset link has been sent to your email.');
});

export const resetPassword = handleAsyncErrors(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
        return next(new APIError(400, 'The reset token is invalid or has expired.'));
    }

    const { newPassword, newPasswordConfirm } = req.body;

    if (!newPassword || !newPasswordConfirm) {
        return next(new APIError(400, 'New password and password confirmation are required.'));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.passwordUpdatedAt = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    sendSuccessResponse(res, 200, undefined, 'Your password has been successfully changed.');
});

export const updatePassword = handleAsyncErrors(async (req, res, next) => {
    const authReq = req as IAuthRequest;
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
        return next(new APIError(400, 'Current password, new password, and password confirmation are required.'));
    }

    const user = await User.findById(authReq.user.id).select('+password');

    if (!user) {
        return next(new APIError(404, 'User not found.'));
    } else if (!(await comparePasswords(currentPassword, user.password))) {
        return next(new APIError(400, 'Current password is incorrect.'));
    } else if (await comparePasswords(newPassword, user.password)) {
        return next(new APIError(400, 'New password cannot be the same as the current one.'));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.passwordUpdatedAt = new Date();
    await user.save();

    sendSuccessResponse(res, 200, undefined, 'Password has been successfully updated.');
});

export const updateUserRole = handleAsyncErrors(async (req, res, next) => {
    const { user, role } = req.body;

    if (!user || !role) {
        return next(new APIError(400, 'Both user and role must be provided.'));
    }

    const updatedUser = await User.findById(user);

    if (!updatedUser) {
        return next(new APIError(404, 'User not found.'));
    } else if (updatedUser.role === role) {
        return next(new APIError(400, `The user already has the ${role.toLowerCase()} role.`));
    }

    updatedUser.role = role;
    await updatedUser.save();

    sendSuccessResponse(res, 200, undefined, "User's role has been successfully updated.");
});

export const deleteAccount = handleAsyncErrors(async (req, res, next) => {
    const authReq = req as IAuthRequest;
    const user = await User.findById(authReq.user.id);

    if (!user) {
        return next(new APIError(404, 'User not found.'));
    }

    user.isActive = false;
    await user.save();

    authReq.user = undefined;

    res.clearCookie('session');
    sendSuccessResponse(res, 200, undefined, 'Account has been successfully deleted.');
});
