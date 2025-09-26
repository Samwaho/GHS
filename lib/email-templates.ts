// Common CSS styles for all email templates
const commonCSS = `
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8fafc;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
        padding: 40px 30px;
        text-align: center;
    }
    .header h1 {
        color: white;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
    }
    .content {
        padding: 40px 30px;
    }
    .greeting {
        font-size: 18px;
        margin-bottom: 20px;
        color: #374151;
    }
    .message {
        font-size: 16px;
        margin-bottom: 30px;
        color: #6b7280;
    }
    .button-container {
        text-align: center;
        margin: 30px 0;
    }
    .action-button {
        display: inline-block;
        color: white;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    .action-button:hover {
        transform: translateY(-2px);
    }
    .footer {
        background-color: #f9fafb;
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
    }
    .footer p {
        margin: 5px 0;
        color: #6b7280;
        font-size: 14px;
    }
    .link {
        text-decoration: none;
    }
    .link:hover {
        text-decoration: underline;
    }
    .warning {
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 6px;
        padding: 15px;
        margin: 20px 0;
        font-size: 14px;
        color: #92400e;
    }
    .features {
        background-color: #f0f9ff;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
    }
    .feature {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-size: 14px;
        color: #374151;
    }
    .feature-icon {
        margin-right: 10px;
        font-size: 16px;
    }
    .code-container {
        text-align: center;
        margin: 30px 0;
    }
    .verification-code {
        display: inline-block;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 8px;
        font-family: 'Courier New', monospace;
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }
    @media only screen and (max-width: 600px) {
        .container {
            margin: 10px;
            border-radius: 4px;
        }
        .header, .content, .footer {
            padding: 20px 15px;
        }
        .header h1 {
            font-size: 24px;
        }
        .verification-code {
            font-size: 24px;
            padding: 15px 30px;
            letter-spacing: 4px;
        }
    }
`;

// Helper function to create email template with common structure
const createEmailTemplate = (
    title: string,
    headerGradient: string,
    content: string,
    linkColor?: string
) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            ${commonCSS}
            .header {
                background: ${headerGradient};
            }
            ${linkColor ? `.link { color: ${linkColor}; }` : ''}
        </style>
    </head>
    <body>
        <div class="container">
            ${content}
        </div>
    </body>
    </html>
    `;
};

export const verifyEmailTemplate = (confirmLink: string, userName?: string) => {
    const content = `
        <div class="header">
            <h1>🎉 Welcome to RentSys</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ''}! 👋
            </div>
            
            <div class="message">
                Thank you for signing up with RentSys! To complete your registration and start managing your rental properties, please verify your email address by clicking the button below.
            </div>
            
            <div class="button-container">
                <a href="${confirmLink}" class="action-button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ✅ Verify Email Address
                </a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account with RentSys, you can safely ignore this email.
            </div>
            
            <div class="message">
                If the button above doesn't work, you can also copy and paste this link into your browser:
                <br><br>
                <a href="${confirmLink}" class="link">${confirmLink}</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>This email was sent to you because you signed up for a RentSys account.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Verify Your Email - RentSys",
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        content,
        "#667eea"
    );
};

export const welcomeEmailTemplate = (userName: string) => {
    const content = `
        <div class="header">
            <h1>🎉 Welcome to RentSys!</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>
            
            <div class="message">
                Congratulations! Your email has been successfully verified and your RentSys account is now active. You're all set to start managing your rental properties with ease.
            </div>
            
            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">What you can do now:</h3>
                <div class="feature">
                    <span class="feature-icon">🏠</span>
                    Add and manage your rental properties
                </div>
                <div class="feature">
                    <span class="feature-icon">👥</span>
                    Track tenants and their information
                </div>
                <div class="feature">
                    <span class="feature-icon">💰</span>
                    Monitor rent payments and expenses
                </div>
                <div class="feature">
                    <span class="feature-icon">📊</span>
                    View detailed reports and analytics
                </div>
                <div class="feature">
                    <span class="feature-icon">🔔</span>
                    Set up automated notifications
                </div>
            </div>
            
            <div class="message">
                Ready to get started? Log in to your dashboard and begin exploring all the features RentSys has to offer!
            </div>
        </div>
        
        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>Thank you for choosing RentSys for your rental management needs.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Welcome to RentSys",
        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        content
    );
};

export const resetPasswordEmailTemplate = (resetLink: string, userName?: string) => {
    const content = `
        <div class="header">
            <h1>🔐 Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ''}! 👋
            </div>
            
            <div class="message">
                We received a request to reset your password for your RentSys account. Click the button below to create a new password.
            </div>
            
            <div class="button-container">
                <a href="${resetLink}" class="action-button" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    🔑 Reset Password
                </a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour for your security. If you didn't request a password reset, you can safely ignore this email.
            </div>
            
            <div class="message">
                If the button above doesn't work, you can also copy and paste this link into your browser:
                <br><br>
                <a href="${resetLink}" class="link">${resetLink}</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>This email was sent to you because you requested a password reset.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Reset Password - RentSys",
        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        content,
        "#ef4444"
    );
};

