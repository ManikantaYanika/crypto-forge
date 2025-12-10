export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_balance: {
        Row: {
          asset: string
          available_balance: number
          id: string
          margin_balance: number
          total_balance: number
          unrealized_pnl: number
          updated_at: string
        }
        Insert: {
          asset?: string
          available_balance?: number
          id?: string
          margin_balance?: number
          total_balance?: number
          unrealized_pnl?: number
          updated_at?: string
        }
        Update: {
          asset?: string
          available_balance?: number
          id?: string
          margin_balance?: number
          total_balance?: number
          unrealized_pnl?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          average_price: number | null
          client_order_id: string | null
          commission: number | null
          commission_asset: string | null
          created_at: string
          executed_at: string | null
          filled_quantity: number | null
          id: string
          order_id: string | null
          order_type: string
          price: number | null
          quantity: number
          raw_response: Json | null
          side: string
          status: string
          stop_price: number | null
          symbol: string
          updated_at: string
        }
        Insert: {
          average_price?: number | null
          client_order_id?: string | null
          commission?: number | null
          commission_asset?: string | null
          created_at?: string
          executed_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_id?: string | null
          order_type: string
          price?: number | null
          quantity: number
          raw_response?: Json | null
          side: string
          status?: string
          stop_price?: number | null
          symbol: string
          updated_at?: string
        }
        Update: {
          average_price?: number | null
          client_order_id?: string | null
          commission?: number | null
          commission_asset?: string | null
          created_at?: string
          executed_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_id?: string | null
          order_type?: string
          price?: number | null
          quantity?: number
          raw_response?: Json | null
          side?: string
          status?: string
          stop_price?: number | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string
          entry_price: number
          id: string
          leverage: number
          liquidation_price: number | null
          margin_type: string | null
          mark_price: number | null
          side: string
          size: number
          symbol: string
          unrealized_pnl: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entry_price: number
          id?: string
          leverage?: number
          liquidation_price?: number | null
          margin_type?: string | null
          mark_price?: number | null
          side: string
          size?: number
          symbol: string
          unrealized_pnl?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entry_price?: number
          id?: string
          leverage?: number
          liquidation_price?: number | null
          margin_type?: string | null
          mark_price?: number | null
          side?: string
          size?: number
          symbol?: string
          unrealized_pnl?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      price_tickers: {
        Row: {
          high_24h: number | null
          id: string
          low_24h: number | null
          price: number
          price_change: number | null
          price_change_percent: number | null
          symbol: string
          updated_at: string
          volume_24h: number | null
        }
        Insert: {
          high_24h?: number | null
          id?: string
          low_24h?: number | null
          price: number
          price_change?: number | null
          price_change_percent?: number | null
          symbol: string
          updated_at?: string
          volume_24h?: number | null
        }
        Update: {
          high_24h?: number | null
          id?: string
          low_24h?: number | null
          price?: number
          price_change?: number | null
          price_change_percent?: number | null
          symbol?: string
          updated_at?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      trading_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          latency_ms: number | null
          log_type: string
          message: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          latency_ms?: number | null
          log_type: string
          message: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          latency_ms?: number | null
          log_type?: string
          message?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
