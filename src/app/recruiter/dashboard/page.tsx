"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { CalendarIcon, UsersIcon, ActivityIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recruiter/interviews`);
        const data = response.data.data;
        setInterviews(data);
        const total = data.length;
        const published = data.filter((i) => i.status === 'published').length;
        const draft = data.filter((i) => i.status === 'draft').length;
        setStats({ total, published, draft });
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">Interview Dashboard</h1>
          <Button onClick={() => router.push('/recruiter/interview/create')} className="gap-2 bg-primary hover:bg-primary/80">
            + Create Interview
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card">
            <CardContent className="flex items-center">
              <CalendarIcon className="text-primary w-6 h-6 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Interviews</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center">
              <UsersIcon className="text-primary w-6 h-6 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Published Interviews</h3>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="flex items-center">
              <ActivityIcon className="text-primary w-6 h-6 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Draft Interviews</h3>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">Recent Interviews</h2>
          {interviews.length === 0 ? (
            <div className="text-center text-muted-foreground">No interviews created yet. Click "Create Interview" to get started.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews.map((interview) => (
                <Card key={interview._id} className="shadow-md bg-background border">
                  <CardContent>
                    <h3 className="text-lg font-semibold text-white mb-2">{interview.title}</h3>
                    <p className="text-sm text-muted-foreground">Job Role: {interview.jobRole}</p>
                    <p className="text-sm text-muted-foreground">Status: {interview.status}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Button variant="link" onClick={() => router.push(`/recruiter/interview/${interview._id}`)} className="text-primary">
                        View Details
                      </Button>
                      <span className="text-sm text-muted-foreground">{new Date(interview.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
