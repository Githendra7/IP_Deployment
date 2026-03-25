import { Outlet, NavLink, Link } from 'react-router';
import { ChevronRight, Plus, Home } from 'lucide-react';
import { Button } from './ui/button';

const phases = [
  { number: 1, name: 'Planning', path: '/phases/phase-1' },
  { number: 2, name: 'Design', path: '/phases/phase-2' },
  { number: 3, name: 'Development', path: '/phases/phase-3' },
  { number: 4, name: 'Deployment', path: '/phases/phase-4' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="block">
            <h1 className="text-2xl font-semibold">ProtoStruc</h1>
            <p className="text-sm text-muted-foreground mt-1">Project Workflow</p>
          </Link>
        </div>

        {/* Phase Navigation */}
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">Phases</h2>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-2">
            {phases.map((phase) => (
              <NavLink
                key={phase.number}
                to={phase.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  }`
                }
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-current font-medium">
                    {phase.number}
                  </div>
                  <span className="font-medium">{phase.name}</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              JD
            </div>
            <div className="flex-1">
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-muted-foreground">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}