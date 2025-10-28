import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { demoBlogPosts } from '@/data/demoData';
import { useToaster } from '@/contexts/ToasterContext';

export default function Blog() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('candlelight_posts');
    return saved ? JSON.parse(saved) : [];
  });
  const { showToaster } = useToaster();

  // Save to localStorage whenever posts change
  const updatePosts = (newPosts: any[]) => {
    setPosts(newPosts);
    localStorage.setItem('candlelight_posts', JSON.stringify(newPosts));
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: ''
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.excerpt) {
      const post = {
        id: String(posts.length + 1),
        ...newPost,
        status: 'Draft',
        publishDate: null,
        views: 0,
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop'
      };
      updatePosts([post, ...posts]);
      setNewPost({ title: '', excerpt: '', content: '' });
      setShowCreateModal(false);
      showToaster('success', 'Post Created', 'Your blog post has been created successfully');
    }
  };

  const handleDeletePost = (id: string) => {
    updatePosts(posts.filter(p => p.id !== id));
    showToaster('success', 'Post Deleted', 'Blog post has been deleted successfully');
  };

  const handlePublishPost = (id: string) => {
    updatePosts(posts.map(p =>
      p.id === id
        ? { ...p, status: 'Published', publishDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    showToaster('success', 'Post Published', 'Your blog post is now live!');
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setNewPost({ title: post.title, excerpt: post.excerpt, content: post.content });
    setShowEditModal(true);
  };

  const handleUpdatePost = () => {
    if (newPost.title && newPost.excerpt && editingPost) {
      updatePosts(posts.map(p =>
        p.id === editingPost.id
          ? { ...p, ...newPost }
          : p
      ));
      setNewPost({ title: '', excerpt: '', content: '' });
      setEditingPost(null);
      setShowEditModal(false);
      showToaster('success', 'Post Updated', 'Your blog post has been updated successfully');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Blog & Content Manager
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and publish your blog posts
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Card key={post.id} glass>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={post.image}
                alt={post.title}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    post.status === 'Published'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-4">
                  {post.publishDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Published {post.publishDate}</span>
                    </div>
                  )}
                  {post.views > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} views</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  {post.status === 'Draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishPost(post.id)}
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card glass className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              No blog posts yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first blog post to get started with content management.
            </p>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
              Create First Post
            </Button>
          </div>
        </Card>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Blog Post"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter post title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Excerpt
            </label>
            <textarea
              placeholder="Brief description of your post..."
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              className="w-full h-24 px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Content
            </label>
            <textarea
              placeholder="Write your post content..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full h-48 px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
              Create Post
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPost(null);
          setNewPost({ title: '', excerpt: '', content: '' });
        }}
        title="Edit Blog Post"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter post title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Excerpt
            </label>
            <textarea
              placeholder="Brief description of your post..."
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              className="w-full h-24 px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Content
            </label>
            <textarea
              placeholder="Write your post content..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full h-48 px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditModal(false);
                setEditingPost(null);
                setNewPost({ title: '', excerpt: '', content: '' });
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdatePost}>
              Update Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
