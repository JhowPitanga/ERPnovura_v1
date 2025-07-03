
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, CheckSquare, Clock, BarChart3, User, Timer, Play, Pause } from "lucide-react";

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
  timeTracked?: number;
  labels: string[];
  dependencies?: number[];
}

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onStartTimer: (taskId: number) => void;
  onStopTimer: (taskId: number) => void;
}

export function TaskBoard({ tasks, onUpdateTask, onStartTimer, onStopTimer }: TaskBoardProps) {
  const [selectedSprint, setSelectedSprint] = useState("sprint-1");
  const [viewMode, setViewMode] = useState("board");
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});

  const columns = [
    { id: "todo", title: "A Fazer", tasks: tasks.filter(t => t.status === "todo"), color: "border-red-200 bg-red-50/30" },
    { id: "doing", title: "Em Andamento", tasks: tasks.filter(t => t.status === "doing"), color: "border-yellow-200 bg-yellow-50/30" },
    { id: "done", title: "Concluído", tasks: tasks.filter(t => t.status === "done"), color: "border-green-200 bg-green-50/30" },
    { id: "blocked", title: "Bloqueado", tasks: tasks.filter(t => t.status === "blocked"), color: "border-gray-200 bg-gray-50/30" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600";
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "story": return "📘";
      case "bug": return "🐛"; 
      case "task": return "📝";
      case "epic": return "🎯";
      case "spike": return "⚡";
      default: return "📝";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleStartTimer = (taskId: number) => {
    setActiveTimers(prev => ({ ...prev, [taskId]: true }));
    onStartTimer(taskId);
  };

  const handleStopTimer = (taskId: number) => {
    setActiveTimers(prev => ({ ...prev, [taskId]: false }));
    onStopTimer(taskId);
  };

  const sprintTasks = tasks.filter(task => task.sprint === selectedSprint);
  const totalPoints = sprintTasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedPoints = sprintTasks.filter(task => task.status === "done").reduce((sum, task) => sum + task.storyPoints, 0);
  const progressPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gerenciamento de Projetos</h2>
          <p className="text-gray-600">Planejamento, organização e acompanhamento de tarefas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sprint-1">Sprint 1</SelectItem>
              <SelectItem value="sprint-2">Sprint 2</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="board">Board</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
              <SelectItem value="calendar">Calendário</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-novura-primary to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Sprint Info */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Story Points</p>
                <p className="text-xl font-bold">{completedPoints}/{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Tarefas</p>
                <p className="text-xl font-bold">{tasks.filter(t => t.status === "done").length}/{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Tempo Total</p>
                <p className="text-xl font-bold">{formatTime(tasks.reduce((sum, task) => sum + (task.timeTracked || 0), 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Progresso</p>
                <Progress value={progressPercentage} className="w-full mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "board" && (
        <div className="grid grid-cols-4 gap-6">
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
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTypeIcon(task.type)}</span>
                          <h4 className="text-sm font-medium text-gray-900 leading-tight">{task.title}</h4>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{task.assignee || "Não atribuído"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Timer className="w-3 h-3" />
                          <span>{formatTime(task.timeTracked || 0)}</span>
                        </div>
                      </div>

                      {task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs px-1 py-0">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {task.storyPoints} pts
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.type}
                        </Badge>
                      </div>

                      {/* Time Tracking */}
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => activeTimers[task.id] ? handleStopTimer(task.id) : handleStartTimer(task.id)}
                        >
                          {activeTimers[task.id] ? (
                            <>
                              <Pause className="w-3 h-3 mr-1" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Iniciar
                            </>
                          )}
                        </Button>
                        {task.dependencies && task.dependencies.length > 0 && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            {task.dependencies.length} dep.
                          </Badge>
                        )}
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
      )}
    </div>
  );
}
