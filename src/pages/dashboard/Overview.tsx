import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TrendingUp, Users, Eye, Clock, Plus, Sparkles } from 'lucide-react';
import { demoProjects, demoAnalytics } from '@/data/demoData';

export default function Overview() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVisitors: 0,
    pageViews: 0,
    avgSession: 0
  });

  useEffect(() => {
    // Animate numbers on load
    const timer = setTimeout(() => {
      setStats({
        totalProjects: demoProjects.length,
        totalVisitors: demoAnalytics.uniqueVisitors,
        pageViews: demoAnalytics.pageViews,
        avgSession: 204
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const aiSuggestions = [
    'Add a blog section to increase SEO rankings',
    'Create a pricing page for better conversion',
    'Optimize images for faster loading times',
    'Add customer testimonials to build trust'
  ];

  const recentActivities = [
    { action: 'Published', target: 'TechCorp Landing Page', time: '2 hours ago', user: 'You' },
    { action: 'Commented on', target: 'E-Commerce Store', time: '5 hours ago', user: 'Sarah Johnson' },
    { action: 'Created', target: 'Portfolio Website', time: '1 day ago', user: 'You' },
    { action: 'Updated', target: 'Restaurant Menu', time: '2 days ago', user: 'Michael Chen' }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass className="hover:glow-neon animate-bounce-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
              <h3 className="text-3xl font-heading font-bold text-foreground">
                {stats.totalProjects}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs text-secondary mt-2">+2 this month</p>
        </Card>

        <Card glass className="hover:glow-neon animate-bounce-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Visitors</p>
              <h3 className="text-3xl font-heading font-bold text-foreground">
                {stats.totalVisitors.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>
          <p className="text-xs text-secondary mt-2">+12% from last week</p>
        </Card>

        <Card glass className="hover:glow-neon animate-bounce-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Page Views</p>
              <h3 className="text-3xl font-heading font-bold text-foreground">
                {stats.pageViews.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Eye className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <p className="text-xs text-secondary mt-2">+8% increase</p>
        </Card>

        <Card glass className="hover:glow-neon animate-bounce-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg. Session</p>
              <h3 className="text-3xl font-heading font-bold text-foreground">
                {stats.avgSession}s
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-secondary mt-2">+15% from last month</p>
        </Card>
      </div>

      {/* AI Suggestions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Suggestions */}
        <Card glass>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-heading font-bold text-foreground">
              AI Suggestions
            </h2>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-secondary-foreground">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card glass>
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
