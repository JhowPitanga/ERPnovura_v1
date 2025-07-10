
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
        className="w-6 h-6 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 group relative overflow-hidden"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          background: 'linear-gradient(45deg, #8B5CF6, #A855F7, #C084FC)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
        }}
      >
        {/* Multiple expanding ripple effects */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-40 animate-ping" 
          style={{ 
            animationDuration: '2s',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-30 animate-ping" 
          style={{ 
            animationDuration: '2.5s',
            animationDelay: '0.5s'
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-purple-200 opacity-20 animate-ping" 
          style={{ 
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Inner glow effect */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300 to-purple-600 opacity-80"></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <Card className="absolute z-50 w-72 top-full left-1/2 transform -translate-x-1/2 mt-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                  }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-purple-600 bg-purple-100 border-0">
                    {config.title}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                      }}
                    ></div>
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
