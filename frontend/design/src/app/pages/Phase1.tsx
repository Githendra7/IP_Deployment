import { Plus, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const tasks = [
  {
    id: 1,
    title: 'Define Project Scope',
    description: 'Outline the main objectives and deliverables',
    status: 'completed',
    priority: 'high',
    assignee: 'Sarah Johnson',
    dueDate: 'Feb 15, 2026',
  },
  {
    id: 2,
    title: 'Stakeholder Meetings',
    description: 'Schedule and conduct initial stakeholder interviews',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Mike Chen',
    dueDate: 'Feb 20, 2026',
  },
  {
    id: 3,
    title: 'Resource Allocation',
    description: 'Identify team members and assign initial roles',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Emily Davis',
    dueDate: 'Feb 25, 2026',
  },
  {
    id: 4,
    title: 'Budget Planning',
    description: 'Create detailed budget breakdown and timeline',
    status: 'pending',
    priority: 'high',
    assignee: 'David Park',
    dueDate: 'Feb 28, 2026',
  },
  {
    id: 5,
    title: 'Risk Assessment',
    description: 'Identify potential risks and mitigation strategies',
    status: 'pending',
    priority: 'medium',
    assignee: 'Lisa Wong',
    dueDate: 'Mar 2, 2026',
  },
];

const statusConfig = {
  completed: { icon: Check, label: 'Completed', color: 'bg-secondary' },
  'in-progress': { icon: Clock, label: 'In Progress', color: 'bg-primary' },
  pending: { icon: AlertCircle, label: 'Pending', color: 'bg-muted' },
};

const priorityConfig = {
  high: { label: 'High', variant: 'default' as const },
  medium: { label: 'Medium', variant: 'secondary' as const },
  low: { label: 'Low', variant: 'outline' as const },
};

export default function Phase1() {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Phase 1: Planning</h1>
            <p className="text-muted-foreground">
              Define project scope, objectives, and initial planning
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
                {completedTasks} of {tasks.length} tasks completed
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
            <div className="text-3xl font-semibold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-secondary-foreground">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {tasks.filter(t => t.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => {
              const StatusIcon = statusConfig[task.status as keyof typeof statusConfig].icon;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className={`mt-1 p-2 rounded-full ${statusConfig[task.status as keyof typeof statusConfig].color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      </div>
                      <Badge variant={priorityConfig[task.priority as keyof typeof priorityConfig].variant}>
                        {priorityConfig[task.priority as keyof typeof priorityConfig].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.dueDate}</span>
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
