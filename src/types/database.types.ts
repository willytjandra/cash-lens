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
    PostgrestVersion: "14.18"
  }
  cashlens: {
    Tables: {
      accounting_connection_credentials: {
        Row: {
          access_token_expires_at: string
          access_token_secret_id: string
          accounting_connection_id: string
          created_at: string
          refresh_token_expires_at: string
          refresh_token_secret_id: string
          updated_at: string
          version: number
        }
        Insert: {
          access_token_expires_at: string
          access_token_secret_id: string
          accounting_connection_id: string
          created_at?: string
          refresh_token_expires_at: string
          refresh_token_secret_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          access_token_expires_at?: string
          access_token_secret_id?: string
          accounting_connection_id?: string
          created_at?: string
          refresh_token_expires_at?: string
          refresh_token_secret_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "accounting_connection_credentials_accounting_connection_id_fkey"
            columns: ["accounting_connection_id"]
            isOneToOne: true
            referencedRelation: "accounting_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_connections: {
        Row: {
          company_name: string
          country: string | null
          created_at: string
          currency: string | null
          external_id: string
          id: string
          profile_id: string
          provider: Database["cashlens"]["Enums"]["accounting_provider"]
          scopes: string[]
          status: Database["cashlens"]["Enums"]["accounting_connection_status"]
          updated_at: string
        }
        Insert: {
          company_name: string
          country?: string | null
          created_at?: string
          currency?: string | null
          external_id: string
          id?: string
          profile_id: string
          provider: Database["cashlens"]["Enums"]["accounting_provider"]
          scopes: string[]
          status: Database["cashlens"]["Enums"]["accounting_connection_status"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          country?: string | null
          created_at?: string
          currency?: string | null
          external_id?: string
          id?: string
          profile_id?: string
          provider?: Database["cashlens"]["Enums"]["accounting_provider"]
          scopes?: string[]
          status?: Database["cashlens"]["Enums"]["accounting_connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_connections_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          status: Database["cashlens"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          status?: Database["cashlens"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          status?: Database["cashlens"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_accounting_connection: {
        Args: {
          p_access_token: string
          p_access_token_expires_at: string
          p_company_name: string
          p_country?: string
          p_currency?: string
          p_external_id: string
          p_profile_id: string
          p_provider: Database["cashlens"]["Enums"]["accounting_provider"]
          p_refresh_token: string
          p_refresh_token_expires_at: string
          p_scopes: string[]
        }
        Returns: string
      }
    }
    Enums: {
      accounting_connection_status: "CONNECTED" | "DISCONNECTED"
      accounting_provider: "QUICKBOOKS"
      profile_status: "PENDING" | "ACTIVE"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  cashlens: {
    Enums: {
      accounting_connection_status: ["CONNECTED", "DISCONNECTED"],
      accounting_provider: ["QUICKBOOKS"],
      profile_status: ["PENDING", "ACTIVE"],
    },
  },
} as const
