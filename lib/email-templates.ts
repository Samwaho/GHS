import { formatKES } from "./currency";

const brandName = "Golden Hands Spa";
const brandTagline = "Signature luxury spa and wellness experiences";
const spaColors = {
  primary: "#D4AF37",
  primaryDark: "#B8860B",
  accent: "#F4E4BC",
  background: "#F7F3EA",
  text: "#2F2A1F",
  muted: "#5C4D2A",
  border: "#E6D9B8",
};

const commonCSS = `
    body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.7;
        color: ${spaColors.text};
        margin: 0;
        padding: 40px 0;
        background-color: ${spaColors.background};
    }
    .container {
        max-width: 640px;
        margin: 0 auto;
        background-color: #FFFFFF;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid ${spaColors.border};
        box-shadow: 0 24px 45px rgba(0, 0, 0, 0.06);
    }
    .header {
        padding: 48px 40px 32px;
        text-align: center;
        background: ${spaColors.primary};
        color: #FFFFFF;
    }
    .header h1 {
        margin: 0;
        font-size: 30px;
        font-weight: 600;
        letter-spacing: 0.04em;
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
    }
    .header p {
        margin: 12px 0 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
    }
    .content {
        padding: 40px;
        background: #FFFFFF;
    }
    .greeting {
        font-size: 18px;
        margin-bottom: 18px;
        font-weight: 600;
        color: ${spaColors.text};
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
    }
    .message {
        font-size: 16px;
        margin-bottom: 28px;
        color: ${spaColors.muted};
    }
    .button-container {
        text-align: center;
        margin: 36px 0;
    }
    .action-button {
        display: inline-block;
        color: ${spaColors.text};
        text-decoration: none;
        padding: 16px 36px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 16px;
        background: linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%);
        box-shadow: 0 14px 30px rgba(184, 134, 11, 0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 40px rgba(184, 134, 11, 0.35);
    }
    .accent-card {
        background: ${spaColors.accent};
        border-radius: 16px;
        padding: 20px 24px;
        border: 1px solid ${spaColors.border};
        color: ${spaColors.text};
    }
    .warning {
        background: #FFF7E6;
        border: 1px solid ${spaColors.primary};
        border-radius: 12px;
        padding: 18px 20px;
        margin: 28px 0;
        font-size: 14px;
        color: ${spaColors.text};
    }
    .features {
        background-color: #FFFBF2;
        border-radius: 16px;
        padding: 24px;
        margin: 24px 0 32px;
        border: 1px solid ${spaColors.border};
    }
    .features h3 {
        margin: 0 0 16px;
        color: ${spaColors.text};
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 18px;
    }
    .feature {
        display: flex;
        align-items: center;
        margin: 12px 0;
        font-size: 15px;
        color: ${spaColors.muted};
    }
    .feature-icon {
        margin-right: 12px;
        font-size: 18px;
        color: ${spaColors.primaryDark};
    }
    .code-container {
        text-align: center;
        margin: 36px 0;
    }
    .verification-code {
        display: inline-block;
        background: linear-gradient(135deg, ${spaColors.accent} 0%, ${spaColors.primary} 100%);
        color: ${spaColors.text};
        padding: 22px 48px;
        border-radius: 16px;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 8px;
        font-family: 'Fira Code', 'Courier New', Courier, monospace;
        box-shadow: 0 20px 40px rgba(212, 175, 55, 0.25);
    }
    .footer {
        background-color: #FFFBF2;
        padding: 32px;
        text-align: center;
        border-top: 1px solid ${spaColors.border};
    }
    .footer p {
        margin: 6px 0;
        color: ${spaColors.muted};
        font-size: 14px;
    }
    .footer strong {
        color: ${spaColors.text};
    }
    .link {
        text-decoration: none;
        color: ${spaColors.primaryDark};
        font-weight: 600;
    }
    .link:hover {
        text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
        body {
            padding: 20px 12px;
        }
        .container {
            border-radius: 14px;
        }
        .header, .content, .footer {
            padding: 28px 24px;
        }
        .verification-code {
            font-size: 22px;
            padding: 18px 32px;
            letter-spacing: 6px;
        }
    }
`;

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
            ${linkColor ? `.link { color: ${linkColor}; }` : ""}
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

const renderFooter = (lines: string[] = []) => `
        <div class="footer">
            <p><strong>${brandName}</strong> &mdash; ${brandTagline}.</p>
            ${lines.map((line) => `<p>${line}</p>`).join("")}
            <p style="margin-top: 20px; font-size: 12px; color: ${spaColors.muted};">
                &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.
            </p>
        </div>
    `;

