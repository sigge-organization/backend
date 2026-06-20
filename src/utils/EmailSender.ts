import nodemailer from 'nodemailer';
import 'dotenv/config';


export async function sendPasswordResetEmail(
  recipientEmail: string,
  userName: string,
  resetCode: string
): Promise<void> {
  const senderEmail = process.env.SMTP_USER;
  const systemBaseUrl = process.env.SYSTEM_BASE_URL;

  if (!senderEmail || !systemBaseUrl) {
    throw new Error('Variáveis SMTP_USER ou SYSTEM_BASE_URL não definidas.');
  }

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Recuperação de Senha`;

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;
                    border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Recuperação de Senha</h2>
          <p>Olá, ${userName}!</p>
          <p>Você solicitou a recuperação de senha. Use o código abaixo:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;
                      text-align: center; margin: 20px 0;">
            <strong style="font-size: 32px; letter-spacing: 8px; color: #333;">
              ${resetCode}
            </strong>
          </div>
          <p style="text-align: center;">
            <a href="${systemBaseUrl}/reset-password?code=${resetCode}&email=${encodeURIComponent(recipientEmail)}"
               style="background-color: #007bff; color: #fff; padding: 12px 25px;
                      text-decoration: none; border-radius: 5px; font-size: 16px;
                      display: inline-block;">
              Redefinir Senha
            </a>
          </p>
          <p>⏱ Este código expira em <strong>1 hora</strong>.</p>
          <p>Se você não solicitou isso, ignore este e-mail.</p>
          <p>Atenciosamente,<br/><strong>Sua Equipe</strong></p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `SIGGE <${senderEmail}>`,
    to: recipientEmail,
    subject,
    html: htmlBody,
  });

  console.log(`[Email] Código de reset enviado para ${recipientEmail}`);
}