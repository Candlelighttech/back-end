import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Plus, Trash2, Shield, Edit, MessageSquare } from 'lucide-react';
import { demoTeamMembers, demoComments } from '@/data/demoData';
import { useToaster } from '@/contexts/ToasterContext';

export default function Team() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('candlelight_team');
    return saved ? JSON.parse(saved) : demoTeamMembers;
  });
  const { showToaster } = useToaster();

  // Save to localStorage whenever members change
  const updateMembers = (newMembers: any[]) => {
    setMembers(newMembers);
    localStorage.setItem('candlelight_team', JSON.stringify(newMembers));
  };
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState('');

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember = {
        id: String(members.length + 1),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      updateMembers([...members, newMember]);
      setInviteEmail('');
      setShowInviteModal(false);
      showToaster('success', 'Member Invited', 'Team member has been invited successfully');
    }
  };

  const handleRemoveMember = (id: string) => {
    updateMembers(members.filter(m => m.id !== id));
    showToaster('success', 'Member Removed', 'Team member has been removed successfully');
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setEditRole(member.role);
    setShowEditModal(true);
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      updateMembers(members.map(m =>
        m.id === editingMember.id
          ? { ...m, role: editRole }
          : m
      ));
      setShowEditModal(false);
      setEditingMember(null);
      showToaster('success', 'Member Updated', 'Team member role has been updated successfully');
    }
  };

  const roleColors = {
    Admin: 'bg-primary/20 text-primary-foreground',
    Editor: 'bg-secondary/20 text-secondary-foreground',
    Viewer: 'bg-muted/20 text-muted-foreground'
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
            Team & Collaboration
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage team members and collaborate on projects
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2 w-full sm:w-auto"
          onClick={() => setShowInviteModal(true)}
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Members */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">
          Team Members ({members.length})
        </h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-background border border-border gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 justify-end">
                <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${roleColors[member.role as keyof typeof roleColors]}`}>
                  {member.role}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-2"
                  onClick={() => handleEditMember(member)}
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Permissions */}
      <Card glass>
        <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
          Role Permissions
        </h2>
        <div className="space-y-3 sm:hidden">
          {[
            { name: 'View Projects', admin: true, editor: true, viewer: true },
            { name: 'Edit Projects', admin: true, editor: true, viewer: false },
            { name: 'Delete Projects', admin: true, editor: false, viewer: false },
            { name: 'Manage Team', admin: true, editor: false, viewer: false },
            { name: 'Billing Access', admin: true, editor: false, viewer: false }
          ].map((permission, index) => (
            <div key={index} className="p-3 rounded-lg bg-background border border-border">
              <p className="text-sm font-medium text-foreground mb-2">{permission.name}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Admin:</span>
                  {permission.admin ? <span className="text-secondary">✓</span> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Editor:</span>
                  {permission.editor ? <span className="text-secondary">✓</span> : <span className="text-muted-foreground">✗</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Viewer:</span>
                  {permission.viewer ? <span className="text-secondary">✓</span> : <span className="text-muted-foreground">✗</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Permission</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Admin</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Editor</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: 'View Projects', admin: true, editor: true, viewer: true },
                { name: 'Edit Projects', admin: true, editor: true, viewer: false },
                { name: 'Delete Projects', admin: true, editor: false, viewer: false },
                { name: 'Manage Team', admin: true, editor: false, viewer: false },
                { name: 'Billing Access', admin: true, editor: false, viewer: false }
              ].map((permission, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-sm text-foreground">{permission.name}</td>
                  <td className="py-3 px-4 text-center">
                    {permission.admin && <span className="text-secondary">✓</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission.editor && <span className="text-secondary">✓</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission.viewer && <span className="text-secondary">✓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Comments */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-secondary" />
          Recent Comments
        </h2>
        <div className="space-y-4">
          {demoComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 sm:gap-3">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleInvite}>
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingMember(null);
        }}
        title="Edit Team Member"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Member: {editingMember?.name}
            </label>
            <p className="text-sm text-muted-foreground">{editingMember?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditModal(false);
                setEditingMember(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateMember}>
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
