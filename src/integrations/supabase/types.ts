export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          verification_required: boolean | null
          verified: boolean | null
        }
        Insert: {
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
          verification_required?: boolean | null
          verified?: boolean | null
        }
        Update: {
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
          verification_required?: boolean | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
