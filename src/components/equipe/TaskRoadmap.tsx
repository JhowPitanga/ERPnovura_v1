
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, TrendingUp, Users, AlertTriangle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  type: string;
  priority: string;
  assignee: string;
  storyPoints: number;
  sprint?: string;
  status: string;
  dueDate?: string;
  dependencies?: number[];
}

interface TaskRoadmapProps {
  tasks: Task[];
}

export function TaskRoadmap({ tasks }: TaskRoadmapProps) {
  const [timeframe, setTimeframe] = useState("quarter");
  const [groupBy, setGroupBy] = useState("sprint");

  // Mock data for roadmap
  const roadmapData = {
    epics: [
      {
        id: 1,
        title: "Sistema de Pagamentos",
        description: "Implementar gateway de pagamento completo",
        progress: 65,
        startDate: "2024-01-15",
        endDate: "2024-03-30",
        status: "in-progress",
        owner: "Ana Silva",
        dependencies: [],
        milestones: [
          { id: 1, title: "API Gateway", date: "2024-02-15", completed: true },
          { id: 2, title: "Interface UI", date: "2024-03-01", completed: false },
          { id: 3, title: "Testes E2E", date: "2024-03-25", completed: false }
        ]
      },
      {
        id: 2,
        title: "Dashboard Analytics",
        description: "Novo dashboard com métricas avançadas",
        progress: 30,
        startDate: "2024-02-01",
        endDate: "2024-04-15",
        status: "in-progress",
        owner: "João Santos",
        dependencies: [1],
        milestones: [
          { id: 4, title: "Coleta de Dados", date: "2024-02-20", completed: true },
          { id: 5, title: "Visualizações", date: "2024-03-15", completed: false },
          { id: 6, title: "Performance", date: "2024-04-10", completed: false }
        ]
      },
      {
        id: 3,
        title: "Mobile App",
        description: "Aplicativo mobile nativo",
        progress: 10,
        startDate: "2024-03-01",
        endDate: "2024-06-30",
        status: "planning",
        owner: "Marina Costa",
        dependencies: [1, 2],
        milestones: [
          { id: 7, title: "Protótipo", date: "2024-03-20", completed: false },
          { id: 8, title: "MVP", date: "2024-05-15", completed: false },
          { id: 9, title: "Release", date: "2024-06-25", completed: false }
        ]
      }
    ],
    goals: [
      {
        id: 1,
        title: "Aumentar conversão em 25%",
        description: "Meta trimestral de conversão",
        progress: 70,
        deadline: "2024-03-31",
        linkedEpics: [1, 2]
      },
      {
        id: 2,
        title: "Reduzir tempo de resposta",
        description: "Otimizar performance em 40%",
        progress: 45,
        deadline: "2024-04-30",
        linkedEpics: [2]
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planning": return "bg-yellow-500";
      case "blocked": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Concluído";
      case "in-progress": return "Em Andamento";
      case "planning": return "Planejamento";
      case "blocked": return "Bloqueado";
      default: return "Indefinido";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Roadmap do Projeto</h2>
          <p className="text-gray-600">Visão estratégica e cronograma de entrega</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sprint">Por Sprint</SelectItem>
              <SelectItem value="team">Por Equipe</SelectItem>
              <SelectItem value="priority">Por Prioridade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Metas e Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmapData.goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <Badge variant="outline">{goal.progress}%</Badge>
                </div>
                <p className="text-xs text-gray-600">{goal.description}</p>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Prazo: {new Date(goal.deadline).toLocaleDateString()}</span>
                  <span>{goal.linkedEpics.length} épicos vinculados</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Métricas de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-novura-primary">3</p>
                <p className="text-xs text-gray-600">Épicos Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">68%</p>
                <p className="text-xs text-gray-600">Progresso Geral</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">12</p>
                <p className="text-xs text-gray-600">Milestones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">2</p>
                <p className="text-xs text-gray-600">Dependências</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Epic Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Timeline de Épicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmapData.epics.map((epic) => (
              <div key={epic.id} className="border-l-4 border-novura-primary pl-4 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-novura-primary rounded-full"></div>
                
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{epic.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{epic.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(epic.status)}>
                      {getStatusText(epic.status)}
                    </Badge>
                    <Badge variant="outline">{epic.progress}%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(epic.startDate).toLocaleDateString()} - {new Date(epic.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{epic.owner}</span>
                  </div>
                  {epic.dependencies.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{epic.dependencies.length} dependência(s)</span>
                    </div>
                  )}
                </div>

                <Progress value={epic.progress} className="mb-4" />

                {/* Milestones */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-gray-700">Milestones:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {epic.milestones.map((milestone) => (
                      <div key={milestone.id} className={`flex items-center space-x-2 p-2 rounded-lg border ${
                        milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{milestone.title}</p>
                          <p className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
