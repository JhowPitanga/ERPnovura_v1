
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Archive, BarChart3 } from "lucide-react";

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
      color: "text-muted-foreground",
      clickable: false
    },
    {
      id: "estoque",
      title: "Estoque Total",
      value: "115",
      subtitle: "5 produtos",
      icon: Archive,
      color: "text-muted-foreground",
      clickable: true
    },
    {
      id: "inventario",
      title: "Inventário",
      value: "12",
      subtitle: "Contagens pendentes",
      icon: BarChart3,
      color: "text-indigo-500",
      clickable: true,
      hasButton: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;
        
        return (
          <Card 
            key={card.id}
            className={`transition-all hover:shadow-md ${
              card.clickable ? 'cursor-pointer' : ''
            } ${
              isActive && card.clickable ? 'bg-primary/5 ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => card.clickable && setActiveFilter(card.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${isActive && card.clickable ? 'text-primary' : card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${isActive && card.clickable ? 'text-primary' : card.color.replace('text-', 'text-')}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              {card.hasButton && (
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Lógica para criar balanço de estoque
                    console.log("Criar balanço de estoque");
                  }}
                >
                  Criar Balanço
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
