import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Send, Sparkles, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('candlelight_assistant_messages');
    return saved ? JSON.parse(saved).map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })) : [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can help you with copywriting, SEO optimization, content creation, and more. How can I assist you today?',
        timestamp: new Date()
      }
    ];
  });

  // Save to localStorage whenever messages change
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem('candlelight_assistant_messages', JSON.stringify(newMessages));
  };
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return `Hi there! 👋 Great to see you!\n\nI'm your AI assistant, ready to help you with:\n\n✨ Content creation & copywriting\n🎯 Marketing campaigns\n📈 SEO optimization\n💡 Creative ideas\n\nWhat can I help you create today?`;
    }
    
    // Thank you responses
    if (input.includes('thank') || input.includes('thanks')) {
      return `You're very welcome! 😊\n\nI'm always here to help you create amazing content. Feel free to ask me anything about:\n\n📝 Writing & copywriting\n🚀 Marketing strategies\n💼 Business content\n🎨 Creative ideas\n\nWhat else can I assist you with?`;
    }
    
    
    // Homepage/Landing page content
    if (input.includes('homepage') || input.includes('headline') || input.includes('hero')) {
      return `Here are 3 compelling homepage headlines for you:\n\n1. "Transform Your Business with AI-Powered Solutions"\n2. "Where Innovation Meets Excellence - Your Success Starts Here"\n3. "Unlock Your Potential with Our Expert Solutions"\n\nEach headline focuses on transformation, value, and customer benefit. Would you like me to create variations or help with the supporting copy?`;
    }
    
    // SEO content
    if (input.includes('seo') || input.includes('meta') || input.includes('description')) {
      return `Here's an SEO-optimized meta description:\n\n"Boost your business with our innovative solutions. Expert services, proven results, and 24/7 support. Get started today and see the difference quality makes."\n\n✅ 155 characters (optimal length)\n✅ Includes action words\n✅ Clear value proposition\n✅ Call-to-action\n\nWant me to create variations for different pages?`;
    }
    
    // Product features
    if (input.includes('product') || input.includes('feature') || input.includes('benefit')) {
      return `Here are compelling product features:\n\n🚀 **Lightning Fast Performance** - 3x faster than competitors\n🔒 **Enterprise Security** - Bank-level encryption & compliance\n📱 **Mobile Optimized** - Perfect experience on any device\n🎯 **Smart Analytics** - Real-time insights & reporting\n⚡ **Easy Integration** - Setup in under 5 minutes\n\nEach feature highlights a specific benefit. Need help expanding on any of these?`;
    }
    
    // Email marketing
    if (input.includes('email') || input.includes('subject') || input.includes('newsletter')) {
      return `Here are high-converting email subject lines:\n\n📧 "Your exclusive 50% discount expires tonight"\n📧 "[Name], this changes everything..."\n📧 "The secret successful businesses don't want you to know"\n📧 "Quick question about your goals"\n📧 "You're missing out on this opportunity"\n\nThese use urgency, personalization, and curiosity. Want me to create more for your specific campaign?`;
    }
    
    // Content creation
    if (input.includes('content') || input.includes('blog') || input.includes('article')) {
      return `Content creation strategy:\n\n📝 **Blog Topics:**\n• "10 Ways to Boost Your Productivity Today"\n• "The Ultimate Guide to [Your Industry] Success"\n• "Common Mistakes That Cost You Money"\n\n🎯 **Content Pillars:**\n• Educational (60%) - How-to guides, tutorials\n• Inspirational (25%) - Success stories, tips\n• Promotional (15%) - Product features, offers\n\nWhat type of content would you like me to help create?`;
    }
    
    // Social media
    if (input.includes('social') || input.includes('post') || input.includes('caption')) {
      return `Social media content ideas:\n\n📱 **Engagement Posts:**\n• "What's your biggest challenge in [industry]? Comment below!"\n• "Before vs After: See the transformation"\n• "Quick tip: [Share valuable insight]"\n\n🔥 **Trending Formats:**\n• Carousel posts (10x more engagement)\n• Behind-the-scenes content\n• User-generated content\n• Polls and questions\n\nWhich platform are you focusing on?`;
    }
    
    // Copywriting
    if (input.includes('copy') || input.includes('sales') || input.includes('convert')) {
      return `High-converting copywriting framework:\n\n🎯 **AIDA Formula:**\n• **Attention:** Bold headline that stops scrolling\n• **Interest:** Share relatable problem/benefit\n• **Desire:** Paint picture of success\n• **Action:** Clear, compelling CTA\n\n💡 **Power Words:** Exclusive, Proven, Guaranteed, Limited, Free, Instant, Secret\n\n📈 **CTA Examples:**\n• "Get Your Free Analysis Now"\n• "Start Your Transformation Today"\n• "Claim Your Spot (Limited Time)"\n\nWhat specific copy do you need help with?`;
    }
    
    // Default response for other queries
    return `I'd be happy to help you with that! Here's what I can assist you with:\n\n✨ **Content Creation:**\n• Website copy & headlines\n• Blog posts & articles\n• Social media content\n\n🎯 **Marketing:**\n• Email campaigns\n• Sales copy\n• Product descriptions\n\n📈 **SEO & Optimization:**\n• Meta descriptions\n• Keyword research\n• Content optimization\n\nCould you be more specific about what you need? For example:\n• "Write a homepage headline for a tech startup"\n• "Create an email subject line for a sale"\n• "Generate product features for an app"`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const newMessagesWithUser = [...messages, userMessage];
    updateMessages(newMessagesWithUser);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(currentInput),
      timestamp: new Date()
    };

    updateMessages([...newMessagesWithUser, aiResponse]);
    setIsTyping(false);
  };

  const quickPrompts = [
    'Write a compelling homepage headline',
    'Generate SEO meta description',
    'Create product feature list',
    'Write email subject lines'
  ];

  return (
    <div className="space-y-6 animate-fade-up w-full max-w-none">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
          AI Assistant
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Your intelligent copilot for content creation and optimization
        </p>
      </div>

      <Card glass className="h-[500px] sm:h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 sm:px-6 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary/20 text-foreground hover:bg-secondary/30 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 sm:p-6 border-t border-border">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="gap-1 sm:gap-2 px-3 sm:px-4"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Send</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
