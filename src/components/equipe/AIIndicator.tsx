
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

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
          title: "Alta Margem",
        };
      case "low_stock":
        return {
          title: "Estoque Baixo",
        };
      case "delayed_print":
        return {
          title: "Impressão Atrasada",
        };
      case "profit_opportunity":
        return {
          title: "Oportunidade",
        };
      default:
        return {
          title: "Sugestão IA",
        };
    }
  };

  const config = getIndicatorConfig();

  return (
    <div className="relative inline-block">
      <div
        className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group relative overflow-hidden"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Brain className="w-4 h-4 text-white z-10" />
        
        {/* Slower Ripple Effects */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-600" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 rounded-full animate-pulse opacity-15 bg-purple-600" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <Card className="absolute z-50 w-72 top-full left-1/2 transform -translate-x-1/2 mt-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Brain className="w-3 h-3 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-purple-600 bg-purple-100 border-0">
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
