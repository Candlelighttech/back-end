import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Upload, Download, Globe, Github, CheckCircle, Clock } from 'lucide-react';
import { useToaster } from '@/contexts/ToasterContext';

export default function Deploy() {
  const [subdomain, setSubdomain] = useState(() => {
    const saved = localStorage.getItem('candlelight_deploy_subdomain');
    return saved || '';
  });
  const { showToaster } = useToaster();
  const [customDomain, setCustomDomain] = useState(() => {
    const saved = localStorage.getItem('candlelight_deploy_domain');
    return saved || '';
  });
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>(() => {
    const saved = localStorage.getItem('candlelight_deploy_status');
    return (saved as any) || 'idle';
  });
  const [domainStatus, setDomainStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>(() => {
    const saved = localStorage.getItem('candlelight_domain_status');
    return (saved as any) || 'idle';
  });
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'publishing' | 'published'>(() => {
    const saved = localStorage.getItem('candlelight_subdomain_status');
    return (saved as any) || 'idle';
  });
  const [integrations, setIntegrations] = useState([
    { name: 'GitHub', icon: Github, connected: true, color: 'text-gray-400' },
    { name: 'Netlify', icon: Globe, connected: false, color: 'text-teal-400' },
    { name: 'Vercel', icon: Upload, connected: false, color: 'text-blue-400' }
  ]);

  // Save to localStorage functions
  const updateSubdomain = (value: string) => {
    setSubdomain(value);
    localStorage.setItem('candlelight_deploy_subdomain', value);
  };

  const updateCustomDomain = (value: string) => {
    setCustomDomain(value);
    localStorage.setItem('candlelight_deploy_domain', value);
  };

  const updateDeployStatus = (status: 'idle' | 'deploying' | 'success' | 'error') => {
    setDeployStatus(status);
    localStorage.setItem('candlelight_deploy_status', status);
  };

  const updateDomainStatus = (status: 'idle' | 'connecting' | 'connected' | 'error') => {
    setDomainStatus(status);
    localStorage.setItem('candlelight_domain_status', status);
  };

  const updateSubdomainStatus = (status: 'idle' | 'publishing' | 'published') => {
    setSubdomainStatus(status);
    localStorage.setItem('candlelight_subdomain_status', status);
  };

  const updateIntegrations = (newIntegrations: any[]) => {
    setIntegrations(newIntegrations);
    localStorage.setItem('candlelight_deploy_integrations', JSON.stringify(newIntegrations));
  };

  const handleDeploy = async () => {
    updateDeployStatus('deploying');
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateDeployStatus('success');
    showToaster('success', 'Deployment Complete', 'Your website has been deployed successfully!');
  };

  const handleConnectDomain = async () => {
    if (!customDomain.trim()) return;
    
    updateDomainStatus('connecting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateDomainStatus('connected');
    showToaster('success', 'Domain Connected', 'Your custom domain has been connected successfully!');
  };

  const handlePublishSubdomain = async () => {
    if (!subdomain.trim()) return;
    
    updateSubdomainStatus('publishing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateSubdomainStatus('published');
    showToaster('success', 'Subdomain Published', 'Your website is now live on the subdomain!');
  };

  const handleDownloadWebsite = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #333; text-align: center; }
        .hero { text-align: center; padding: 60px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; margin: 20px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 40px 0; }
        .feature { padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to My Website</h1>
        </header>
        <section class="hero">
            <h2>Your Success Starts Here</h2>
            <p>Professional solutions for modern businesses</p>
        </section>
        <section class="features">
            <div class="feature">
                <h3>Feature One</h3>
                <p>Amazing functionality that helps your business grow</p>
            </div>
            <div class="feature">
                <h3>Feature Two</h3>
                <p>Innovative solutions for your everyday needs</p>
            </div>
            <div class="feature">
                <h3>Feature Three</h3>
                <p>Expert support when you need it most</p>
            </div>
        </section>
    </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToaster('success', 'Website Downloaded', 'Website files have been downloaded successfully!');
  };

  const handleConnectIntegration = async (integrationName: string) => {
    const newIntegrations = integrations.map(integration => 
      integration.name === integrationName 
        ? { ...integration, connected: true }
        : integration
    );
    updateIntegrations(newIntegrations);
    showToaster('success', 'Integration Connected', `${integrationName} has been connected successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Export & Deployment
        </h1>
        <p className="text-muted-foreground">
          Publish your website to the world
        </p>
      </div>

      {/* Deployment Status */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Deployment Status
          </h2>
          {deployStatus === 'success' && (
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Live</span>
            </div>
          )}
          {deployStatus === 'deploying' && (
            <div className="flex items-center gap-2 text-secondary">
              <Clock className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Deploying...</span>
            </div>
          )}
        </div>

        {deployStatus === 'success' ? (
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <p className="font-medium text-foreground">Deployment Successful!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your website is now live at:{' '}
              <a href="#" className="text-secondary hover:underline">
                {subdomain}.candlelight.app
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 rounded-lg bg-background border border-border">
              <p className="text-sm text-muted-foreground mb-1">Last Deploy</p>
              <p className="text-2xl font-heading font-bold text-foreground">2 hours ago</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-border">
              <p className="text-sm text-muted-foreground mb-1">Build Time</p>
              <p className="text-2xl font-heading font-bold text-foreground">45s</p>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          className="w-full gap-2"
          onClick={handleDeploy}
          disabled={deployStatus === 'deploying'}
        >
          {deployStatus === 'deploying' ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Deploy Now
            </>
          )}
        </Button>
      </Card>

      {/* Publish to Subdomain */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Publish to Subdomain
        </h2>
        <div className="flex gap-3">
          <Input
            placeholder="mysite"
            value={subdomain}
            onChange={(e) => updateSubdomain(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center px-4 rounded-lg bg-background border border-input text-muted-foreground">
            .candlelight.app
          </div>
        </div>
        <Button 
          variant="primary" 
          className="mt-3"
          onClick={handlePublishSubdomain}
          disabled={!subdomain.trim() || subdomainStatus === 'publishing'}
        >
          {subdomainStatus === 'publishing' ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Publishing...
            </>
          ) : (
            'Publish to Subdomain'
          )}
        </Button>
        
        {subdomainStatus === 'published' && (
          <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <p className="font-medium text-foreground">Published Successfully!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your site is now live at:{' '}
              <a href={`https://${subdomain}.candlelight.app`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                {subdomain}.candlelight.app
              </a>
            </p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Your site will be available at {subdomain || 'yoursite'}.candlelight.app
        </p>
      </Card>

      {/* Custom Domain */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Connect Custom Domain
        </h2>
        <Input
          placeholder="www.yourdomain.com"
          value={customDomain}
          onChange={(e) => updateCustomDomain(e.target.value)}
        />
        <Button 
          variant="outline" 
          className="mt-3"
          onClick={handleConnectDomain}
          disabled={!customDomain.trim() || domainStatus === 'connecting'}
        >
          {domainStatus === 'connecting' ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            'Connect Domain'
          )}
        </Button>
        
        {domainStatus === 'connected' && (
          <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <p className="font-medium text-foreground">Domain Connected!</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Please add these DNS records to your domain:
            </p>
            <div className="bg-background rounded p-3 font-mono text-xs">
              <div className="mb-1">Type: CNAME</div>
              <div className="mb-1">Name: www</div>
              <div>Value: {customDomain}.candlelight.app</div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-3">
          Add your custom domain and we'll provide DNS configuration instructions.
        </p>
      </Card>

      {/* Export Options */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Export Website
        </h2>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={handleDownloadWebsite}
          >
            <Download className="w-4 h-4" />
            Download HTML/CSS/JS
          </Button>
          <p className="text-xs text-muted-foreground">
            Export your website as static files to host anywhere
          </p>
        </div>
      </Card>

      {/* Integrations */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Deployment Integrations
        </h2>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
            >
              <div className="flex items-center gap-3">
                <integration.icon className={`w-6 h-6 ${integration.color}`} />
                <span className="font-medium text-foreground">{integration.name}</span>
              </div>
              {integration.connected ? (
                <span className="text-xs text-secondary flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConnectIntegration(integration.name)}
                >
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
