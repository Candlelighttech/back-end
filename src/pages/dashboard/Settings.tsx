import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { User, Palette, Bell, Save } from 'lucide-react';
import { useToaster } from '@/contexts/ToasterContext';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { showToaster } = useToaster();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });
  const [brandKit, setBrandKit] = useState({
    primaryColor: '#535C91',
    secondaryColor: '#9290C3',
    font: 'Inter'
  });
  const [saved, setSaved] = useState(false);
  const [brandSaved, setBrandSaved] = useState(false);

  const handleSaveProfile = () => {
    // Update user context with new profile data
    updateUser({
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    showToaster('success', 'Profile Saved', 'Your profile has been updated successfully');
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleSaveBrandKit = () => {
    // Convert hex to HSL and apply colors
    const primaryHsl = hexToHsl(brandKit.primaryColor);
    const secondaryHsl = hexToHsl(brandKit.secondaryColor);
    
    document.documentElement.style.setProperty('--primary', primaryHsl);
    document.documentElement.style.setProperty('--secondary', secondaryHsl);
    document.documentElement.style.setProperty('--font-family', brandKit.font);
    
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
    showToaster('success', 'Brand Kit Saved', 'Your brand settings have been updated successfully');
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card glass>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Profile Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-secondary"
            />
          </div>
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Button
            variant="primary"
            className="gap-2"
            onClick={handleSaveProfile}
          >
            {saved ? (
              <>
                <Save className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Brand Kit */}
      <Card glass>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Brand Kit
          </h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandKit.primaryColor}
                  onChange={(e) => {
                    setBrandKit({ ...brandKit, primaryColor: e.target.value });
                    const hsl = hexToHsl(e.target.value);
                    document.documentElement.style.setProperty('--primary', hsl);
                  }}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <Input
                  value={brandKit.primaryColor}
                  onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandKit.secondaryColor}
                  onChange={(e) => {
                    setBrandKit({ ...brandKit, secondaryColor: e.target.value });
                    const hsl = hexToHsl(e.target.value);
                    document.documentElement.style.setProperty('--secondary', hsl);
                  }}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <Input
                  value={brandKit.secondaryColor}
                  onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Font Family
            </label>
            <select
              value={brandKit.font}
              onChange={(e) => {
                setBrandKit({ ...brandKit, font: e.target.value });
                document.body.style.fontFamily = e.target.value;
              }}
              className="w-full px-4 py-2 rounded-lg bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option>Inter</option>
              <option>Roboto</option>
              <option>Open Sans</option>
            </select>
          </div>
          <Button
            variant="primary"
            className="gap-2"
            onClick={handleSaveBrandKit}
          >
            {brandSaved ? (
              <>
                <Save className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Brand Kit
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card glass>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive email updates about your projects</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Reports</p>
              <p className="text-xs text-muted-foreground">Get weekly analytics summaries</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Marketing Updates</p>
              <p className="text-xs text-muted-foreground">Receive news and tips</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </Card>


    </div>
  );
}
