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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: string | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          assigned_to: string | null
          business_name: string | null
          created_at: string
          customer_id: string | null
          email: string | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          status: Database["public"]["Enums"]["crm_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          business_name?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["crm_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          business_name?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["crm_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          id: string
          image_path: string | null
          published: boolean
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          category: string
          created_at?: string
          id?: string
          image_path?: string | null
          published?: boolean
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          image_path?: string | null
          published?: boolean
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string | null
          completed_date: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          notes: string | null
          service_type: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          notes?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          addons: Json
          assigned_to: string | null
          business_name: string | null
          created_at: string
          currency: string
          customer_id: string | null
          email: string | null
          estimated_total: number
          id: string
          internal_notes: string | null
          name: string
          package_name: string
          package_price: number
          phone: string | null
          recurring_total: number
          requirements: string | null
          status: Database["public"]["Enums"]["crm_status"]
          updated_at: string
        }
        Insert: {
          addons?: Json
          assigned_to?: string | null
          business_name?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          email?: string | null
          estimated_total?: number
          id?: string
          internal_notes?: string | null
          name: string
          package_name: string
          package_price?: number
          phone?: string | null
          recurring_total?: number
          requirements?: string | null
          status?: Database["public"]["Enums"]["crm_status"]
          updated_at?: string
        }
        Update: {
          addons?: Json
          assigned_to?: string | null
          business_name?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          email?: string | null
          estimated_total?: number
          id?: string
          internal_notes?: string | null
          name?: string
          package_name?: string
          package_price?: number
          phone?: string | null
          recurring_total?: number
          requirements?: string | null
          status?: Database["public"]["Enums"]["crm_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_ai_recommendations: {
        Row: {
          action: string
          created_at: string
          evidence: string
          generated_by: string | null
          id: string
          priority: string
          snapshot_id: string
          target: string
          title: string
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          evidence: string
          generated_by?: string | null
          id?: string
          priority: string
          snapshot_id: string
          target: string
          title: string
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          evidence?: string
          generated_by?: string | null
          id?: string
          priority?: string
          snapshot_id?: string
          target?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_ai_recommendations_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "seo_search_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_search_snapshots: {
        Row: {
          created_at: string
          id: string
          page_rows: Json
          period_end: string
          period_start: string
          previous_end: string
          previous_start: string
          query_rows: Json
          refreshed_by: string | null
          site_url: string
          totals: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_rows?: Json
          period_end: string
          period_start: string
          previous_end: string
          previous_start: string
          query_rows?: Json
          refreshed_by?: string | null
          site_url: string
          totals?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_rows?: Json
          period_end?: string
          period_start?: string
          previous_end?: string
          previous_start?: string
          query_rows?: Json
          refreshed_by?: string | null
          site_url?: string
          totals?: Json
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          short_description: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "admin" | "user" | "manager" | "staff" | "content_manager"
      crm_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal_sent"
        | "in_discussion"
        | "won"
        | "lost"
      lead_status:
        | "new"
        | "contacted"
        | "in_discussion"
        | "approved"
        | "declined"
        | "completed"
      project_status:
        | "planning"
        | "in_progress"
        | "review"
        | "completed"
        | "on_hold"
        | "cancelled"
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
  public: {
    Enums: {
      app_role: ["admin", "user", "manager", "staff", "content_manager"],
      crm_status: [
        "new",
        "contacted",
        "qualified",
        "proposal_sent",
        "in_discussion",
        "won",
        "lost",
      ],
      lead_status: [
        "new",
        "contacted",
        "in_discussion",
        "approved",
        "declined",
        "completed",
      ],
      project_status: [
        "planning",
        "in_progress",
        "review",
        "completed",
        "on_hold",
        "cancelled",
      ],
    },
  },
} as const
