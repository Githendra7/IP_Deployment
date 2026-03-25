import { Plus, Code, Database, TestTube, GitBranch } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const developmentTasks = [
  {
    id: 1,
    title: 'Frontend Setup',
    description: 'Initialize React app with routing and state management',
    type: 'frontend',
    status: 'completed',
    assignee: 'Tom Wilson',
    dueDate: 'Mar 20, 2026',
    commits: 45,
  },
  {
    id: 2,
    title: 'Backend API',
    description: 'Build RESTful API endpoints and authentication',
    type: 'backend',
    status: 'in-progress',
    assignee: 'Rachel Kim',
    dueDate: 'Mar 25, 2026',
    commits: 32,
  },
  {
    id: 3,
    title: 'Database Schema',
    description: 'Design and implement database models and migrations',
    type: 'database',
    status: 'completed',
    assignee: 'Kevin Brown',
    dueDate: 'Mar 22, 2026',
    commits: 18,
  },
  {
    id: 4,
    title: 'Component Library',
    description: 'Develop reusable UI components from design system',
    type: 'frontend',
    status: 'in-progress',
    assignee: 'Sophie Martin',
    dueDate: 'Mar 28, 2026',
    commits: 28,
  },
  {
    id: 5,
    title: 'Integration Testing',
    description: 'Write end-to-end tests for critical user flows',
    type: 'testing',
    status: 'pending',
    assignee: 'Daniel Rodriguez',
    dueDate: 'Apr 2, 2026',
    commits: 0,
  },
  {
    id: 6,
    title: 'API Documentation',
    description: 'Document all API endpoints and usage examples',
    type: 'backend',
    status: 'in-progress',
    assignee: 'Emma Taylor',
    dueDate: 'Mar 30, 2026',
    commits: 12,
  },
];

const typeConfig = {
  frontend: { icon: Code, label: 'Frontend', color: 'bg-primary/10' },
  backend: { icon: Database, label: 'Backend', color: 'bg-primary/10' },
  database: { icon: Database, label: 'Database', color: 'bg-primary/10' },
  testing: { icon: TestTube, label: 'Testing', color: 'bg-primary/10' },
};

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  pending: 'Pending',
};

export default function Phase3() {
  const completedTasks = developmentTasks.filter(t => t.status === 'completed').length;
  const progress = (completedTasks / developmentTasks.length) * 100;
  const totalCommits = developmentTasks.reduce((sum, task) => sum + task.commits, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Phase 3: Development</h1>
            <p className="text-muted-foreground">
              Build frontend, backend, and integrate all components
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Phase Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {developmentTasks.length} tasks completed
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
            <CardTitle className="text-sm text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{developmentTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {developmentTasks.filter(t => t.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalCommits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Development Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Development Tasks</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>{totalCommits} commits</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {developmentTasks.map((task) => {
              const TypeIcon = typeConfig[task.type as keyof typeof typeConfig].icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className={`mt-1 p-3 rounded-lg ${typeConfig[task.type as keyof typeof typeConfig].color}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {typeConfig[task.type as keyof typeof typeConfig].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'secondary' : 'default'}>
                        {statusLabels[task.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.dueDate}</span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {task.commits} commits
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
