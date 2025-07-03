import { useState } from "react";
import { MessageSquare, Kanban, Plus, Filter, Users, Trophy, Calendar, CheckSquare, Clock, User, Star, Target, BarChart3, Zap } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { TeamChat } from "@/components/TeamChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import new task management components
import { CreateTaskModal } from "@/components/equipe/CreateTaskModal";
import { TaskBoard } from "@/components/equipe/TaskBoard";
import { TaskBacklog } from "@/components/equipe/TaskBacklog";
import { TaskRoadmap } from "@/components/equipe/TaskRoadmap";
import { TaskViews } from "@/components/equipe/TaskViews";

const navigationItems = [
  { title: "Chat", path: "", description: "Comunicação da equipe" },
  { title: "Tasks", path: "/tasks", description: "Gerenciamento de tarefas" },
  { title: "Gamificação", path: "/gamificacao", description: "Desempenho da equipe" },
];

// Enhanced mock data for tasks with more detailed information
const initialTasks = [
  { 
    id: 1, 
    title: "Implementar API de pagamento", 
    assignee: "Ana Silva", 
    priority: "high", 
    dueDate: "2024-01-20", 
    type: "story", 
    storyPoints: 8, 
    status: "todo",
    sprint: "sprint-1",
    timeTracked: 120,
    labels: ["backend", "api"],
    dependencies: []
  },
  { 
    id: 2, 
    title: "Corrigir bug no checkout", 
    assignee: "Carlos Lima", 
    priority: "high", 
    dueDate: "2024-01-18", 
    type: "bug", 
    storyPoints: 3, 
    status: "doing",
    sprint: "sprint-1",
    timeTracked: 90,
    labels: ["frontend", "urgente"],
    dependencies: []
  },
  { 
    id: 3, 
    title: "Atualizar documentação", 
    assignee: "Marina Costa", 
    priority: "medium", 
    dueDate: "2024-01-25", 
    type: "task", 
    storyPoints: 2, 
    status: "todo",
    sprint: "sprint-1",
    timeTracked: 60,
    labels: ["docs"],
    dependencies: []
  },
  { 
    id: 4, 
    title: "Desenvolver dashboard analytics", 
    assignee: "João Santos", 
    priority: "high", 
    dueDate: "2024-01-22", 
    type: "epic", 
    storyPoints: 13, 
    status: "doing",
    sprint: "sprint-1",
    timeTracked: 300,
    labels: ["dashboard", "analytics"],
    dependencies: [1]
  },
  { 
    id: 5, 
    title: "Otimizar performance mobile", 
    assignee: "Ana Silva", 
    priority: "medium", 
    dueDate: "2024-01-24", 
    type: "story", 
    storyPoints: 5, 
    status: "todo",
    sprint: "sprint-2",
    timeTracked: 45,
    labels: ["mobile", "performance"],
    dependencies: []
  },
  { 
    id: 6, 
    title: "Setup CI/CD pipeline", 
    assignee: "Carlos Lima", 
    priority: "medium", 
    dueDate: "2024-01-15", 
    type: "task", 
    storyPoints: 8, 
    status: "done",
    sprint: "sprint-1",
    timeTracked: 480,
    labels: ["devops", "ci/cd"],
    dependencies: []
  },
  { 
    id: 7, 
    title: "Implementar autenticação", 
    assignee: "Marina Costa", 
    priority: "high", 
    dueDate: "2024-01-10", 
    type: "story", 
    storyPoints: 13, 
    status: "done",
    sprint: "sprint-1",
    timeTracked: 360,
    labels: ["auth", "security"],
    dependencies: []
  }
];

// Mock data for gamification
const teamMembers = [
  { 
    id: 1, 
    name: "Ana Silva", 
    role: "Desenvolvedora", 
    avatar: "/placeholder.svg",
    points: 2850,
    level: 12,
    badges: ["🏆", "⚡", "🎯"],
    activities: {
      tasksCompleted: 45,
      packagesShipped: 0,
      codeReviews: 23,
      bugs: 8
    }
  },
  { 
    id: 2, 
    name: "Carlos Lima", 
    role: "Logística", 
    avatar: "/placeholder.svg",
    points: 3200,
    level: 15,
    badges: ["📦", "🚀", "⭐"],
    activities: {
      tasksCompleted: 32,
      packagesShipped: 156,
      codeReviews: 0,
      bugs: 0
    }
  },
  { 
    id: 3, 
    name: "Marina Costa", 
    role: "Designer", 
    avatar: "/placeholder.svg",
    points: 2650,
    level: 11,
    badges: ["🎨", "✨", "💫"],
    activities: {
      tasksCompleted: 38,
      packagesShipped: 0,
      codeReviews: 15,
      bugs: 2
    }
  },
  { 
    id: 4, 
    name: "João Santos", 
    role: "Logística", 
    avatar: "/placeholder.svg",
    points: 2950,
    level: 13,
    badges: ["📦", "🎯", "⚡"],
    activities: {
      tasksCompleted: 28,
      packagesShipped: 203,
      codeReviews: 0,
      bugs: 0
    }
  }
];

