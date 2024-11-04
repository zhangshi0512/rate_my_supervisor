import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const supervisors = [
  { id: 1, name: "Dr. Jane Smith", organization: "Private Practice", specialties: ["Clinical Psychology"], experience: 10, rating: 4.8, reviewCount: 24 },
  { id: 2, name: "Dr. John Doe", organization: "Wellness Center", specialties: ["Counseling"], experience: 8, rating: 4.7, reviewCount: 18 },
  { id: 3, name: "Dr. Sarah Johnson", organization: "Community Health", specialties: ["Social Work"], experience: 12, rating: 4.9, reviewCount: 32 },
  { id: 4, name: "Dr. Michael Brown", organization: "City Hospital", specialties: ["Psychiatry"], experience: 15, rating: 4.6, reviewCount: 28 },
  { id: 5, name: "Dr. Emily Davis", organization: "Mental Health Center", specialties: ["Family Therapy"], experience: 9, rating: 4.5, reviewCount: 21 },
];

export default function SupervisorList() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Supervisors</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Practice</SelectItem>
                <SelectItem value="community">Community Mental Health</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinical">Clinical Psychology</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="social">Social Work</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {supervisors.map((supervisor) => (
          <Card key={supervisor.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-muted rounded-full" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{supervisor.name}</h3>
                  <div className="text-muted-foreground mb-2">{supervisor.organization}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{supervisor.specialties.join(", ")}</span>
                    <span>•</span>
                    <span>{supervisor.experience} years experience</span>
                    <span>•</span>
                    <span className="text-yellow-500">★ {supervisor.rating.toFixed(1)} ({supervisor.reviewCount} reviews)</span>
                  </div>
                  <p className="text-muted-foreground">
                    Experienced supervisor specializing in {supervisor.specialties[0].toLowerCase()} and evidence-based approaches...
                  </p>
                </div>
                <Link to={`/supervisors/${supervisor.id}`}>
                  <Button>View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}