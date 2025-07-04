
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Clock, Package } from "lucide-react";

interface AIIndicatorProps {
  type: "high_margin" | "low_stock" | "delayed_print" | "profit_opportunity";
  suggestion: string;
  details: string;
}

export function AIIndicator({ type, suggestion, details }: AIIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getIndicatorConfig = () => {
    switch (type) {
      case "high_margin":
        return {
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
          title: "Alta Margem",
        };
      case "low_stock":
        return {
          icon: Package,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-300",
          title: "Estoque Baixo",
        };
      case "delayed_print":
        return {
          icon: Clock,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          title: "Impressão Atrasada",
        };
      case "profit_opportunity":
        return {
          icon: AlertTriangle,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-300",
          title: "Oportunidade",
        };
      default:
        return {
          icon: Brain,
          color: "text-novura-primary",
          bgColor: "bg-novura-primary/10",
          borderColor: "border-novura-primary/30",
          title: "Sugestão IA",
        };
    }
  };

  const config = getIndicatorConfig();
  const Icon = config.icon;

  return (
    <div className="relative inline-block">
      <div
        className={`w-8 h-8 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-gradient-to-r from-novura-primary to-purple-600"></div>
        <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-gradient-to-r from-novura-primary to-purple-600"></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <Card className="absolute z-50 w-72 top-full left-1/2 transform -translate-x-1/2 mt-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className={`${config.color} ${config.bgColor} border-0`}>
                    {config.title}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Brain className="w-3 h-3 text-novura-primary" />
                    <span className="text-xs text-novura-primary font-medium">NOVURA AI</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{suggestion}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{details}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
