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
      admin_settings: {
        Row: {
          created_at: string
          id: string
          openai_api_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          openai_api_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          openai_api_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          company_id: string | null
          compliance_flags: Json | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          compliance_flags?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          compliance_flags?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          segment: string | null
          team_size: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          segment?: string | null
          team_size?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          segment?: string | null
          team_size?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_value: number | null
          id: string
          name: string
          percentage: number | null
          target_value: number
          team_id: string | null
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          id?: string
          name: string
          percentage?: number | null
          target_value: number
          team_id?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_value?: number | null
          id?: string
          name?: string
          percentage?: number | null
          target_value?: number
          team_id?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metas_equipe_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          auto_verified: boolean | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          evidence: Json | null
          id: string
          recurrence: string | null
          schedule: string | null
          team_id: string | null
          title: string
          user_id: string | null
          verification_notes: string | null
          verification_required: boolean | null
          verification_score: number | null
          verified: boolean | null
        }
        Insert: {
          auto_verified?: boolean | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          recurrence?: string | null
          schedule?: string | null
          team_id?: string | null
          title: string
          user_id?: string | null
          verification_notes?: string | null
          verification_required?: boolean | null
          verification_score?: number | null
          verified?: boolean | null
        }
        Update: {
          auto_verified?: boolean | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          recurrence?: string | null
          schedule?: string | null
          team_id?: string | null
          title?: string
          user_id?: string | null
          verification_notes?: string | null
          verification_required?: boolean | null
          verification_score?: number | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "habitos_equipe_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_templates: {
        Row: {
          created_at: string
          default_goals: Json
          default_habits: Json
          description: string | null
          id: string
          name: string
          segment: string
          suggested_integrations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_goals?: Json
          default_habits?: Json
          description?: string | null
          id?: string
          name: string
          segment: string
          suggested_integrations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_goals?: Json
          default_habits?: Json
          description?: string | null
          id?: string
          name?: string
          segment?: string
          suggested_integrations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          ai_processing_consent: boolean | null
          analytics_consent: boolean | null
          consent_version: string | null
          created_at: string
          data_retention_days: number | null
          functional_consent: boolean | null
          id: string
          last_updated_ip: unknown | null
          marketing_consent: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_processing_consent?: boolean | null
          analytics_consent?: boolean | null
          consent_version?: string | null
          created_at?: string
          data_retention_days?: number | null
          functional_consent?: boolean | null
          id?: string
          last_updated_ip?: unknown | null
          marketing_consent?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_processing_consent?: boolean | null
          analytics_consent?: boolean | null
          consent_version?: string | null
          created_at?: string
          data_retention_days?: number | null
          functional_consent?: boolean | null
          id?: string
          last_updated_ip?: unknown | null
          marketing_consent?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_reps: {
        Row: {
          company_id: string | null
          conversion_rate: number | null
          created_at: string
          current_goal: number | null
          email: string
          id: string
          name: string
          team_id: string | null
          total_sales: number | null
        }
        Insert: {
          company_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          current_goal?: number | null
          email: string
          id?: string
          name: string
          team_id?: string | null
          total_sales?: number | null
        }
        Update: {
          company_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          current_goal?: number | null
          email?: string
          id?: string
          name?: string
          team_id?: string | null
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendedores_empresa_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedores_equipe_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      team_habits: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          recurrence: string | null
          team_id: string
          title: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recurrence?: string | null
          team_id: string
          title: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recurrence?: string | null
          team_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "habitos_equipe_equipe_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
          total_goal: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          total_goal?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          total_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipes_empresa_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_widgets: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          widgets: Json
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          widgets?: Json
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          widgets?: Json
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          role: string | null
          team_ids: Json | null
          teams: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          team_ids?: Json | null
          teams?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          team_ids?: Json | null
          teams?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_empresa_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          company_id: string
          role: string
          team_ids: Json
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_user_action: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_company_id?: string
        }
        Returns: string
      }
      user_belongs_to_company: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      user_can_access_team: {
        Args: { target_team_id: string }
        Returns: boolean
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
