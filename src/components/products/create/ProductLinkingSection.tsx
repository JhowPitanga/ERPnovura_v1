
import { Link, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductVariation, ProductType } from "@/types/products";

interface ProductLinkingSectionProps {
  productType: ProductType | "";
  variations: ProductVariation[];
  onNavigateToAds: () => void;
}

export function ProductLinkingSection({ 
  productType, 
  variations, 
  onNavigateToAds 
}: ProductLinkingSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">Link Ads</h3>
        <p className="text-gray-600 mb-8 text-lg">
          Your product has been saved successfully! Now you can link it to marketplaces or create new ads.
        </p>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Card 1: Link Advertisement */}
          <Drawer>
            <DrawerTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <Link className="w-20 h-20 text-primary mx-auto mb-6" />
                  <h4 className="text-xl font-semibold mb-3">Link Advertisement</h4>
                  <p className="text-gray-600">
                    Connect this product to existing ads on marketplaces
                  </p>
                </CardContent>
              </Card>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Link Advertisement</DrawerTitle>
                <DrawerDescription>
                  {productType === "variation" 
                    ? "Select existing ads to link to this product's variations"
                    : "Select existing ads to link to this product"
                  }
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>Marketplace</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select marketplace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="shopee">Shopee</SelectItem>
                          <SelectItem value="magazineluiza">Magazine Luiza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Search</Label>
                      <Input placeholder="Search by SKU, ID or description..." className="mt-2" />
                    </div>
                  </div>
                  
                  {productType === "variation" && variations.length > 0 && (
                    <div>
                      <Label className="text-base font-medium">Link by Variation</Label>
                      <div className="mt-4 space-y-3">
                        {variations.map((variation) => (
                          <Card key={variation.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {variation.color && (
                                  <div
                                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: variation.color.toLowerCase() }}
                                  />
                                )}
                                <div>
                                  <span className="font-medium">{variation.name}</span>
                                  <p className="text-sm text-gray-500">SKU: {variation.sku}</p>
                                </div>
                              </div>
                              <Select>
                                <SelectTrigger className="w-64">
                                  <SelectValue placeholder="Select advertisement" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="anuncio1">Similar Product - ML123456</SelectItem>
                                  <SelectItem value="anuncio2">Test Product - AMZ789012</SelectItem>
                                  <SelectItem value="anuncio3">Example Product - SHP345678</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border rounded-lg p-8 bg-gray-50">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">
                        Select a marketplace and search to find ads
                      </p>
                      <Button variant="outline" className="text-blue-600 border-blue-200">
                        Search Ads
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Confirm Links
                    </Button>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Card 2: Create Advertisement */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={onNavigateToAds}
          >
            <CardContent className="p-8 text-center">
              <ExternalLink className="w-20 h-20 text-primary mx-auto mb-6" />
              <h4 className="text-xl font-semibold mb-3">Create Advertisement</h4>
              <p className="text-gray-600">
                Create a new ad for this product on marketplaces
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
