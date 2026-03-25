import { Plus, FileText, Image, Palette, Layout } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const designItems = [
  {
    id: 1,
    title: 'Wireframes',
    description: 'Low-fidelity wireframes for all major screens',
    type: 'wireframe',
    status: 'completed',
    assignee: 'Alex Turner',
    dueDate: 'Mar 5, 2026',
    files: 12,
  },
  {
    id: 2,
    title: 'UI Mockups',
    description: 'High-fidelity mockups with brand colors and typography',
    type: 'mockup',
    status: 'in-progress',
    assignee: 'Maria Garcia',
    dueDate: 'Mar 10, 2026',
    files: 8,
  },
  {
    id: 3,
    title: 'Design System',
    description: 'Component library and style guide documentation',
    type: 'system',
    status: 'in-progress',
    assignee: 'James Lee',
    dueDate: 'Mar 12, 2026',
    files: 24,
  },
  {
    id: 4,
    title: 'User Flow Diagrams',
    description: 'Complete user journey and interaction flows',
    type: 'flow',
    status: 'pending',
    assignee: 'Nina Patel',
    dueDate: 'Mar 15, 2026',
    files: 0,
  },
  {
    id: 5,
    title: 'Prototype',
    description: 'Interactive prototype for user testing',
    type: 'prototype',
    status: 'pending',
    assignee: 'Chris Anderson',
    dueDate: 'Mar 18, 2026',
    files: 0,
  },
];

const typeConfig = {
  wireframe: { icon: Layout, color: 'text-foreground' },
  mockup: { icon: Image, color: 'text-foreground' },
  system: { icon: Palette, color: 'text-foreground' },
  flow: { icon: FileText, color: 'text-foreground' },
  prototype: { icon: FileText, color: 'text-foreground' },
};

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  pending: 'Pending',
};

export default function Phase2() {
  const completedItems = designItems.filter(t => t.status === 'completed').length;
  const progress = (completedItems / designItems.length) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Phase 2: Design</h1>
            <p className="text-muted-foreground">
              Create wireframes, mockups, and design systems
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Design Item
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Phase Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedItems} of {designItems.length} items completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{designItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{completedItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {designItems.filter(t => t.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {designItems.reduce((sum, item) => sum + item.files, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Items Grid */}
      <div className="grid grid-cols-2 gap-6">
        {designItems.map((item) => {
          const TypeIcon = typeConfig[item.type as keyof typeof typeConfig].icon;
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent">
                      <TypeIcon className={`h-6 w-6 ${typeConfig[item.type as keyof typeof typeConfig].color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={item.status === 'completed' ? 'secondary' : 'default'}>
                      {statusLabels[item.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignee</span>
                    <span className="font-medium">👤 {item.assignee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium">📅 {item.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Files</span>
                    <span className="font-medium">📁 {item.files} files</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
