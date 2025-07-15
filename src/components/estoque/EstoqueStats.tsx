
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Archive, PackageOpen, Truck, PackageCheck, Building2, BarChart3 } from "lucide-react";

interface EstoqueStatsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function EstoqueStats({ activeFilter, setActiveFilter }: EstoqueStatsProps) {
  const cards = [
    {
      id: "total",
      title: "Valor Total",
      value: "R$ 515.991,83",
      subtitle: "+8% vs mês anterior",
      icon: Package,
      color: "text-muted-foreground"
    },
    {
      id: "estoque",
      title: "Estoque Total",
      value: "115",
      subtitle: "5 produtos",
      icon: Archive,
      color: "text-muted-foreground"
    },
    {
      id: "picking",
      title: "Picking Pendente",
      value: "8",
      subtitle: "Pedidos aguardando",
      icon: PackageOpen,
      color: "text-orange-500"
    },
    {
      id: "expedicoes",
      title: "Expedições Hoje",
      value: "23",
      subtitle: "+12% vs ontem",
      icon: Truck,
      color: "text-blue-500"
    },
    {
      id: "recebimentos",
      title: "Recebimentos",
      value: "3",
      subtitle: "Pendentes conferência",
      icon: PackageCheck,
      color: "text-green-500"
    },
    {
      id: "fulfillment",
      title: "Fulfillment",
      value: "45",
      subtitle: "Produtos ativos",
      icon: Building2,
      color: "text-purple-500"
    },
    {
      id: "inventario",
      title: "Inventário",
      value: "12",
      subtitle: "Contagens pendentes",
      icon: BarChart3,
      color: "text-indigo-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;
        
        return (
          <Card 
            key={card.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isActive ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setActiveFilter(card.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${card.color.replace('text-', 'text-')}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
