export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          sku: string;
          description: string | null;
          price: number;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          sku: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          sku?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          product_id: string;
          quantity: number;
          min_quantity: number;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          quantity?: number;
          min_quantity?: number;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          quantity?: number;
          min_quantity?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory_movements: {
        Row: {
          id: string;
          product_id: string;
          type: "entrada" | "salida" | "ajuste" | "venta";
          quantity: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          type: "entrada" | "salida" | "ajuste" | "venta";
          quantity: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          type?: "entrada" | "salida" | "ajuste" | "venta";
          quantity?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_email: string;
          status: "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado";
          payment_status: "pendiente" | "pagado" | "fallido" | "reembolsado";
          payment_provider: string | null;
          payment_id: string | null;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_email: string;
          status?: "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado";
          payment_status?: "pendiente" | "pagado" | "fallido" | "reembolsado";
          payment_provider?: string | null;
          payment_id?: string | null;
          total: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string;
          status?: "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado";
          payment_status?: "pendiente" | "pagado" | "fallido" | "reembolsado";
          payment_provider?: string | null;
          payment_id?: string | null;
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "customer";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "admin" | "customer";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin" | "customer";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      apply_inventory_movement: {
        Args: {
          target_product_id: string;
          movement_type: "entrada" | "salida" | "ajuste" | "venta";
          movement_quantity: number;
          movement_note?: string | null;
        };
        Returns: number;
      };
    };
  };
};
