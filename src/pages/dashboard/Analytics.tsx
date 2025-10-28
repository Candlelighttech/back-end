import { Card } from '@/components/Card';
import { TrendingUp, TrendingDown, Users, Eye, Clock, Target } from 'lucide-react';
import { demoAnalytics } from '@/data/demoData';

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
          SEO & Analytics
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your website performance and SEO metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Visits</p>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
            {demoAnalytics.totalVisits.toLocaleString()}
          </h3>
          <p className="text-xs text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12.5% from last month
          </p>
        </Card>

        <Card glass>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
            <Eye className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
            {demoAnalytics.uniqueVisitors.toLocaleString()}
          </h3>
          <p className="text-xs text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +8.3% from last month
          </p>
        </Card>

        <Card glass>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg. Session</p>
            <Clock className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
            {demoAnalytics.avgSessionDuration}
          </h3>
          <p className="text-xs text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +5.2% from last month
          </p>
        </Card>

        <Card glass>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Bounce Rate</p>
            <Target className="w-4 h-4 text-destructive" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
            {demoAnalytics.bounceRate}
          </h3>
          <p className="text-xs text-destructive flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            -3.1% from last month
          </p>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card glass>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          Traffic Overview
        </h2>
        <div className="h-64 flex items-end justify-between gap-2 bg-muted/20 rounded-lg p-4">
          {demoAnalytics.trafficData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-secondary rounded-t hover:bg-secondary/80 transition-colors cursor-pointer"
                style={{
                  height: `${Math.max((day.visits / 2500) * 180, 30)}px`
                }}
                title={`${day.visits} visits`}
              />
              <p className="text-xs text-muted-foreground">{day.date.split(' ')[1]}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Pages & SEO Score */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card glass>
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Top Pages
          </h2>
          <div className="space-y-3">
            {demoAnalytics.topPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{page.page}</p>
                  <p className="text-xs text-muted-foreground">
                    {page.views.toLocaleString()} views
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    page.change.startsWith('+') ? 'text-secondary' : 'text-destructive'
                  }`}
                >
                  {page.change}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card glass>
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            SEO Health Score
          </h2>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-secondary/20 border-4 border-secondary">
              <span className="text-4xl font-heading font-bold text-foreground">87</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Good - Room for improvement</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Meta Tags</span>
              <span className="text-sm text-secondary font-medium">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Page Speed</span>
              <span className="text-sm text-secondary font-medium">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Mobile Friendly</span>
              <span className="text-sm text-secondary font-medium">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Content Quality</span>
              <span className="text-sm text-muted-foreground font-medium">Fair</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
