
import { useState } from "react";
import { MessageSquare, Kanban, Plus, Filter } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CleanNavigation } from "@/components/CleanNavigation";
import { TeamChat } from "@/components/TeamChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { title: "Chat", path: "", description: "Comunicação da equipe" },
  { title: "Tasks", path: "/tasks", description: "Gerenciamento de tarefas" },
];

const mockTasks = {
  todo: [
    { id: 1, title: "Atualizar estoque iPhone", assignee: "Ana Silva", priority: "high", dueDate: "Hoje" },
    { id: 2, title: "Responder cliente WhatsApp", assignee: "Carlos Lima", priority: "medium", dueDate: "Amanhã" },
  ],
  doing: [
    { id: 3, title: "Emitir NF pedidos pendentes", assignee: "Marina Costa", priority: "high", dueDate: "Hoje" },
  ],
  done: [
    { id: 4, title: "Conferir pedidos Mercado Livre", assignee: "João Santos", priority: "low", dueDate: "Ontem" },
    { id: 5, title: "Atualizar preços concorrência", assignee: "Ana Silva", priority: "medium", dueDate: "Ontem" },
  ]
};

function TaskBoard() {
  const columns = [
    { id: "todo", title: "A Fazer", tasks: mockTasks.todo, color: "border-red-200 bg-red-50/30" },
    { id: "doing", title: "Em Andamento", tasks: mockTasks.doing, color: "border-yellow-200 bg-yellow-50/30" },
    { id: "done", title: "Concluído", tasks: mockTasks.done, color: "border-green-200 bg-green-50/30" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quadro de Tarefas</h2>
          <p className="text-gray-600">Organize e acompanhe as atividades da equipe</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-gradient-to-r from-novura-primary to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`rounded-2xl border-2 border-dashed p-4 ${column.color}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 leading-tight">{task.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{task.assignee}</span>
                      <span>{task.dueDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <button className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm">
              + Adicionar tarefa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Equipe() {
  const [currentPath, setCurrentPath] = useState("");

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
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Equipe</h2>
            </div>
          </header>

          {/* Navigation */}
          <CleanNavigation items={navigationItems} basePath="/equipe" />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {currentPath === "/tasks" ? <TaskBoard /> : <TeamChat />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
