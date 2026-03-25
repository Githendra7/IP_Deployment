import { Plus, Rocket, Server, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const deploymentTasks = [
  {
    id: 1,
    title: 'Production Environment',
    description: 'Set up production servers and configure infrastructure',
    type: 'infrastructure',
    status: 'completed',
    assignee: 'Michael Chen',
    dueDate: 'Apr 5, 2026',
    health: 100,
  },
  {
    id: 2,
    title: 'CI/CD Pipeline',
    description: 'Configure automated deployment pipeline',
    type: 'automation',
    status: 'completed',
    assignee: 'Sarah Johnson',
    dueDate: 'Apr 8, 2026',
    health: 100,
  },
  {
    id: 3,
    title: 'Security Audit',
    description: 'Perform security testing and vulnerability assessment',
    type: 'security',
    status: 'in-progress',
    assignee: 'David Miller',
    dueDate: 'Apr 10, 2026',
    health: 85,
  },
  {
    id: 4,
    title: 'Performance Testing',
    description: 'Load testing and optimization for production',
    type: 'testing',
    status: 'in-progress',
    assignee: 'Jessica Lee',
    dueDate: 'Apr 12, 2026',
    health: 78,
  },
  {
    id: 5,
    title: 'Monitoring Setup',
    description: 'Configure application monitoring and alerting',
    type: 'infrastructure',
    status: 'pending',
    assignee: 'Robert Taylor',
    dueDate: 'Apr 15, 2026',
    health: 0,
  },
  {
    id: 6,
    title: 'Launch Preparation',
    description: 'Final checklist and go-live preparations',
    type: 'launch',
    status: 'pending',
    assignee: 'Emily Davis',
    dueDate: 'Apr 18, 2026',
    health: 0,
  },
];

const typeConfig = {
  infrastructure: { icon: Server, label: 'Infrastructure' },
  automation: { icon: Rocket, label: 'Automation' },
  security: { icon: Shield, label: 'Security' },
  testing: { icon: CheckCircle2, label: 'Testing' },
  launch: { icon: Rocket, label: 'Launch' },
};

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  pending: 'Pending',
};

export default function Phase4() {
  const completedTasks = deploymentTasks.filter(t => t.status === 'completed').length;
  const progress = (completedTasks / deploymentTasks.length) * 100;
  const avgHealth = Math.round(
    deploymentTasks.reduce((sum, task) => sum + task.health, 0) / deploymentTasks.length
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Phase 4: Deployment</h1>
            <p className="text-muted-foreground">
              Deploy to production and ensure system reliability
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
                {completedTasks} of {deploymentTasks.length} tasks completed
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
            <div className="text-3xl font-semibold">{deploymentTasks.length}</div>
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
            <CardTitle className="text-sm text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{avgHealth}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Days to Launch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">16</div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentTasks.map((task) => {
              const TypeIcon = typeConfig[task.type as keyof typeof typeConfig].icon;
              return (
                <div
                  key={task.id}
                  className="p-5 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-1 p-3 rounded-lg bg-primary/10">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
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
                      </div>
                    </div>
                  </div>
                  
                  {/* Health Bar */}
                  {task.health > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Task Health</span>
                        <span className="font-medium">{task.health}%</span>
                      </div>
                      <Progress value={task.health} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Launch Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Launch Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5" />
                <span className="font-medium">Infrastructure</span>
              </div>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Security</span>
              </div>
              <Badge>In Review</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Testing</span>
              </div>
              <Badge>In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