const formatCurrency = (value: number) => formatKES(value);

export const verifyEmailTemplate = (confirmLink: string, userName?: string) => {
  const content = `
        <div class="header">
            <h1>&#x1F389; Welcome to ${brandName}</h1>
            <p>Confirm your email to unlock curated spa experiences.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ""},
            </div>

            <div class="message">
                Thank you for joining ${brandName}! Verify your email so we can personalise treatments, manage your bookings, and send wellness updates tailored to you.
            </div>

            <div class="button-container">
                <a href="${confirmLink}" class="action-button">
                    Confirm Email Address
                </a>
            </div>

            <div class="warning">
                <strong>Security tip:</strong> This confirmation link stays active for 24 hours. If you did not create an account with ${brandName}, please disregard this message.
            </div>

            <div class="message">
                If the button is not working, copy and paste this link into your browser:
                <br><br>
                <a href="${confirmLink}" class="link">${confirmLink}</a>
            </div>
        </div>

        ${renderFooter([
          `You are receiving this email because you signed up for a ${brandName} account.`,
          "Our concierge team is always here to help."
        ])}
    `;

  return createEmailTemplate(
    `Verify Your Email - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};

export const welcomeEmailTemplate = (userName: string) => {
  const content = `
        <div class="header">
            <h1>&#x2728; Welcome to ${brandName}</h1>
            <p>Your wellness journey begins now.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                We are delighted to have you in our community. Your ${brandName} account is active, giving you access to personalised rituals and seamless booking.
            </div>

            <div class="features">
                <h3>Here is what you can do next:</h3>
                <div class="feature">
                    <span class="feature-icon">&#10003;</span>
                    Reserve signature treatments and holistic therapies online.
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128197;</span>
                    View and manage upcoming appointments with ease.
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128141;</span>
                    Unlock seasonal offers crafted exclusively for loyal guests.
                </div>
            </div>

            <div class="message">
                Take a moment to explore your dashboard, discover new rituals, and schedule the experience you deserve.
            </div>
        </div>

        ${renderFooter([
          `You are receiving this email because your ${brandName} account was successfully verified.`,
          "We look forward to welcoming you in person."
        ])}
    `;

  return createEmailTemplate(
    `Welcome to ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, #9C7A2B 100%)`,
    content,
    spaColors.primaryDark
  );
};

