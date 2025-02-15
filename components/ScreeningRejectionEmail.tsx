import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    companyName: string;
}

export const RejectionEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    companyName,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
        <p>Dear {firstName},</p>

        <p>
            Thank you for taking the time to apply for a position at {companyName}.
            We truly appreciate your interest and the effort you put into your application.
        </p>

        <p>
            After careful consideration, we regret to inform you that we will not be moving forward
            with your application at this time. This decision was not an easy one, as we received
            applications from many talented candidates.
        </p>

        <p>
            We encourage you to keep an eye on future opportunities with {companyName}, as we would
            love to see you apply again for a role that aligns with your skills and experience.
        </p>

        <p>Wishing you all the best in your job search and future endeavors.</p>

        <p>Sincerely,</p>
        <p>{companyName} Hiring Team</p>
    </div>
);
