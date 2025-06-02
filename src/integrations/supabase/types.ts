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
      configuracoes: {
        Row: {
          atualizado_em: string
          chave: string
          criado_em: string
          id: string
          user_id: string
          valor: Json
        }
        Insert: {
          atualizado_em?: string
          chave: string
          criado_em?: string
          id?: string
          user_id: string
          valor: Json
        }
        Update: {
          atualizado_em?: string
          chave?: string
          criado_em?: string
          id?: string
          user_id?: string
          valor?: Json
        }
        Relationships: []
      }
      empresas: {
        Row: {
          criado_em: string
          id: string
          nome: string
          segmento: string | null
          tamanho_equipe: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
          segmento?: string | null
          tamanho_equipe?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
          segmento?: string | null
          tamanho_equipe?: string | null
        }
        Relationships: []
      }
      equipes: {
        Row: {
          criado_em: string
          empresa_id: string | null
          id: string
          meta_total: number | null
          nome: string
        }
        Insert: {
          criado_em?: string
          empresa_id?: string | null
          id?: string
          meta_total?: number | null
          nome: string
        }
        Update: {
          criado_em?: string
          empresa_id?: string | null
          id?: string
          meta_total?: number | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      habitos: {
        Row: {
          concluido: boolean | null
          data_conclusao: string | null
          data_criacao: string
          descricao: string | null
          equipe_id: string | null
          evidencia: Json | null
          horario: string | null
          id: string
          recorrencia: string | null
          titulo: string
          usuario_id: string | null
          verificacao_necessaria: boolean | null
          verificado: boolean | null
        }
        Insert: {
          concluido?: boolean | null
          data_conclusao?: string | null
          data_criacao?: string
          descricao?: string | null
          equipe_id?: string | null
          evidencia?: Json | null
          horario?: string | null
          id?: string
          recorrencia?: string | null
          titulo: string
          usuario_id?: string | null
          verificacao_necessaria?: boolean | null
          verificado?: boolean | null
        }
        Update: {
          concluido?: boolean | null
          data_conclusao?: string | null
          data_criacao?: string
          descricao?: string | null
          equipe_id?: string | null
          evidencia?: Json | null
          horario?: string | null
          id?: string
          recorrencia?: string | null
          titulo?: string
          usuario_id?: string | null
          verificacao_necessaria?: boolean | null
          verificado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "habitos_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      habitos_equipe: {
        Row: {
          concluido: boolean | null
          data_conclusao: string | null
          data_criacao: string
          descricao: string | null
          equipe_id: string
          id: string
          recorrencia: string | null
          titulo: string
        }
        Insert: {
          concluido?: boolean | null
          data_conclusao?: string | null
          data_criacao?: string
          descricao?: string | null
          equipe_id: string
          id?: string
          recorrencia?: string | null
          titulo: string
        }
        Update: {
          concluido?: boolean | null
          data_conclusao?: string | null
          data_criacao?: string
          descricao?: string | null
          equipe_id?: string
          id?: string
          recorrencia?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "habitos_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          atual: number | null
          atualizado_em: string
          criado_em: string
          equipe_id: string | null
          id: string
          nome: string
          percentual: number | null
          tipo: string | null
          usuario_id: string | null
          valor: number
        }
        Insert: {
          atual?: number | null
          atualizado_em?: string
          criado_em?: string
          equipe_id?: string | null
          id?: string
          nome: string
          percentual?: number | null
          tipo?: string | null
          usuario_id?: string | null
          valor: number
        }
        Update: {
          atual?: number | null
          atualizado_em?: string
          criado_em?: string
          equipe_id?: string | null
          id?: string
          nome?: string
          percentual?: number | null
          tipo?: string | null
          usuario_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "metas_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_widgets: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          user_id: string
          widgets: Json
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          user_id: string
          widgets?: Json
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          user_id?: string
          widgets?: Json
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string | null
          empresa_id: string | null
          id: string
          nome: string | null
          role: string | null
          teams: Json | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          role?: string | null
          teams?: Json | null
          user_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          role?: string | null
          teams?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores: {
        Row: {
          criado_em: string
          email: string
          empresa_id: string | null
          equipe_id: string | null
          id: string
          meta_atual: number | null
          nome: string
          taxa_conversao: number | null
          vendas_total: number | null
        }
        Insert: {
          criado_em?: string
          email: string
          empresa_id?: string | null
          equipe_id?: string | null
          id?: string
          meta_atual?: number | null
          nome: string
          taxa_conversao?: number | null
          vendas_total?: number | null
        }
        Update: {
          criado_em?: string
          email?: string
          empresa_id?: string | null
          equipe_id?: string | null
          id?: string
          meta_atual?: number | null
          nome?: string
          taxa_conversao?: number | null
          vendas_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedores_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
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