export const resetPasswordEmailTemplate = (resetLink: string, userName?: string) => {
  const content = `
        <div class="header">
            <h1>&#128274; Reset Your Password</h1>
            <p>Restore access to your ${brandName} account.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ""},
            </div>

            <div class="message">
                We received a request to update the password for your ${brandName} account. Select the button below to create a new password and continue enjoying our bespoke services.
            </div>

            <div class="button-container">
                <a href="${resetLink}" class="action-button">
                    Create New Password
                </a>
            </div>

            <div class="warning">
                <strong>For your security:</strong> This reset link remains active for 60 minutes. If you did not request a password reset, please ignore this email or notify our concierge team immediately.
            </div>

            <div class="message">
                If the button does not open, copy and paste this link into your browser:
                <br><br>
                <a href="${resetLink}" class="link">${resetLink}</a>
            </div>
        </div>

        ${renderFooter([
          `You are receiving this email because a password reset was requested for your ${brandName} account.`
        ])}
    `;

  return createEmailTemplate(
    `Reset Password - ${brandName}`,
    `linear-gradient(135deg, #E5C87A 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};

export const twoFactorEmailTemplate = (token: string, userName?: string) => {
  const content = `
        <div class="header">
            <h1>&#128275; Two-Factor Authentication</h1>
            <p>Use this code to continue securely.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ""},
            </div>

            <div class="message">
                To finish signing in to your ${brandName} account, enter the one-time code below:
            </div>

            <div class="code-container">
                <span class="verification-code">${token}</span>
            </div>

            <div class="message">
                This code expires in 10 minutes. Never share it with anyone.
            </div>

            <div class="warning">
                <strong>Did not attempt to sign in?</strong> Please change your password immediately and reach out to our concierge team so we can secure your account.
            </div>
        </div>

        ${renderFooter([
          `You are receiving this email because a login attempt was made on your ${brandName} account.`
        ])}
    `;

  return createEmailTemplate(
    `Two-Factor Authentication - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};

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
            <h1>&#9989; Booking Confirmed</h1>
            <p>Your restorative experience is reserved.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                We are delighted to confirm your booking. Below are the details of your upcoming visit:
            </div>

            <div class="features">
                <h3>Booking Details</h3>
                <div class="feature">
                    <span class="feature-icon">&#128221;</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#127873;</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128205;</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128197;</span>
                    <strong>Date and Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128181;</span>
                    <strong>Total Investment:</strong> ${formatCurrency(bookingDetails.totalPrice)}
                </div>
                ${bookingDetails.notes ? `
                <div class="feature">
                    <span class="feature-icon">&#9998;</span>
                    <strong>Notes:</strong> ${bookingDetails.notes}
                </div>
                ` : ""}
            </div>

            <div class="message">
                Please arrive ten minutes early to enjoy a calming tea and prepare for your session. If you need to adjust your booking, simply reply to this email and we will assist.
            </div>
        </div>

        ${renderFooter([
          "Thank you for choosing our therapists to care for you."
        ])}
    `;

  return createEmailTemplate(
    `Booking Confirmed - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, #9C7A2B 100%)`,
    content,
    spaColors.primaryDark
  );
};

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
            <h1>&#10060; Booking Cancelled</h1>
            <p>Your appointment has been released.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                Your booking has been cancelled as requested. A summary of the cancelled appointment is below:
            </div>

            <div class="features">
                <h3>Cancelled Booking Details</h3>
                <div class="feature">
                    <span class="feature-icon">&#128221;</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#127873;</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128205;</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128197;</span>
                    <strong>Date and Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
            </div>

            <div class="message">
                We hope to see you soon. When you are ready to rebook, simply visit your dashboard or contact our concierge team.
            </div>
        </div>

        ${renderFooter([
          "We appreciate the opportunity to care for you in the future."
        ])}
    `;

  return createEmailTemplate(
    `Booking Cancelled - ${brandName}`,
    `linear-gradient(135deg, #F4C27A 0%, #D48A3A 100%)`,
    content,
    "#D48A3A"
  );
};

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
            <h1>&#127873; Gift Voucher Confirmed</h1>
            <p>A touch of Golden Hands Spa luxury is on its way.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                Thank you for choosing a ${brandName} gift voucher. Here are the details of your purchase:
            </div>

            <div class="features">
                <h3>Voucher Summary</h3>
                <div class="feature">
                    <span class="feature-icon">&#128179;</span>
                    <strong>Voucher Code:</strong> ${voucherDetails.code}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#127872;</span>
                    <strong>Experience:</strong> ${voucherDetails.templateName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128181;</span>
                    <strong>Value:</strong> ${formatCurrency(voucherDetails.originalValue)}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#9201;</span>
                    <strong>Expires:</strong> ${new Date(voucherDetails.expiresAt).toLocaleDateString()}
                </div>
                ${voucherDetails.recipientEmail ? `
                <div class="feature">
                    <span class="feature-icon">&#128231;</span>
                    <strong>Recipient:</strong> ${voucherDetails.recipientName || voucherDetails.recipientEmail}
                </div>
                ` : ""}
                ${voucherDetails.message ? `
                <div class="feature">
                    <span class="feature-icon">&#9998;</span>
                    <strong>Message:</strong> ${voucherDetails.message}
                </div>
                ` : ""}
            </div>

            <div class="message">
                ${voucherDetails.recipientEmail
                  ? "The recipient will receive a separate email with their voucher and redemption steps."
                  : "Share the voucher code with your recipient so they can redeem it when booking."}
            </div>
        </div>

        ${renderFooter([
          "Thank you for gifting a Golden Hands Spa experience."
        ])}
    `;

  return createEmailTemplate(
    `Gift Voucher Purchase Confirmation - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};

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
            <h1>&#127873; You Have Received a Gift</h1>
            <p>${purchaserName} has sent luxury time at ${brandName}.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${recipientName},
            </div>

            <div class="message">
                We are delighted to share that ${purchaserName} has gifted you a ${brandName} experience. Your voucher details are below:
            </div>

            ${voucherDetails.message ? `
            <div class="features">
                <h3>A note from ${purchaserName}</h3>
                <p style="font-style: italic; color: ${spaColors.muted}; background-color: #FFFBF2; border-radius: 14px; padding: 18px; margin: 0;">
                    "${voucherDetails.message}"
                </p>
            </div>
            ` : ""}

            <div class="code-container">
                <div class="verification-code" style="background: linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%);">
                    ${voucherDetails.code}
                </div>
            </div>

            <div class="features">
                <h3>Voucher Summary</h3>
                <div class="feature">
                    <span class="feature-icon">&#127872;</span>
                    <strong>Experience:</strong> ${voucherDetails.templateName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128181;</span>
                    <strong>Value:</strong> ${formatCurrency(voucherDetails.originalValue)}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#9201;</span>
                    <strong>Expires:</strong> ${new Date(voucherDetails.expiresAt).toLocaleDateString()}
                </div>
            </div>

            <div class="message">
                Redeem your voucher when booking online or present this code at reception. We cannot wait to pamper you.
            </div>
        </div>

        ${renderFooter([
          "We look forward to welcoming you to the spa."
        ])}
    `;

  return createEmailTemplate(
    `Gift Voucher from ${purchaserName} - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};

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
  const statusStyles = {
    PENDING: {
      icon: "&#9200;",
      gradient: "linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)",
      link: spaColors.primaryDark,
    },
    CONFIRMED: {
      icon: "&#9989;",
      gradient: "linear-gradient(135deg, #D4AF37 0%, #8C6720 100%)",
      link: spaColors.primaryDark,
    },
    CANCELLED: {
      icon: "&#10060;",
      gradient: "linear-gradient(135deg, #FADBD2 0%, #E26A5C 100%)",
      link: "#C05045",
    },
    COMPLETED: {
      icon: "&#127775;",
      gradient: "linear-gradient(135deg, #E8D8B0 0%, #B8860B 100%)",
      link: spaColors.primaryDark,
    },
  } as const;

  const style =
    statusStyles[bookingDetails.status as keyof typeof statusStyles] || statusStyles.PENDING;

  const readableStatus = bookingDetails.status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const content = `
        <div class="header">
            <h1>${style.icon} Booking Status: ${readableStatus}</h1>
            <p>Your appointment information has been refreshed.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                We wanted to let you know that your booking status is now <strong>${readableStatus}</strong>.
            </div>

            <div class="features">
                <h3>Booking Details</h3>
                <div class="feature">
                    <span class="feature-icon">&#128221;</span>
                    <strong>Booking ID:</strong> ${bookingDetails.id}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#127873;</span>
                    <strong>Service:</strong> ${bookingDetails.serviceName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128205;</span>
                    <strong>Location:</strong> ${bookingDetails.branchName}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128197;</span>
                    <strong>Date and Time:</strong> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128276;</span>
                    <strong>Status:</strong> ${readableStatus}
                </div>
                ${bookingDetails.adminNotes ? `
                <div class="feature">
                    <span class="feature-icon">&#9998;</span>
                    <strong>Concierge Notes:</strong> ${bookingDetails.adminNotes}
                </div>
                ` : ""}
            </div>

            <div class="message">
                If you have any questions about this update, simply respond to this email and our concierge team will assist.
            </div>
        </div>

        ${renderFooter([
          "Thank you for trusting us with your wellness journey."
        ])}
    `;

  return createEmailTemplate(
    `Booking Status Update - ${brandName}`,
    style.gradient,
    content,
    style.link
  );
};

