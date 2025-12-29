export const metadata = {
  title: 'Data Deletion - DrSilke Autopost',
};

export default function DataDeletion() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Data Deletion Instructions</h1>
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How to Request Data Deletion</h2>
          <p className="text-gray-700 mb-4">
            If you would like to request deletion of your data from the DrSilke Autopost
            application, please follow these steps:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Option 1: Contact via Facebook</h3>
            <p className="text-blue-800">
              Send a message to the Dr. Silke Facebook Page requesting data deletion.
              Include &quot;Data Deletion Request&quot; in your message.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-2">Option 2: Revoke App Access</h3>
            <p className="text-green-800">
              You can revoke this app&apos;s access to your Facebook account at any time:
            </p>
            <ol className="list-decimal ml-6 mt-2 text-green-800">
              <li>Go to Facebook Settings</li>
              <li>Click on &quot;Apps and Websites&quot;</li>
              <li>Find &quot;DrSilke&quot; in the list</li>
              <li>Click &quot;Remove&quot; to revoke access</li>
            </ol>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">What Data Will Be Deleted</h2>
          <p className="text-gray-700">
            Upon your request, we will delete:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>All scheduled and draft posts associated with your account</li>
            <li>Post history and analytics data</li>
            <li>Any stored access tokens</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
          <p className="text-gray-700">
            Data deletion requests will be processed within 30 days. You will receive
            confirmation once your data has been deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Questions?</h2>
          <p className="text-gray-700">
            If you have any questions about data deletion, please contact us through
            the Dr. Silke Facebook Page.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t">
          <a href="/privacy" className="text-blue-600 hover:underline">
            &larr; Back to Privacy Policy
          </a>
        </div>
      </div>
    </main>
  );
}
