export const metadata = {
  title: 'Privacy Policy - DrSilke Autopost',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700">
            This application is used exclusively for managing and automating social media posts
            for Dr. Silke&apos;s Facebook Page. We collect and process only the data necessary
            to schedule and publish posts to Facebook, including:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Facebook Page access tokens (for posting)</li>
            <li>Post content and scheduling information</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700">
            The information collected is used solely for:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Scheduling and publishing posts to the connected Facebook Page</li>
            <li>Managing post content and images</li>
            <li>Tracking post status and publishing history</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
          <p className="text-gray-700">
            Post data is stored securely in our database. Facebook access tokens are stored
            as environment variables and are not accessible to unauthorized parties.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
          <p className="text-gray-700">
            We do not sell, trade, or share your personal information with third parties.
            Data is only shared with Facebook/Meta for the purpose of publishing posts
            to your Page.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Data Deletion</h2>
          <p className="text-gray-700">
            You can request deletion of your data at any time. Visit our{' '}
            <a href="/data-deletion" className="text-blue-600 hover:underline">
              Data Deletion page
            </a>{' '}
            for instructions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
          <p className="text-gray-700">
            For any privacy-related questions or concerns, please contact us through
            the Dr. Silke Facebook Page.
          </p>
        </section>
      </div>
    </main>
  );
}
