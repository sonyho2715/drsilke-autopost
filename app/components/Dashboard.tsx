'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  status: string;
  scheduledFor: string | null;
  postedAt: string | null;
  createdAt: string;
  error: string | null;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [schedulingWeek, setSchedulingWeek] = useState(false);
  const [fetchingContent, setFetchingContent] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSchedule: true })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate post');
      }

      await fetchPosts();
      alert('Post generated successfully!');
    } catch (error: any) {
      console.error('Error generating post:', error);
      alert(`Failed to generate post: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const scheduleWeek = async () => {
    setSchedulingWeek(true);
    try {
      const response = await fetch('/api/posts/schedule-week', {
        method: 'POST'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to schedule posts');
      }

      await fetchPosts();
      alert(`Generated ${data.postsGenerated} posts for the week!`);
    } catch (error: any) {
      console.error('Error scheduling week:', error);
      alert(`Failed to schedule posts: ${error.message}`);
    } finally {
      setSchedulingWeek(false);
    }
  };

  const fetchContent = async () => {
    setFetchingContent(true);
    try {
      const response = await fetch('/api/content/fetch', {
        method: 'POST'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch content');
      }

      alert('Content sources fetched successfully! You can now generate posts.');
    } catch (error: any) {
      console.error('Error fetching content:', error);
      alert(`Failed to fetch content: ${error.message}`);
    } finally {
      setFetchingContent(false);
    }
  };

  const publishPost = async (postId: string) => {
    if (!confirm('Publish this post to Facebook now?')) return;

    try {
      await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      await fetchPosts();
      alert('Post published successfully!');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Delete this post?')) return;

    try {
      await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE'
      });
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dr. Silke Auto-Post Dashboard
          </h1>
          <p className="text-gray-600">
            Automated social media posting for Dr. Silke Vogelmann-Sine, Ph.D.
          </p>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={fetchContent}
            disabled={fetchingContent}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetchingContent ? 'Fetching...' : 'Fetch Content Sources'}
          </button>
          <button
            onClick={generatePost}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate New Post'}
          </button>
          <button
            onClick={scheduleWeek}
            disabled={schedulingWeek}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {schedulingWeek ? 'Scheduling...' : 'Schedule Week (Mon, Wed, Fri, Sat)'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No posts yet. Generate your first post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {formatDate(post.createdAt)}
                    </p>
                    {post.scheduledFor && (
                      <p className="text-sm text-gray-500">
                        Scheduled: {formatDate(post.scheduledFor)}
                      </p>
                    )}
                    {post.postedAt && (
                      <p className="text-sm text-gray-500">
                        Posted: {formatDate(post.postedAt)}
                      </p>
                    )}
                    {post.status === 'failed' && post.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800 font-medium">Error:</p>
                        <p className="text-xs text-red-600 mt-1">{post.error}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {(post.status === 'draft' || post.status === 'scheduled' || post.status === 'failed') && (
                      <button
                        onClick={() => publishPost(post.id)}
                        className={`${
                          post.status === 'failed'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white px-4 py-2 rounded text-sm font-medium`}
                      >
                        {post.status === 'failed' ? 'Retry Publish' : 'Publish Now'}
                      </button>
                    )}
                    {post.status !== 'posted' && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  {post.imageUrl && (
                    <div className="mb-4">
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        width={400}
                        height={400}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
