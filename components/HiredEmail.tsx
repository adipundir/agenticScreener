import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    companyName: string;
}

export const HiredEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    companyName,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
        <p>Dear {firstName},</p>

        <p>
            We are pleased to inform you that you have been selected for the role at {companyName}!
            Your qualifications and experience stood out, and we are excited to move forward with you.
        </p>

        <p>
            Our recruitment team will be reaching out to you shortly with the next steps.
            In the meantime, if you have any questions, feel free to reply to this email.
        </p>

        <p>We look forward to having you onboard!</p>

        <p>Sincerely,</p>
        <p>{companyName} Hiring Team</p>
    </div>
);
