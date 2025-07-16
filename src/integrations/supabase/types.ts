export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          active: boolean
          bairro: string
          cep: string
          certificado_a1_url: string | null
          certificado_senha: string | null
          certificado_validade: string | null
          cidade: string
          cnpj: string
          created_at: string
          email: string
          endereco: string
          estado: string
          id: string
          inscricao_estadual: string | null
          lojas_associadas: Json | null
          numero: string
          numero_serie: string | null
          proxima_nfe: number | null
          razao_social: string
          tipo_empresa: string
          tributacao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          bairro: string
          cep: string
          certificado_a1_url?: string | null
          certificado_senha?: string | null
          certificado_validade?: string | null
          cidade: string
          cnpj: string
          created_at?: string
          email: string
          endereco: string
          estado: string
          id?: string
          inscricao_estadual?: string | null
          lojas_associadas?: Json | null
          numero: string
          numero_serie?: string | null
          proxima_nfe?: number | null
          razao_social: string
          tipo_empresa: string
          tributacao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          bairro?: string
          cep?: string
          certificado_a1_url?: string | null
          certificado_senha?: string | null
          certificado_validade?: string | null
          cidade?: string
          cnpj?: string
          created_at?: string
          email?: string
          endereco?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          lojas_associadas?: Json | null
          numero?: string
          numero_serie?: string | null
          proxima_nfe?: number | null
          razao_social?: string
          tipo_empresa?: string
          tributacao?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_group_members: {
        Row: {
          created_at: string
          id: string
          product_group_id: string | null
          product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_group_id?: string | null
          product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_group_id?: string | null
          product_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_variant_group_id_fkey"
            columns: ["product_group_id"]
            isOneToOne: false
            referencedRelation: "product_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      product_groups: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_kit_items: {
        Row: {
          created_at: string
          id: string
          kit_id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kit_id: string
          product_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kit_id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_kit_items_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "product_kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_kit_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_kits: {
        Row: {
          created_at: string
          id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_kits_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: number
          brand_id: string | null
          category_id: string | null
          cest: number | null
          color: string | null
          cost_price: number
          created_at: string
          custom_attributes: Json | null
          description: string | null
          id: string
          image_urls: string[]
          name: string
          ncm: number
          package_height: number
          package_length: number
          package_width: number
          sell_price: number | null
          size: string | null
          sku: string
          tax_origin_code: number
          type: string
          updated_at: string
          user_id: string | null
          weight: number | null
          weight_type: string | null
        }
        Insert: {
          barcode: number
          brand_id?: string | null
          category_id?: string | null
          cest?: number | null
          color?: string | null
          cost_price: number
          created_at?: string
          custom_attributes?: Json | null
          description?: string | null
          id?: string
          image_urls: string[]
          name: string
          ncm: number
          package_height: number
          package_length: number
          package_width: number
          sell_price?: number | null
          size?: string | null
          sku: string
          tax_origin_code: number
          type: string
          updated_at?: string
          user_id?: string | null
          weight?: number | null
          weight_type?: string | null
        }
        Update: {
          barcode?: number
          brand_id?: string | null
          category_id?: string | null
          cest?: number | null
          color?: string | null
          cost_price?: number
          created_at?: string
          custom_attributes?: Json | null
          description?: string | null
          id?: string
          image_urls?: string[]
          name?: string
          ncm?: number
          package_height?: number
          package_length?: number
          package_width?: number
          sell_price?: number | null
          size?: string | null
          sku?: string
          tax_origin_code?: number
          type?: string
          updated_at?: string
          user_id?: string | null
          weight?: number | null
          weight_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products_stock: {
        Row: {
          created_at: string
          current: number
          id: number
          in_transit: number | null
          product_id: string
          reserved: number | null
          storage_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current: number
          id?: number
          in_transit?: number | null
          product_id: string
          reserved?: number | null
          storage_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current?: number
          id?: number
          in_transit?: number | null
          product_id?: string
          reserved?: number | null
          storage_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_stock_storage_id_fkey"
            columns: ["storage_id"]
            isOneToOne: false
            referencedRelation: "storage"
            referencedColumns: ["id"]
          },
        ]
      }
      storage: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string | null
          id: string
          invitation_token: string | null
          invited_by_user_id: string
          nome: string
          permissions: Json
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by_user_id: string
          nome: string
          permissions?: Json
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by_user_id?: string
          nome?: string
          permissions?: Json
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_user_invitation: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_kit_stock: {
        Args: { kit_product_id: string }
        Returns: number
      }
      create_order_with_items: {
        Args: {
          p_marketplace_order_id: string
          p_customer_name: string
          p_customer_email: string
          p_customer_phone: string
          p_shipping_address: string
          p_shipping_city: string
          p_shipping_state: string
          p_shipping_zip_code: string
          p_order_total: number
          p_order_cost: number
          p_status: string
          p_items: Json[]
        }
        Returns: string
      }
      create_product: {
        Args:
          | {
              p_name: string
              p_sku: string
              p_category_id: string
              p_brand_id: string
              p_description: string
              p_cost_price: number
              p_sell_price: number
              p_barcode: number
              p_ncm: number
              p_cest: number
              p_tax_origin_code: number
              p_weight: number
              p_weight_type: string
              p_package_length: number
              p_package_width: number
              p_package_height: number
              p_image_urls: string[]
              p_color: string
              p_size: string
              p_custom_attributes: Json
            }
          | {
              p_name: string
              p_sku: string
              p_category_id: string
              p_brand_id: string
              p_description: string
              p_cost_price: number
              p_sell_price: number
              p_barcode: number
              p_ncm: number
              p_cest: number
              p_tax_origin_code: number
              p_weight: number
              p_weight_type: string
              p_package_length: number
              p_package_width: number
              p_package_height: number
              p_image_urls: string[]
              p_color: string
              p_size: string
              p_custom_attributes: Json
              p_initial_stock_quantity: number
              p_storage_id: string
            }
        Returns: string
      }
      create_product_variant_group: {
        Args: {
          p_name: string
          p_sku_base: string
          p_description: string
          p_category_id: string
          p_brand_id: string
          p_image_urls: string[]
          p_custom_attributes: Json
        }
        Returns: string
      }
      create_product_variant_item: {
        Args: {
          p_parent_product_id: string
          p_name: string
          p_sku: string
          p_description: string
          p_cost_price: number
          p_sell_price: number
          p_barcode: number
          p_ncm: number
          p_cest: number
          p_tax_origin_code: number
          p_weight: number
          p_weight_type: string
          p_package_length: number
          p_package_width: number
          p_package_height: number
          p_image_urls: string[]
          p_color: string
          p_size: string
          p_custom_attributes: Json
          p_initial_stock_quantity: number
          p_storage_id: string
        }
        Returns: string
      }
      create_product_with_stock: {
        Args: {
          p_name: string
          p_sku: string
          p_type: string
          p_description: string
          p_cost_price: number
          p_sell_price: number
          p_barcode: number
          p_ncm: number
          p_cest: number
          p_package_height: number
          p_package_width: number
          p_package_length: number
          p_weight: number
          p_weight_type: string
          p_tax_origin_code: number
          p_category_id: string
          p_brand_id: string
          p_color: string
          p_size: string
          p_image_urls: string[]
          p_custom_attributes: Json
          p_stock_current: number
          p_storage_id: string
        }
        Returns: string
      }
      create_user_invitation: {
        Args: {
          p_email: string
          p_nome: string
          p_telefone: string
          p_permissions: Json
        }
        Returns: string
      }
      duplicate_product: {
        Args: { original_product_id: string }
        Returns: string
      }
      link_order_stock: {
        Args: { p_order_id: string; p_storage_id_for_reservation: string }
        Returns: undefined
      }
      reserve_stock_for_order_item: {
        Args: {
          p_product_id: string
          p_storage_id: string
          p_quantity_to_reserve: number
        }
        Returns: undefined
      }
      upsert_product_stock: {
        Args: {
          p_product_id: string
          p_storage_id: string
          p_quantity: number
          p_reserved?: number
          p_in_transit?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