export const userRoleChangeEmailTemplate = (
  userName: string,
  newRole: string,
  changedBy: string
) => {
  const content = `
        <div class="header">
            <h1>&#128188; Team Access Updated</h1>
            <p>Your ${brandName} account permissions have changed.</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello ${userName},
            </div>

            <div class="message">
                This is a quick note to let you know that your role within the ${brandName} management portal has been updated by ${changedBy}.
            </div>

            <div class="features">
                <h3>Role Details</h3>
                <div class="feature">
                    <span class="feature-icon">&#11088;</span>
                    <strong>New Role:</strong> ${newRole}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#128100;</span>
                    <strong>Updated By:</strong> ${changedBy}
                </div>
                <div class="feature">
                    <span class="feature-icon">&#9201;</span>
                    <strong>Effective:</strong> ${new Date().toLocaleString()}
                </div>
            </div>

            <div class="message">
                ${newRole === "ADMIN"
                  ? "You now have access to the full suite of administrative tools, including booking management and team oversight."
                  : "Your access has been adjusted to reflect standard team privileges."}
            </div>

            <div class="message">
                If this update is unexpected, please reach out to leadership or respond to this email so we can review immediately.
            </div>
        </div>

        ${renderFooter([
          "This notification keeps our team transparent and secure."
        ])}
    `;

  return createEmailTemplate(
    `Account Role Updated - ${brandName}`,
    `linear-gradient(135deg, ${spaColors.primary} 0%, ${spaColors.primaryDark} 100%)`,
    content,
    spaColors.primaryDark
  );
};