function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentTab, setCurrentTab] = useState("board");

  const handleCreateTask = (newTask: any) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (taskId: number, updates: Partial<typeof initialTasks[0]>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleStartTimer = (taskId: number) => {
    console.log(`Timer iniciado para tarefa ${taskId}`);
    // Implementar lógica de timer
  };

  const handleStopTimer = (taskId: number) => {
    console.log(`Timer parado para tarefa ${taskId}`);
    // Implementar lógica de parar timer
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gerenciamento de Tarefas</h2>
          <p className="text-gray-600">Sistema completo de planejamento e acompanhamento de projetos</p>
        </div>
        <CreateTaskModal onCreateTask={handleCreateTask} />
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="backlog">Backlog & Sprints</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="views">Visualizações</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          <TaskBoard 
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
          />
        </TabsContent>

        <TabsContent value="backlog" className="space-y-6">
          <TaskBacklog 
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
          />
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <TaskRoadmap tasks={tasks} />
        </TabsContent>

        <TabsContent value="views" className="space-y-6">
          <TaskViews 
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Gamificacao() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Geral" },
    { id: "dev", name: "Desenvolvimento" },
    { id: "logistics", name: "Logística" },
    { id: "design", name: "Design" }
  ];

  const sortedMembers = teamMembers.sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gamificação da Equipe</h2>
          <p className="text-gray-600">Acompanhe o desempenho e engajamento da equipe</p>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedMembers.slice(0, 3).map((member, index) => (
          <Card key={member.id} className={`relative overflow-hidden ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-bold rounded-bl-lg">
                🏆 #1
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-novura-primary to-purple-600 rounded-full mx-auto flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <p className="text-2xl font-bold text-novura-primary">{member.points.toLocaleString()}</p>
                <p className="text-xs text-gray-600">pontos • Nível {member.level}</p>
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                {member.badges.map((badge, idx) => (
                  <span key={idx} className="text-lg">{badge}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-gray-900">{member.activities.tasksCompleted}</p>
                  <p className="text-gray-600">Tarefas</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.activities.packagesShipped}</p>
                  <p className="text-gray-600">Pacotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Ranking Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMembers.map((member, index) => (
              <div key={member.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-novura-primary to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{member.name}</h4>
                    <span className="text-sm text-gray-600">• {member.role}</span>
                    <div className="flex space-x-1">
                      {member.badges.slice(0, 2).map((badge, idx) => (
                        <span key={idx} className="text-sm">{badge}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                    <span>{member.activities.tasksCompleted} tarefas</span>
                    <span>{member.activities.packagesShipped} pacotes</span>
                    <span>Nível {member.level}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-novura-primary">{member.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">pontos</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">143</p>
            <p className="text-sm text-gray-600">Tarefas Concluídas</p>
            <p className="text-xs text-green-600 mt-1">+12% esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">359</p>
            <p className="text-sm text-gray-600">Pacotes Enviados</p>
            <p className="text-xs text-green-600 mt-1">+8% esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold">38</p>
            <p className="text-sm text-gray-600">Code Reviews</p>
            <p className="text-xs text-green-600 mt-1">+15% esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold">10</p>
            <p className="text-sm text-gray-600">Bugs Corrigidos</p>
            <p className="text-xs text-red-600 mt-1">-5% esta semana</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Equipe() {
  const [currentPath, setCurrentPath] = useState("");

  const renderContent = () => {
    switch (currentPath) {
      case "/tasks":
        return <TaskManagement />;
      case "/gamificacao":
        return <Gamificacao />;
      default:
        return <TeamChat />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/60 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-novura-primary to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Equipe</h2>
            </div>
          </header>

          {/* Navigation */}
          <CleanNavigation items={navigationItems} basePath="/equipe" />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
