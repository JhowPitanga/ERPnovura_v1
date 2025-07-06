
import { ShoppingBag, Zap, Package } from "lucide-react";

export function ShopBanner() {
  return (
    <div className="bg-gradient-to-r from-novura-primary to-purple-600 rounded-xl p-6 mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Shop Novura</h2>
              <p className="text-white/90 text-sm">Marketplace exclusivo para sellers</p>
            </div>
          </div>
          <p className="text-lg font-medium mb-4">
            Abasteça seus suprimentos com rapidez e economia
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Entrega Rápida</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Frete Grátis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
