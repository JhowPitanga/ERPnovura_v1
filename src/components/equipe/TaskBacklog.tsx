
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Search, Filter, ArrowUp, ArrowDown, Clock, User, Tag } from "lucide-react";

interface Task {
  id: number;
  title: string;
  type: string;
  priority: string;
  assignee: string;
  storyPoints: number;
  sprint?: string;
  status: string;
  labels: string[];
}

interface TaskBacklogProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

export function TaskBacklog({ tasks, onUpdateTask }: TaskBacklogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesType = filterType === "all" || task.type === filterType;
    return matchesSearch && matchesPriority && matchesType;
  });

  const backlogTasks = filteredTasks.filter(task => !task.sprint || task.sprint === "backlog");
  const sprintTasks = filteredTasks.filter(task => task.sprint && task.sprint !== "backlog");

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

  const TaskCard = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2 cursor-pointer hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(task.type)}</span>
                <h4 className="font-medium text-sm">{task.title}</h4>
              </div>
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>{task.assignee || "Não atribuído"}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {task.storyPoints} pts
              </Badge>
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

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {task.type}
              </Badge>
              {task.sprint && (
                <Badge variant="secondary" className="text-xs">
                  {task.sprint}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Prioridades</SelectItem>
            <SelectItem value="critical">Crítica</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Tipos</SelectItem>
            <SelectItem value="epic">Épico</SelectItem>
            <SelectItem value="story">História</SelectItem>
            <SelectItem value="task">Tarefa</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="spike">Spike</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="backlog" className="w-full">
        <TabsList>
          <TabsTrigger value="backlog">Backlog ({backlogTasks.length})</TabsTrigger>
          <TabsTrigger value="sprints">Sprints Ativas ({sprintTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="backlog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Backlog</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ArrowUp className="w-4 h-4 mr-2" />
                Priorizar
              </Button>
              <Button variant="outline" size="sm">
                <ArrowDown className="w-4 h-4 mr-2" />
                Despriorirar
              </Button>
            </div>
          </div>
          
          <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="backlog">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {backlogTasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="sprints" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["sprint-1", "sprint-2"].map((sprintId) => {
              const sprintTasksFiltered = sprintTasks.filter(task => task.sprint === sprintId);
              const totalPoints = sprintTasksFiltered.reduce((sum, task) => sum + task.storyPoints, 0);
              
              return (
                <Card key={sprintId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Sprint {sprintId.split('-')[1]}</span>
                      <Badge variant="outline">{totalPoints} pts</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DragDropContext onDragEnd={() => {}}>
                      <Droppable droppableId={sprintId}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sprintTasksFiltered.map((task, index) => (
                              <TaskCard key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
