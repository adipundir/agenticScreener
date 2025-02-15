import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    companyName: string;
    interviewLink: string;
}

export const InterviewInvitationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    companyName,
    interviewLink,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
        <p>Dear {firstName},</p>

        <p>
            We are pleased to inform you that you have been selected for an interview for a position at {companyName}.
            We were impressed with your application and would love to learn more about you.
        </p>

        <p>
            To proceed, please click the link below to start an online interview with our Recruitment Agent:
        </p>

        <p>
            <a href={interviewLink} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                Start Your Interview
            </a>
        </p>

        <p>
            If you have any questions or need to reschedule, feel free to reply to this email.
        </p>

        <p>We look forward to speaking with you!</p>

        <p>Sincerely,</p>
        <p>{companyName} Hiring Team</p>
    </div>
);