export const twoFactorEmailTemplate = (token: string, userName?: string) => {
    const content = `
        <div class="header">
            <h1>🔒 Two-Factor Authentication</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ''}! 👋
            </div>

            <div class="message">
                We received a login request for your RentSys account. To complete the login process, please enter the verification code below.
            </div>

            <div class="code-container">
                <div class="verification-code">
                    ${token}
                </div>
            </div>

            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This verification code will expire in 10 minutes for your security. If you didn't attempt to log in to your RentSys account, please change your password immediately and contact our support team.
            </div>

            <div class="message">
                <strong>Important:</strong> Never share this code with anyone. RentSys staff will never ask for your verification code.
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>This email was sent to you because you requested two-factor authentication.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Two-Factor Authentication - RentSys",
        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        content,
        "#8b5cf6"
    );
};

// Booking confirmation email template
export const bookingConfirmationEmailTemplate = (
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
    const content = `
        <div class="header">
            <h1>✅ Booking Confirmed!</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>

            <div class="message">
                Great news! Your booking has been confirmed. Here are the details of your appointment:
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Booking Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🆔</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">💼</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📍</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Date & Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
                <div class="feature">
                    <span class="feature-icon">💰</span>
                    <strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}
                </div>
                ${bookingDetails.notes ? `
                <div class="feature">
                    <span class="feature-icon">📝</span>
                    <strong>Notes:</strong> ${bookingDetails.notes}
                </div>
                ` : ''}
            </div>

            <div class="message">
                Please arrive 10 minutes before your scheduled time. If you need to make any changes or cancel your booking, please contact us as soon as possible.
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>Thank you for choosing our services!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Booking Confirmed - RentSys",
        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        content,
        "#10b981"
    );
};

// Booking cancellation email template
export const bookingCancellationEmailTemplate = (
    userName: string,
    bookingDetails: {
        id: string;
        serviceName: string;
        branchName: string;
        scheduledAt: string;
    }
) => {
    const content = `
        <div class="header">
            <h1>❌ Booking Cancelled</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>

            <div class="message">
                Your booking has been successfully cancelled. Here are the details of the cancelled appointment:
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Cancelled Booking Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🆔</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">💼</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📍</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Original Date & Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
            </div>

            <div class="message">
                We're sorry to see you cancel your appointment. If you'd like to reschedule or book a new appointment, we're here to help!
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>We hope to serve you again soon!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Booking Cancelled - RentSys",
        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        content,
        "#f59e0b"
    );
};

// Gift voucher purchase confirmation email template
export const giftVoucherPurchaseEmailTemplate = (
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
    const content = `
        <div class="header">
            <h1>🎁 Gift Voucher Purchased!</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>

            <div class="message">
                Thank you for purchasing a gift voucher! Here are the details:
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Gift Voucher Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🎫</span>
                    <strong>Voucher Code:</strong> ${voucherDetails.code}
                </div>
                <div class="feature">
                    <span class="feature-icon">🏷️</span>
                    <strong>Template:</strong> ${voucherDetails.templateName}
                </div>
                <div class="feature">
                    <span class="feature-icon">💰</span>
                    <strong>Value:</strong> $${voucherDetails.originalValue.toFixed(2)}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Expires:</strong> ${new Date(voucherDetails.expiresAt).toLocaleDateString()}
                </div>
                ${voucherDetails.recipientEmail ? `
                <div class="feature">
                    <span class="feature-icon">📧</span>
                    <strong>Recipient:</strong> ${voucherDetails.recipientName || voucherDetails.recipientEmail}
                </div>
                ` : ''}
                ${voucherDetails.message ? `
                <div class="feature">
                    <span class="feature-icon">💌</span>
                    <strong>Message:</strong> ${voucherDetails.message}
                </div>
                ` : ''}
            </div>

            <div class="message">
                ${voucherDetails.recipientEmail
                    ? 'The recipient will receive a separate email with the gift voucher details.'
                    : 'You can share this voucher code with the recipient to redeem the gift voucher.'
                }
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>Thank you for your purchase!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Gift Voucher Purchase Confirmation - RentSys",
        "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        content,
        "#ec4899"
    );
};

