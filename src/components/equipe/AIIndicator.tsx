
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
        className="w-4 h-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 group relative overflow-visible"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          background: 'hsl(var(--primary))',
          boxShadow: '0 0 10px hsla(var(--primary) / 0.3)'
        }}
      >
        {/* Multiple expanding ripple effects with slower animation */}
        <div 
          className="absolute inset-0 rounded-full border-2 opacity-60 animate-ping" 
          style={{ 
            borderColor: 'hsl(var(--primary))',
            animationDuration: '2s',
            animationDelay: '0s',
            transform: 'scale(1.5)'
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 opacity-40 animate-ping" 
          style={{ 
            borderColor: 'hsl(var(--primary))',
            animationDuration: '2s',
            animationDelay: '0.3s',
            transform: 'scale(2)'
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 opacity-20 animate-ping" 
          style={{ 
            borderColor: 'hsl(var(--primary))',
            animationDuration: '2s',
            animationDelay: '0.6s',
            transform: 'scale(2.5)'
          }}
        ></div>
        
        {/* Inner core */}
        <div 
          className="absolute inset-0.5 rounded-full"
          style={{ background: 'hsl(var(--primary))' }}
        ></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <Card className="absolute z-50 w-72 top-full left-1/2 transform -translate-x-1/2 mt-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ background: 'hsl(var(--primary))' }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-primary bg-primary/10 border-0">
                    {config.title}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ background: 'hsl(var(--primary))' }}
                    ></div>
                    <span className="text-xs text-primary font-medium">NOVURA AI</span>
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
