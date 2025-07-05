
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Crítico":
      return <Badge variant="destructive">Crítico</Badge>;
    case "Baixo":
      return <Badge className="bg-yellow-500">Baixo</Badge>;
    case "Pendente":
      return <Badge className="bg-orange-500">Pendente</Badge>;
    case "Conferindo":
      return <Badge className="bg-blue-500">Conferindo</Badge>;
    case "Concluído":
      return <Badge className="bg-green-500">Concluído</Badge>;
    case "Em Separação":
      return <Badge className="bg-blue-500">Em Separação</Badge>;
    case "Aguardando":
      return <Badge className="bg-gray-500">Aguardando</Badge>;
    case "Separado":
      return <Badge className="bg-green-500">Separado</Badge>;
    case "Embalado":
      return <Badge className="bg-purple-500">Embalado</Badge>;
    case "Expedido":
      return <Badge className="bg-green-500">Expedido</Badge>;
    case "Em Trânsito":
      return <Badge className="bg-blue-500">Em Trânsito</Badge>;
    case "Urgente":
      return <Badge variant="destructive">Urgente</Badge>;
    case "Alta":
      return <Badge className="bg-orange-500">Alta</Badge>;
    default:
      return <Badge variant="default">Normal</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Crítico":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "Baixo":
      return <TrendingDown className="w-4 h-4 text-yellow-500" />;
    default:
      return <TrendingUp className="w-4 h-4 text-green-500" />;
  }
};
