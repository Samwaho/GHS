import { Resend } from "resend";
import {
  resetPasswordEmailTemplate,
  verifyEmailTemplate,
  welcomeEmailTemplate,
  twoFactorEmailTemplate,
  bookingConfirmationEmailTemplate,
  bookingCancellationEmailTemplate,
  giftVoucherPurchaseEmailTemplate,
  giftVoucherDeliveryEmailTemplate,
  bookingStatusUpdateEmailTemplate,
  userRoleChangeEmailTemplate,
} from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail =
  process.env.RESEND_FROM_EMAIL ??
  "Golden Hands Spa <noreply@goldenhandsspa.com>";

export const sendVerificationEmail = async (
  email: string,
  token: string,
  userName?: string
) => {
  try {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify your email - Golden Hands Spa",
      html: verifyEmailTemplate(confirmLink, userName),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (email: string, userName: string) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Welcome to Golden Hands Spa",
      html: welcomeEmailTemplate(userName),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  userName?: string
) => {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your password - Golden Hands Spa",
      html: resetPasswordEmailTemplate(resetLink, userName),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
};

export const sendTwoFactorEmail = async (
  email: string,
  token: string,
  userName?: string
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Two-factor authentication code - Golden Hands Spa",
      html: twoFactorEmailTemplate(token, userName),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send two-factor email:", error);
    return { success: false, error };
  }
};

export const sendBookingConfirmationEmail = async (
  email: string,
  userName: string,
  bookingDetails: {
    id: string;
    serviceName: string;
    branchName: string;
    scheduledAt: string;
    totalPrice: number;
    notes?: string;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Booking Confirmed - Golden Hands Spa",
      html: bookingConfirmationEmailTemplate(userName, bookingDetails),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return { success: false, error };
  }
};

export const sendBookingCancellationEmail = async (
  email: string,
  userName: string,
  bookingDetails: {
    id: string;
    serviceName: string;
    branchName: string;
    scheduledAt: string;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Booking Cancelled - Golden Hands Spa",
      html: bookingCancellationEmailTemplate(userName, bookingDetails),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send booking cancellation email:", error);
    return { success: false, error };
  }
};

export const sendGiftVoucherPurchaseEmail = async (
  email: string,
  userName: string,
  voucherDetails: {
    code: string;
    templateName: string;
    originalValue: number;
    expiresAt: string;
    recipientEmail?: string;
    recipientName?: string;
    message?: string;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Gift Voucher Purchase Confirmation - Golden Hands Spa",
      html: giftVoucherPurchaseEmailTemplate(userName, voucherDetails),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send gift voucher purchase email:", error);
    return { success: false, error };
  }
};

export const sendGiftVoucherDeliveryEmail = async (
  email: string,
  recipientName: string,
  purchaserName: string,
  voucherDetails: {
    code: string;
    templateName: string;
    originalValue: number;
    expiresAt: string;
    message?: string;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Gift Voucher from ${purchaserName} - Golden Hands Spa`,
      html: giftVoucherDeliveryEmailTemplate(
        recipientName,
        purchaserName,
        voucherDetails
      ),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send gift voucher delivery email:", error);
    return { success: false, error };
  }
};

export const sendBookingStatusUpdateEmail = async (
  email: string,
  userName: string,
  bookingDetails: {
    id: string;
    serviceName: string;
    branchName: string;
    scheduledAt: string;
    status: string;
    adminNotes?: string;
  }
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Booking Status Update - Golden Hands Spa",
      html: bookingStatusUpdateEmailTemplate(userName, bookingDetails),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send booking status update email:", error);
    return { success: false, error };
  }
};

export const sendUserRoleChangeEmail = async (
  email: string,
  userName: string,
  newRole: string,
  changedBy: string
) => {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Account Role Updated - Golden Hands Spa",
      html: userRoleChangeEmailTemplate(userName, newRole, changedBy),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send user role change email:", error);
    return { success: false, error };
  }
};
