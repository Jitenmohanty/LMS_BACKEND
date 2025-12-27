// ============================================================================
// FILE: src/templates/auth/password-changed.template.ts
// ============================================================================
export const getPasswordChangedTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
    .alert { background-color: #FFF3CD; color: #856404; padding: 10px; border-radius: 4px; margin: 15px 0; border: 1px solid #FFEEBA; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Security Alert</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>
      
      <p>This email is to confirm that the password for your account has been successfully changed.</p>
      
      <div class="alert">
        <strong>If you did not make this change, please contact our support team immediately.</strong>
      </div>
      
      <p>For security purposes, this notification is sent to the email address on file whenever your password is updated.</p>
      
      <p>Best regards,<br>The Learning Platform Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Learning Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
