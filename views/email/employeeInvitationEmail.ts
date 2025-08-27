export const employeeInvitationContent = (
  link: string,
  companyName: string,
) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: sans-serif; padding: 20px; background-color: #ffffff; color: #333;">
      <h2>You've Been Invited to Join Gnezabe Security Training 🎉</h2>
      <p>Hello,</p>
      <p><strong>${companyName}</strong> has invited you to join Gnezabe Security Training — a platform designed to help you strengthen your cybersecurity knowledge and awareness.</p>
      <p>To get started, please click the button below and complete the registration process by filling in the necessary information.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="
          background-color: #21C453;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          display: inline-block;
        ">Join Now</a>
      </p>
      <p style="color: #777; font-size: 14px;">
        If you were not expecting this invitation, you can safely ignore this email.
      </p>
      <p>
        Stay safe,<br />
        <strong>The Gnezabe Security Training Team</strong>
      </p>
    </body>
  </html>
`;

export const employeeInvitationSubject = `You’ve Been Invited to Join Gnezabe Security Training`;

export const employeeInvitationSender = {
  name: 'Gnezabe Security Training',
  email: 'eyihalem.cctechet@gmail.com',
};
