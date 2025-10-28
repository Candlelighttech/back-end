import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Plus, Search, ExternalLink, Copy, Trash2, Calendar, Eye } from 'lucide-react';
import { demoProjects } from '@/data/demoData';
import { useToaster } from '@/contexts/ToasterContext';

export default function Projects() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('candlelight_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const { showToaster } = useToaster();

  // Save to localStorage whenever projects change
  const updateProjects = (newProjects: any[]) => {
    setProjects(newProjects);
    localStorage.setItem('candlelight_projects', JSON.stringify(newProjects));
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    domain: '',
    image: ''
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: String(Date.now()),
        title: newProject.name,
        thumbnail: newProject.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        lastEdited: 'Just now',
        status: 'Draft',
        url: newProject.domain || null
      };
      updateProjects([project, ...projects]);
      setNewProject({ name: '', description: '', domain: '', image: '' });
      setShowCreateModal(false);
      showToaster('success', 'Project Created', 'Your project has been created successfully');
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      updateProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
      showToaster('success', 'Project Deleted', 'Project has been deleted successfully');
    }
  };

  const handleDuplicateProject = (project: any) => {
    const duplicated = {
      ...project,
      id: String(Date.now()),
      title: `${project.title} (Copy)`,
      lastEdited: 'Just now',
      status: 'Draft',
      url: null
    };
    updateProjects([duplicated, ...projects]);
    showToaster('success', 'Project Duplicated', 'Project has been duplicated successfully');
  };

  const handlePublishProject = (id: string) => {
    updateProjects(projects.map(p =>
      p.id === id
        ? { ...p, status: 'Published', url: `${p.title.toLowerCase().replace(/\s+/g, '-')}.candlelight.app` }
        : p
    ));
    showToaster('success', 'Project Published', 'Your project is now live!');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage and organize all your website projects
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <select 
          className="px-4 py-2 rounded-lg bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
          <Card key={project.id} glass className="group">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  project.status === 'Published'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-heading font-bold text-foreground mb-2">
              {project.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>Updated {project.lastEdited}</span>
            </div>

            {project.url && (
              <div className="flex items-center gap-2 text-xs text-secondary mb-4">
                <ExternalLink className="w-4 h-4" />
                <span>{project.url}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => project.url ? window.open(`https://${project.url}`, '_blank') : alert('Project not published yet')}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">View</span>
              </Button>
              {project.status === 'Draft' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePublishProject(project.id)}
                  className="px-2 sm:px-3 text-xs"
                >
                  Publish
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDuplicateProject(project)}
                className="px-2 sm:px-3"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProject(project);
                  setShowDeleteModal(true);
                }}
                className="px-2 sm:px-3"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
              </Button>
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
              {searchQuery || statusFilter !== 'All Status' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'All Status' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first project to start building amazing websites.'}
            </p>
            {!searchQuery && statusFilter === 'All Status' && (
              <Button
                variant="primary"
                className="gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4" />
                Create First Project
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="My Awesome Website"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
          />
          <Input
            label="Description"
            placeholder="Brief description of your project"
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          />
          <Input
            label="Domain (Optional)"
            placeholder="mywebsite.com"
            value={newProject.domain}
            onChange={(e) => setNewProject({...newProject, domain: e.target.value})}
          />
          <Input
            label="Image URL (Optional)"
            placeholder="https://example.com/image.jpg"
            value={newProject.image}
            onChange={(e) => setNewProject({...newProject, image: e.target.value})}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
        size="sm"
      >
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
