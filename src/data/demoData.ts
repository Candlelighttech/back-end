export const demoProjects = [
  {
    id: '1',
    title: 'TechCorp Landing Page',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    lastEdited: '2 hours ago',
    status: 'Published',
    url: 'techcorp.candlelight.app'
  },

  {
    id: '3',
    title: 'Portfolio Website',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    lastEdited: '3 days ago',
    status: 'Published',
    url: 'portfolio.candlelight.app'
  },

];

export const demoBlogPosts = [
  {
    id: '1',
    title: '10 AI Tools Every Developer Should Know in 2024',
    excerpt: 'Discover the most powerful AI tools that are transforming how developers work...',
    status: 'Published',
    publishDate: '2024-01-15',
    views: 1254,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Building a Modern Website: Best Practices Guide',
    excerpt: 'Learn the essential principles of creating responsive, accessible websites...',
    status: 'Draft',
    publishDate: null,
    views: 0,
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&h=300&fit=crop'
  }
];

export const demoTeamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    joinedDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'Editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    joinedDate: '2023-08-22'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'Viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    joinedDate: '2023-11-10'
  }
];

export const demoAnalytics = {
  totalVisits: 45678,
  uniqueVisitors: 32154,
  pageViews: 89234,
  avgSessionDuration: '3m 24s',
  bounceRate: '42.3%',
  topPages: [
    { page: '/home', views: 12456, change: '+12%' },
    { page: '/products', views: 8932, change: '+8%' },
    { page: '/about', views: 6543, change: '-3%' },
    { page: '/contact', views: 4321, change: '+15%' }
  ],
  trafficData: [
    { date: 'Jan 10', visits: 1200 },
    { date: 'Jan 11', visits: 1450 },
    { date: 'Jan 12', visits: 1350 },
    { date: 'Jan 13', visits: 1680 },
    { date: 'Jan 14', visits: 1920 },
    { date: 'Jan 15', visits: 2100 },
    { date: 'Jan 16', visits: 1850 }
  ]
};

export const demoComments = [
  {
    id: '1',
    projectId: '1',
    author: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    comment: 'Love the new hero section design! The gradient looks amazing.',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    projectId: '1',
    author: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    comment: 'Should we add more CTA buttons on the pricing page?',
    timestamp: '5 hours ago'
  }
];
