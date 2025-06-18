
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, DollarSign, Briefcase, Plus, Filter, Building2, Laptop, TrendingUp } from 'lucide-react';

export default function Jobs() {
  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Africa',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      salary: '₦800K - ₦1.2M',
      posted: '2 days ago',
      description: 'Join our team to build the next generation of fintech solutions for Africa.',
      skills: ['React', 'Node.js', 'Python', 'AWS']
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      company: 'StartupHub Kenya',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KSh 150K - KSh 250K',
      posted: '1 week ago',
      description: 'Lead our digital marketing initiatives across East Africa.',
      skills: ['SEO', 'Social Media', 'Analytics', 'Content Marketing']
    },
    {
      id: 3,
      title: 'Financial Analyst',
      company: 'Investment Solutions',
      location: 'Cape Town, South Africa',
      type: 'Contract',
      salary: 'R25K - R35K',
      posted: '3 days ago',
      description: 'Analyze financial data and provide insights for investment decisions.',
      skills: ['Excel', 'Financial Modeling', 'Bloomberg', 'Python']
    },
    {
      id: 4,
      title: 'Mobile App Developer',
      company: 'MobileFirst Ghana',
      location: 'Accra, Ghana',
      type: 'Remote',
      salary: '$2K - $4K',
      posted: '5 days ago',
      description: 'Develop mobile applications for our growing user base.',
      skills: ['React Native', 'Flutter', 'iOS', 'Android']
    }
  ];

  const stats = [
    { label: 'Active Jobs', value: '2,847', icon: Briefcase },
    { label: 'Companies', value: '456', icon: Building2 },
    { label: 'Remote Jobs', value: '891', icon: Laptop },
    { label: 'New This Week', value: '127', icon: TrendingUp }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Board</h1>
            <p className="text-muted-foreground">Find opportunities across Africa</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for jobs, companies, or skills..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-muted-foreground mb-3">{job.company}</p>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <Button className="mb-2">Apply Now</Button>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.posted}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
