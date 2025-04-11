import React from "react";
import { Container } from "reactstrap";
import "./PrivacyPolicy.css"; // Optional: Your custom CSS file for additional styling

const PrivacyPolicy = () => {
  return (
    <Container className="privacy-policy py-5">
      <h1 className="mb-4">Privacy Policy</h1>

      <p>
        <strong>ShutterDown</strong> ("we", "our", or "us") is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, disclose, and safeguard your
        information when you use our web application (the "Service"), including when
        you connect your Google Calendar account.
      </p>

      <p>
        By using our Service, you agree to the collection and use of information in
        accordance with this Privacy Policy.
      </p>

      <h2 className="mt-5">1. Information We Collect</h2>
      <h5>a. Personal Information</h5>
      <ul>
        <li>Name, email address, and profile picture when you sign in with Google.</li>
        <li>Google Calendar data (only with your explicit permission), such as:
          <ul>
            <li>Event titles, times, and descriptions</li>
            <li>Calendar names</li>
          </ul>
        </li>
      </ul>

      <h5 className="mt-3">b. Usage Data</h5>
      <ul>
        <li>Information on how you interact with our app, including pages visited and features used.</li>
        <li>Device information (browser type, operating system, etc.).</li>
      </ul>

      <h2 className="mt-5">2. How We Use Your Information</h2>
      <ul>
        <li>Manage and display wedding-related events in your calendar.</li>
        <li>Send reminders, notifications, or updates related to your events.</li>
        <li>Improve our app’s functionality and user experience.</li>
        <li>Provide customer support.</li>
      </ul>
      <p>We do <strong>not</strong> sell or rent your personal data to third parties.</p>

      <h2 className="mt-5">3. Google Calendar Integration</h2>
      <p>
        Our app uses Google Calendar API to access and manage your calendar data. This access is
        used solely for internal user event planning and scheduling within the app.
      </p>
      <p>
        We adhere to Google API Services User Data Policy, including the <strong>Limited Use</strong> requirements:
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer"> https://developers.google.com/terms/api-services-user-data-policy</a>
      </p>

      <h2 className="mt-5">4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your data. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2 className="mt-5">5. Your Choices and Rights</h2>
      <ul>
        <li>Disconnect your Google account at any time.</li>
        <li>Request deletion of your data by contacting us at <a href="mailto:lakshya@shutterdown.in">lakshya@shutterdown.in</a>.</li>
      </ul>

      <h2 className="mt-5">6. Third-Party Services</h2>
      <p>
        Our app may contain links to other services not operated by us. We are not responsible for the
        content or privacy practices of those services.
      </p>

      <h2 className="mt-5">7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by
        posting the new version on this page.
      </p>

      <h2 className="mt-5">8. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <ul>
        <li>Email: <a href="mailto:lakshya@shutterdown.in">lakshya@shutterdown.in</a></li>
        <li>Website: <a href="https://shutterdown.vercel.app" target="_blank" rel="noopener noreferrer">https://shutterdown.vercel.app</a></li>
      </ul>
    </Container>
  );
};

export default PrivacyPolicy;
