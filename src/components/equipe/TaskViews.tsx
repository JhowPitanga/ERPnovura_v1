
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar, List, Kanban, Timeline, Clock, User, Tag, Play, Pause, Square } from "lucide-react";

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
}

interface TaskViewsProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onStartTimer: (taskId: number) => void;
  onStopTimer: (taskId: number) => void;
}

export function TaskViews({ tasks, onUpdateTask, onStartTimer, onStopTimer }: TaskViewsProps) {
  const [currentView, setCurrentView] = useState("list");
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

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

  // List View Component
  const ListView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <List className="w-5 h-5 mr-2" />
          Lista de Tarefas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{getTypeIcon(task.type)}</span>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.labels.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {task.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{task.assignee || "Não atribuído"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) => onUpdateTask(task.id, { status: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="doing">Em Andamento</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                      <SelectItem value="blocked">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.storyPoints} pts</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatTime(task.timeTracked || 0)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {activeTimer === task.id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onStopTimer(task.id);
                          setActiveTimer(null);
                        }}
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onStartTimer(task.id);
                          setActiveTimer(task.id);
                        }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Calendar View Component
  const CalendarView = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Calendário de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <div key={index} className="border rounded-lg p-3 min-h-[200px]">
                <h4 className="font-medium text-sm mb-2">
                  {day.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                </h4>
                <div className="space-y-2">
                  {tasks
                    .filter(task => task.dueDate && new Date(task.dueDate).toDateString() === day.toDateString())
                    .map((task) => (
                      <div key={task.id} className="bg-novura-primary/10 border border-novura-primary/20 rounded p-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-xs">{getTypeIcon(task.type)}</span>
                          <p className="text-xs font-medium truncate">{task.title}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          <span className="text-xs text-gray-600">{task.assignee}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Timeline View Component
  const TimelineView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Timeline className="w-5 h-5 mr-2" />
          Timeline do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks
            .filter(task => task.dueDate)
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .map((task, index) => (
              <div key={task.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  {index < tasks.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2"></div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span>{getTypeIcon(task.type)}</span>
                      <h4 className="font-medium">{task.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <span className="text-sm text-gray-500">
                        {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{task.assignee}</span>
                    <span>{task.storyPoints} pontos</span>
                    <span>{formatTime(task.timeTracked || 0)}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visualizações</h3>
        <Tabs value={currentView} onValueChange={setCurrentView}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>Lista</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Calendário</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Timeline className="w-4 h-4" />
              <span>Timeline</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {currentView === "list" && <ListView />}
      {currentView === "calendar" && <CalendarView />}
      {currentView === "timeline" && <TimelineView />}
    </div>
  );
}
