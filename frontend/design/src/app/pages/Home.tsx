import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, FileText, Settings, User, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';

const recentProjects = [
  { id: 1, name: 'A compact, automated indoor...', date: '2/18/2026' },
  { id: 2, name: 'Test Garden', date: '2/18/2026' },
  { id: 3, name: 'Test Garden', date: '2/17/2026' },
  { id: 4, name: 'Test Garden', date: '2/16/2026' },
  { id: 5, name: 'A compact, automated i...', date: '2/15/2026' },
  { id: 6, name: 'Test Garden', date: '2/14/2026' },
  { id: 7, name: 'Test Garden', date: '2/13/2026' },
  { id: 8, name: 'A modular, automated v...', date: '2/12/2026' },
  { id: 9, name: 'A modular, automated v...', date: '2/11/2026' },
];

export default function Home() {
  const navigate = useNavigate();
  const [productIdea, setProductIdea] = useState('');

  const handleSendMessage = () => {
    if (productIdea.trim()) {
      // Navigate to Phase 1
      navigate('/phases/phase-1');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-semibold">ProtoStruc</h1>
        </div>

        {/* New Project Button */}
        <div className="p-4 border-b border-border">
          <Button className="w-full gap-2" size="lg">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Recent Projects */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase mb-3 px-2">
            Recent Projects
          </h3>
          <div className="space-y-1">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.date}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold mb-4">
              What product would you like to develop today?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe your product idea in detail, and I'll guide you through a structured engineering
              workflow including functional decomposition, morphological analysis, and risk assessment.
            </p>
          </div>

          {/* Input Area */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <Textarea
                placeholder="Describe your product idea..."
                value={productIdea}
                onChange={(e) => setProductIdea(e.target.value)}
                className="min-h-[300px] resize-none text-base border-0 focus-visible:ring-0 p-4"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {productIdea.length} characters
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!productIdea.trim()}
                  size="lg"
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase mb-4">
              Recent Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 truncate">
                        A compact, automated indoor...
                      </h3>
                      <p className="text-sm text-muted-foreground">2/18/2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 truncate">Test Garden</h3>
                      <p className="text-sm text-muted-foreground">2/18/2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}