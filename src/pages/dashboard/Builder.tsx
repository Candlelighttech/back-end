import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Wand2, Layout, Type, Image, Square, Eye, Code, Menu, X } from 'lucide-react';
import { useToaster } from '@/contexts/ToasterContext';

export default function Builder() {
  const [prompt, setPrompt] = useState('');
  const { showToaster } = useToaster();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(() => {
    const saved = localStorage.getItem('candlelight_generated_content');
    return saved ? JSON.parse(saved) : null;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [droppedComponents, setDroppedComponents] = useState<string[]>(() => {
    const saved = localStorage.getItem('candlelight_dropped_components');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCode, setShowCode] = useState(false);

  // Save to localStorage whenever data changes
  const updateGeneratedContent = (content: any) => {
    setGeneratedContent(content);
    localStorage.setItem('candlelight_generated_content', JSON.stringify(content));
  };

  const updateDroppedComponents = (components: string[]) => {
    setDroppedComponents(components);
    localStorage.setItem('candlelight_dropped_components', JSON.stringify(components));
  };

  const generateHTML = () => {
    if (!generatedContent && droppedComponents.length === 0) return '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedContent?.businessName || 'Your Website'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    ${generatedContent ? `
    <!-- Header -->
    <header class="bg-white border-b">
        <div class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    <span class="font-bold text-lg">${generatedContent.businessName}</span>
                </div>
                <nav class="hidden md:flex gap-6">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Services</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
                </nav>
            </div>
        </div>
    </header>
    
    <!-- Hero Section -->
    <section class="bg-blue-600 text-white py-16 text-center">
        <h1 class="text-4xl font-bold mb-4">${generatedContent.businessName}</h1>
        <p class="text-xl mb-8">${generatedContent.tagline}</p>
        <div class="space-x-4">
            <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">Get Started</button>
            <button class="border-2 border-white px-6 py-3 rounded-lg font-semibold">Learn More</button>
        </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 px-4">
        <div class="max-w-6xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-8">Our Services</h2>
            <div class="grid md:grid-cols-3 gap-8">
                ${generatedContent.features.map(feature => `
                <div class="bg-white p-6 rounded-xl border">
                    <div class="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4"></div>
                    <h3 class="font-semibold mb-2">${feature}</h3>
                    <p class="text-gray-600 text-sm">Professional solutions for your needs</p>
                </div>`).join('')}
            </div>
        </div>
    </section>` : ''}
    
    ${droppedComponents.map(comp => {
      if (comp === 'Header') return `
    <header class="bg-white border-b p-4">
        <div class="flex items-center justify-between">
            <span class="font-bold">Your Business</span>
            <nav class="flex gap-6">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
            </nav>
        </div>
    </header>`;
      if (comp === 'Text Block') return `
    <section class="p-8">
        <h2 class="text-3xl font-bold mb-4">Sample Heading</h2>
        <p class="text-gray-600">This is a sample text block with content that you can customize.</p>
    </section>`;
      if (comp === 'Image') return `
    <section class="p-8">
        <div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span class="text-gray-500">Your Image Here</span>
        </div>
    </section>`;
      if (comp === 'Button') return `
    <section class="p-8 text-center">
        <button class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold">Click Me</button>
    </section>`;
      return '';
    }).join('')}
</body>
</html>`;
  };

  const downloadCode = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent?.businessName || 'website'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToaster('success', 'Code Downloaded', 'Website code has been downloaded successfully!');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const promptLower = prompt.toLowerCase();
    const words = promptLower.split(' ');
    
    // Extract business name (skip action words)
    const skipWords = ['create', 'build', 'make', 'design', 'develop', 'a', 'an', 'the', 'for', 'website', 'site', 'page'];
    const filteredWords = words.filter(word => !skipWords.includes(word));
    let businessName = filteredWords.slice(0, 2).join(' ') || 'Your Business';
    
    let businessType = 'business';
    let features = ['Services', 'About', 'Contact'];
    let tagline = 'Professional business solutions';
    
    if (promptLower.includes('tech') || promptLower.includes('startup') || promptLower.includes('software')) {
      businessType = 'tech';
      features = ['AI Solutions', 'Analytics', 'Automation'];
      tagline = 'Innovative technology solutions';
    } else if (promptLower.includes('restaurant') || promptLower.includes('food') || promptLower.includes('cafe') || promptLower.includes('tea') || promptLower.includes('coffee')) {
      businessType = 'restaurant';
      features = ['Menu', 'Reservations', 'Catering'];
      tagline = 'Delicious culinary experience';
    } else if (promptLower.includes('portfolio') || promptLower.includes('personal') || promptLower.includes('designer')) {
      businessType = 'portfolio';
      features = ['Projects', 'About', 'Contact'];
      tagline = 'Creative professional portfolio';
    } else if (promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('ecommerce')) {
      businessType = 'ecommerce';
      features = ['Products', 'Cart', 'Checkout'];
      tagline = 'Premium shopping experience';
    }
    
    updateGeneratedContent({ businessName, businessType, features, tagline, originalPrompt: prompt });
    setIsGenerating(false);
    showToaster('success', 'Website Generated', 'Your website has been generated successfully!');
  };

  const components = [
    { name: 'Header', icon: Layout, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'Text Block', icon: Type, color: 'bg-green-500/20 text-green-400' },
    { name: 'Image', icon: Image, color: 'bg-purple-500/20 text-purple-400' },
    { name: 'Button', icon: Square, color: 'bg-orange-500/20 text-orange-400' }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          AI Website Builder
        </h1>
        <p className="text-muted-foreground">
          Describe your website and let AI create it for you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card glass>
            <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-secondary" />
              AI Prompt
            </h2>
            <div className="space-y-4">
              <textarea
                placeholder="Describe your website... e.g., 'Create a modern landing page for a tech startup with hero section, features, and contact form'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
              <Button
                variant="primary"
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card glass>
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Components
            </h2>
            <div className="space-y-2">
              {components.map((component) => (
                <div key={component.name}>
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-grab active:cursor-grabbing"
                    onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('component', component.name)}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center`}>
                      <component.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{component.name}</span>
                  </button>
                  
                  {selectedComponent === component.name && (
                    <div className="mt-2 p-3 bg-background rounded-lg border border-border animate-fade-in">
                      {component.name === 'Header' && (
                        <div className="space-y-2">
                          <div className="bg-card p-2 rounded border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-secondary rounded"></div>
                                <span className="text-xs font-heading">Logo</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="w-8 h-2 bg-muted rounded"></div>
                                <div className="w-8 h-2 bg-muted rounded"></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">Navigation header with logo and menu</p>
                        </div>
                      )}
                      
                      {component.name === 'Text Block' && (
                        <div className="space-y-2">
                          <div className="bg-card p-2 rounded border">
                            <div className="w-full h-2 bg-foreground rounded mb-1"></div>
                            <div className="w-3/4 h-1 bg-muted-foreground rounded mb-1"></div>
                            <div className="w-1/2 h-1 bg-muted-foreground rounded"></div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">Rich text content with headings and paragraphs</p>
                        </div>
                      )}
                      
                      {component.name === 'Image' && (
                        <div className="space-y-2">
                          <div className="bg-card p-2 rounded border">
                            <div className="w-full h-8 bg-secondary/20 rounded flex items-center justify-center">
                              <Image className="w-4 h-4 text-secondary" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">Responsive image with caption support</p>
                        </div>
                      )}
                      
                      {component.name === 'Button' && (
                        <div className="space-y-2">
                          <div className="bg-card p-2 rounded border">
                            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-xs font-semibold text-center">
                              Click Me
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">Interactive button with custom styling</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <Card glass className="h-[600px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <h2 className="text-xl font-heading font-bold text-foreground">
                Live Preview
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCode(!showCode)}
                  disabled={!generatedContent && droppedComponents.length === 0}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadCode}
                  disabled={!generatedContent && droppedComponents.length === 0}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div 
              className="h-[calc(100%-80px)] overflow-auto"
              onDrop={(e) => {
                e.preventDefault();
                const componentName = e.dataTransfer.getData('component');
                if (componentName) {
                  updateDroppedComponents([...droppedComponents, componentName]);
                  showToaster('success', 'Component Added', `${componentName} has been added to your website`);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {showCode ? (
                <div className="p-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-[500px]">
                    <pre>{generateHTML()}</pre>
                  </div>
                </div>
              ) : droppedComponents.length > 0 && !generatedContent ? (
                <div className="glass rounded-lg overflow-hidden">
                  {droppedComponents.map((comp, index) => (
                    <div key={index} className="relative group">
                      <button 
                        className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => updateDroppedComponents(droppedComponents.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {comp === 'Header' && (
                        <div className="bg-card border-b border-border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-secondary-foreground rounded-full"></div>
                              </div>
                              <span className="font-heading font-bold text-foreground">Your Business</span>
                            </div>
                            <nav className="flex items-center gap-6">
                              <a className="text-muted-foreground hover:text-foreground font-sans text-sm">Home</a>
                              <a className="text-muted-foreground hover:text-foreground font-sans text-sm">About</a>
                              <a className="text-muted-foreground hover:text-foreground font-sans text-sm">Contact</a>
                            </nav>
                          </div>
                        </div>
                      )}
                      {comp === 'Text Block' && (
                        <div className="p-8 bg-card">
                          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Sample Heading</h2>
                          <p className="text-muted-foreground font-sans">This is a sample text block with content that you can customize.</p>
                        </div>
                      )}
                      {comp === 'Image' && (
                        <div className="p-8 bg-background">
                          <div className="w-full h-64 bg-secondary/20 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Image className="w-16 h-16 text-secondary mx-auto mb-4" />
                              <span className="text-lg font-heading text-foreground">Your Image Here</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {comp === 'Button' && (
                        <div className="p-8 bg-muted text-center">
                          <div className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-heading font-semibold inline-block cursor-pointer hover:bg-secondary/90 transition-colors">
                            Click Me
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : generatedContent ? (
                <div className="glass rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-card border-b border-border p-4">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-secondary-foreground rounded-full"></div>
                        </div>
                        <span className="font-heading font-bold text-foreground">{generatedContent.businessName}</span>
                      </div>
                      
                      {/* Desktop Navigation */}
                      <nav className="hidden md:flex items-center gap-6">
                        <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer">Home</a>
                        <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer">About</a>
                        <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer">Services</a>
                        <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer">Contact</a>
                      </nav>
                      
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:block bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-sans text-sm font-semibold cursor-pointer">
                          Get Quote
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button 
                          className="md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                      <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
                        <nav className="flex flex-col gap-3">
                          <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer py-2">Home</a>
                          <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer py-2">About</a>
                          <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer py-2">Services</a>
                          <a className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors cursor-pointer py-2">Contact</a>
                          <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-sans text-sm font-semibold cursor-pointer text-center mt-2">
                            Get Quote
                          </div>
                        </nav>
                      </div>
                    )}
                  </div>

                  {/* Hero Section */}
                  <div className="bg-primary p-6 sm:p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
                    <div className="relative z-10">
                      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4 capitalize">
                        {generatedContent.businessName}
                      </h1>
                      <p className="text-lg sm:text-xl text-primary-foreground/80 mb-6 font-sans max-w-2xl mx-auto">
                        {generatedContent.tagline}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-heading font-semibold hover:bg-secondary/90 transition-colors cursor-pointer">
                          Get Started
                        </div>
                        <div className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-heading font-semibold hover:bg-primary-foreground/10 transition-colors cursor-pointer">
                          Learn More
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="p-6 sm:p-8 bg-card">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                        {generatedContent.businessType === 'restaurant' ? 'What We Offer' : 
                         generatedContent.businessType === 'portfolio' ? 'What I Do' :
                         generatedContent.businessType === 'ecommerce' ? 'Shop Categories' : 'Our Services'}
                      </h2>
                      <p className="text-muted-foreground font-sans max-w-xl mx-auto text-sm sm:text-base">
                        Discover our comprehensive range of professional solutions tailored to your needs
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {generatedContent.features.map((feature, index) => (
                        <div key={index} className="bg-background p-4 sm:p-6 rounded-xl border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300 group">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/20 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-lg"></div>
                          </div>
                          <h3 className="font-heading font-semibold text-foreground text-center mb-2 text-sm sm:text-base">{feature}</h3>
                          <p className="text-muted-foreground text-xs sm:text-sm text-center font-sans">
                            {generatedContent.businessType === 'tech' && 'Advanced solutions for modern businesses'}
                            {generatedContent.businessType === 'restaurant' && 'Fresh quality ingredients and exceptional service'}
                            {generatedContent.businessType === 'portfolio' && 'Creative and professional design services'}
                            {generatedContent.businessType === 'ecommerce' && 'Curated selection of premium products'}
                            {generatedContent.businessType === 'business' && 'Professional expertise you can trust'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="p-8 bg-background">
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                            About {generatedContent.businessName}
                          </h2>
                          <p className="text-muted-foreground font-sans mb-6">
                            We are dedicated to providing exceptional {generatedContent.businessType} solutions that exceed expectations. 
                            Our commitment to quality and innovation sets us apart in the industry.
                          </p>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-heading font-bold text-secondary">5+</div>
                              <div className="text-sm text-muted-foreground font-sans">Years Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-heading font-bold text-secondary">100+</div>
                              <div className="text-sm text-muted-foreground font-sans">Happy Clients</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-heading font-bold text-secondary">24/7</div>
                              <div className="text-sm text-muted-foreground font-sans">Support</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-secondary/10 rounded-xl p-8 text-center">
                          <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-secondary rounded-full"></div>
                          </div>
                          <h3 className="font-heading font-semibold text-foreground mb-2">Why Choose Us?</h3>
                          <p className="text-muted-foreground text-sm font-sans">
                            Professional excellence, innovative solutions, and customer satisfaction guaranteed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="p-8 bg-muted">
                    <div className="text-center">
                      <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                        Get In Touch
                      </h2>
                      <p className="text-muted-foreground font-sans mb-6 max-w-xl mx-auto">
                        Ready to get started? Contact us today and let's discuss how we can help you achieve your goals.
                      </p>
                      <div className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg inline-block font-heading font-semibold hover:bg-secondary/90 transition-colors cursor-pointer">
                        Contact Us
                      </div>
                    </div>
                  </div>



                  {/* Dropped Components in Generated Content */}
                  {generatedContent && droppedComponents.length > 0 && (
                    <div className="p-6 bg-muted border-t border-border">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-4">Added Components</h3>
                      <div className="space-y-4">
                        {droppedComponents.map((comp, index) => (
                          <div key={index} className="bg-background p-4 rounded-lg border border-border">
                            {comp === 'Header' && (
                              <div className="bg-card p-3 rounded border">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-secondary rounded"></div>
                                    <span className="text-sm font-heading">Your Logo</span>
                                  </div>
                                  <div className="flex gap-4">
                                    <span className="text-xs text-muted-foreground">Home</span>
                                    <span className="text-xs text-muted-foreground">About</span>
                                    <span className="text-xs text-muted-foreground">Contact</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {comp === 'Text Block' && (
                              <div className="bg-card p-3 rounded border">
                                <h3 className="font-heading font-bold text-foreground mb-2">Sample Heading</h3>
                                <p className="text-muted-foreground text-sm font-sans">This is a sample text block with content that you can customize.</p>
                              </div>
                            )}
                            {comp === 'Image' && (
                              <div className="bg-card p-3 rounded border">
                                <div className="w-full h-24 bg-secondary/20 rounded flex items-center justify-center">
                                  <Image className="w-8 h-8 text-secondary" />
                                  <span className="ml-2 text-sm text-muted-foreground">Sample Image</span>
                                </div>
                              </div>
                            )}
                            {comp === 'Button' && (
                              <div className="bg-card p-3 rounded border text-center">
                                <div className="bg-secondary text-secondary-foreground px-6 py-2 rounded font-semibold inline-block cursor-pointer hover:bg-secondary/90 transition-colors">
                                  Sample Button
                                </div>
                              </div>
                            )}
                            <button 
                              className="mt-2 text-xs text-destructive hover:text-destructive/80 transition-colors"
                              onClick={() => updateDroppedComponents(droppedComponents.filter((_, i) => i !== index))}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="bg-primary p-8">
                    <div className="max-w-6xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-secondary-foreground rounded-full"></div>
                            </div>
                            <span className="font-heading font-bold text-primary-foreground">{generatedContent.businessName}</span>
                          </div>
                          <p className="text-primary-foreground/70 text-sm font-sans">
                            {generatedContent.tagline}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-primary-foreground mb-3">Services</h4>
                          {generatedContent.features.map((feature, index) => (
                            <div key={index} className="text-primary-foreground/70 text-sm font-sans mb-2 cursor-pointer hover:text-primary-foreground transition-colors">
                              {feature}
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-primary-foreground mb-3">Company</h4>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2 cursor-pointer hover:text-primary-foreground transition-colors">About Us</div>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2 cursor-pointer hover:text-primary-foreground transition-colors">Careers</div>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2 cursor-pointer hover:text-primary-foreground transition-colors">Privacy Policy</div>
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-primary-foreground mb-3">Contact</h4>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2">info@{generatedContent.businessName.toLowerCase().replace(' ', '')}.com</div>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2">+1 (555) 123-4567</div>
                          <div className="text-primary-foreground/70 text-sm font-sans mb-2">123 Business St, City</div>
                        </div>
                      </div>
                      <div className="border-t border-primary-foreground/20 pt-4 text-center">
                        <p className="text-primary-foreground/60 text-xs font-sans">
                          © 2024 {generatedContent.businessName}. All rights reserved. | Generated from: "{generatedContent.originalPrompt}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center border-2 border-dashed border-border rounded-lg">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                      <Layout className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-2">
                      Enter a prompt to generate your website
                    </p>
                    <p className="text-muted-foreground text-sm">
                      or drag components here to build manually
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