// Gift voucher delivery email template
export const giftVoucherDeliveryEmailTemplate = (
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
    const content = `
        <div class="header">
            <h1>🎁 You've Received a Gift Voucher!</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${recipientName}! 👋
            </div>

            <div class="message">
                Great news! ${purchaserName} has sent you a gift voucher for RentSys services!
            </div>

            ${voucherDetails.message ? `
            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Personal Message:</h3>
                <p style="font-style: italic; color: #6b7280; padding: 15px; background-color: #f9fafb; border-radius: 8px; margin: 10px 0;">
                    "${voucherDetails.message}"
                </p>
            </div>
            ` : ''}

            <div class="code-container">
                <div class="verification-code" style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);">
                    ${voucherDetails.code}
                </div>
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Gift Voucher Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🏷️</span>
                    <strong>Template:</strong> ${voucherDetails.templateName}
                </div>
                <div class="feature">
                    <span class="feature-icon">💰</span>
                    <strong>Value:</strong> $${voucherDetails.originalValue.toFixed(2)}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Expires:</strong> ${new Date(voucherDetails.expiresAt).toLocaleDateString()}
                </div>
            </div>

            <div class="message">
                To redeem this gift voucher, simply use the code above when making a booking on our platform. The voucher value will be automatically applied to your purchase.
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>Enjoy your gift voucher!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Gift Voucher from " + purchaserName + " - RentSys",
        "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        content,
        "#ec4899"
    );
};

// Booking status update email template
export const bookingStatusUpdateEmailTemplate = (
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
    const statusEmoji = {
        'PENDING': '⏳',
        'CONFIRMED': '✅',
        'CANCELLED': '❌',
        'COMPLETED': '🎉'
    };

    const statusColor = {
        'PENDING': '#f59e0b',
        'CONFIRMED': '#10b981',
        'CANCELLED': '#ef4444',
        'COMPLETED': '#8b5cf6'
    };

    const content = `
        <div class="header">
            <h1>${statusEmoji[bookingDetails.status as keyof typeof statusEmoji]} Booking Status Updated</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>

            <div class="message">
                Your booking status has been updated to <strong>${bookingDetails.status}</strong>.
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Booking Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🆔</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">💼</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📍</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Date & Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
                <div class="feature">
                    <span class="feature-icon">📊</span>
                    <strong>Status:</strong> ${bookingDetails.status}
                </div>
                ${bookingDetails.adminNotes ? `
                <div class="feature">
                    <span class="feature-icon">📝</span>
                    <strong>Admin Notes:</strong> ${bookingDetails.adminNotes}
                </div>
                ` : ''}
            </div>

            <div class="message">
                If you have any questions about this update, please don't hesitate to contact our support team.
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>Thank you for choosing our services!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Booking Status Update - RentSys",
        `linear-gradient(135deg, ${statusColor[bookingDetails.status as keyof typeof statusColor]} 0%, ${statusColor[bookingDetails.status as keyof typeof statusColor]}dd 100%)`,
        content,
        statusColor[bookingDetails.status as keyof typeof statusColor]
    );
};

// User role change notification email template
export const userRoleChangeEmailTemplate = (
    userName: string,
    newRole: string,
    changedBy: string
) => {
    const content = `
        <div class="header">
            <h1>👤 Account Role Updated</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName}! 👋
            </div>

            <div class="message">
                Your account role has been updated by ${changedBy}.
            </div>

            <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">Role Change Details:</h3>
                <div class="feature">
                    <span class="feature-icon">🔑</span>
                    <strong>New Role:</strong> ${newRole}
                </div>
                <div class="feature">
                    <span class="feature-icon">👨‍💼</span>
                    <strong>Changed By:</strong> ${changedBy}
                </div>
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <strong>Date:</strong> ${new Date().toLocaleString()}
                </div>
            </div>

            <div class="message">
                ${newRole === 'ADMIN'
                    ? 'You now have administrative privileges and can access the admin dashboard.'
                    : 'Your account has been set to standard user privileges.'
                }
            </div>

            <div class="message">
                If you believe this change was made in error, please contact our support team immediately.
            </div>
        </div>

        <div class="footer">
            <p><strong>RentSys</strong> - Your Complete Rental Management Solution</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} RentSys. All rights reserved.
            </p>
        </div>
    `;

    return createEmailTemplate(
        "Account Role Updated - RentSys",
        "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        content,
        "#6366f1"
    );
};