import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CEOProfile {
  id: number;
  name: string;
  title: string;
  tenure: number;
  religion: string;
  strategy: string;
  leadership: string;
  photoUrl: string;
  company?: {
    name: string;
    ticker: string;
  };
}

export default function CEOProfiles() {
  const { data: profiles = [], isLoading } = useQuery<CEOProfile[]>({
    queryKey: ["/api/ceo-profiles"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getReligionColor = (religion: string) => {
    return religion === "Christian" ? "primary" : "purple";
  };

  if (isLoading) {
    return (
      <Card className="gradient-card p-6 border-slate-700">
        <h2 className="text-lg font-semibold mb-6">Executive Profiles</h2>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg">
                <div className="w-16 h-16 bg-slate-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="gradient-card p-6 border-slate-700">
      <h2 className="text-lg font-semibold mb-6">Executive Profiles</h2>
      
      <div className="space-y-6">
        {profiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No executive profiles available</p>
            <p className="text-xs mt-1">CEO profile data will appear here</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile.id} className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg">
              <img 
                src={profile.photoUrl} 
                alt={`${profile.name} profile`}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-slate-100">{profile.name}</h3>
                  <Badge 
                    variant={profile.religion === "Christian" ? "default" : "secondary"}
                    className={`text-xs ${
                      profile.religion === "Christian" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-purple/20 text-purple"
                    }`}
                  >
                    {profile.religion}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mb-1">{profile.title}</p>
                {profile.company && (
                  <p className="text-sm text-slate-300 mb-1">{profile.company.name}</p>
                )}
                <p className="text-xs text-slate-400 mb-3">
                  Tenure: {profile.tenure} years
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Strategy:</span>
                    <p className="text-slate-300">{profile.strategy}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Leadership:</span>
                    <p className="text-slate-300">{profile.leadership}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
