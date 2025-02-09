import { createToken } from "./jwt";
const nodemailer = require("nodemailer");

interface sendEmailData {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export const sendEmail = async (emailData: sendEmailData) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE_ENABLED === "1", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // logger: true,
    // debug: true,
  });
  const emailDefaults = {
    from: `snoopForms <${process.env.MAIL_FROM || "noreply@snoopforms.com"}>`,
  };
  await transporter.sendMail({ ...emailDefaults, ...emailData });
};

export const sendVerificationEmail = async (user) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${encodeURIComponent(token)}`;
  const verificationRequestLink = `${
    process.env.NEXTAUTH_URL
  }/auth/verification-requested?email=${encodeURIComponent(user.email)}`;
  await sendEmail({
    to: user.email,
    subject: "Welcome to snoopForms",
    html: `Welcome to snoopForms!<br/><br/>To verify your email address and start using snoopForms please click this link:<br/>
    <a href="${verifyLink}">${verifyLink}</a><br/>
    <br/>
    The link is valid for one day. If it has expired please request a new token here:<br/>
    <a href="${verificationRequestLink}">${verificationRequestLink}</a><br/>
    <br/>
    Your snoopForms Team`,
  });
};

export const sendForgotPasswordEmail = async (user) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your snoopForms password",
    html: `You have requested a link to change your password. You can do this through the link below:<br/>
    <a href="${verifyLink}">${verifyLink}</a><br/>
    <br/>
    The link is valid for 24 hours. If you didn't request this, please ignore this email.<br/>
    <br/>
    Your password won't change until you access the link above and create a new one.<br/>
    <br/>
    Your snoopForms Team`,
  });
};

export const sendPasswordResetNotifyEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: "Your snoopForms password has been changed",
    html: `We're contacting you to notify you that your password has been changed.<br/>
    <br/>
    Your snoopForms Team`,
  });
};

export const sendPageSubmissionEmail = async (email: string, formName: string, formId: string) => {
  await sendEmail({
    to: email,
    subject: `${formName} new page submission`,
    html: `Hey, someone just filled out a page of ${formName} in Formbricks.<br/>
    
    Click <a href="${process.env.NEXTAUTH_URL}/forms/${formId}/results/responses">here</a> to see new submission`,
  });
};

export const sendFormSubmissionEmail = async (email: string, formName: string, formId: string) => {
  await sendEmail({
    to: email,
    subject: `${formName} new submission`,
    html: `Hey, someone just filled out ${formName} in Formbricks.<br/>
    <br/>
    
    Click <a href="${process.env.NEXTAUTH_URL}/forms/${formId}/results/responses">here</a> to see new submission`,
  });
};
