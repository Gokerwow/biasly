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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      groups: {
        Row: {
          agency: string | null
          category_name: string | null
          created_at: string | null
          id: string
          image_url: string | null
          logo_url: string | null
          name: string
          parent_group_id: string | null
          slug: string
          status: string | null
          wiki_last_updated: string | null
          wiki_page_id: number | null
        }
        Insert: {
          agency?: string | null
          category_name?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name: string
          parent_group_id?: string | null
          slug: string
          status?: string | null
          wiki_last_updated?: string | null
          wiki_page_id?: number | null
        }
        Update: {
          agency?: string | null
          category_name?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name?: string
          parent_group_id?: string | null
          slug?: string
          status?: string | null
          wiki_last_updated?: string | null
          wiki_page_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_parent_group_id_fkey"
            columns: ["parent_group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_parent_group_id_fkey"
            columns: ["parent_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      idol_groups: {
        Row: {
          group_id: string | null
          id: string
          idol_id: string | null
          status: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          idol_id?: string | null
          status?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          idol_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_groups_member_id_fkey"
            columns: ["idol_id"]
            isOneToOne: false
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
        ]
      }
      idols: {
        Row: {
          birth_date: string | null
          created_at: string | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          native_name: string | null
          real_name: string | null
          slug: string
          social_media: Json | null
          stage_name: string
          wiki_last_updated: string | null
          wiki_page_id: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          native_name?: string | null
          real_name?: string | null
          slug: string
          social_media?: Json | null
          stage_name: string
          wiki_last_updated?: string | null
          wiki_page_id?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          native_name?: string | null
          real_name?: string | null
          slug?: string
          social_media?: Json | null
          stage_name?: string
          wiki_last_updated?: string | null
          wiki_page_id?: number | null
        }
        Relationships: []
      }
      photocards: {
        Row: {
          created_at: string | null
          id: string
          idol_id: string | null
          image_url: string | null
          name: string
          rarity: Database["public"]["Enums"]["card_rarity"] | null
          rejected_reason: string | null
          release_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["card_status"] | null
          subject_category: Database["public"]["Enums"]["subject_type"]
          submitted_by: string | null
          type: Database["public"]["Enums"]["card_type"]
          unit_names: Json[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idol_id?: string | null
          image_url?: string | null
          name: string
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          rejected_reason?: string | null
          release_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["card_status"] | null
          subject_category: Database["public"]["Enums"]["subject_type"]
          submitted_by?: string | null
          type: Database["public"]["Enums"]["card_type"]
          unit_names?: Json[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idol_id?: string | null
          image_url?: string | null
          name?: string
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          rejected_reason?: string | null
          release_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["card_status"] | null
          subject_category?: Database["public"]["Enums"]["subject_type"]
          submitted_by?: string | null
          type?: Database["public"]["Enums"]["card_type"]
          unit_names?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "photocards_member_id_fkey"
            columns: ["idol_id"]
            isOneToOne: false
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned_at: string | null
          banned_by: string | null
          banned_reason: string | null
          banned_until: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["roles"] | null
          unban_reason: string | null
          unbanned_by: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["roles"] | null
          unban_reason?: string | null
          unbanned_by?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["roles"] | null
          unban_reason?: string | null
          unbanned_by?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          category: Database["public"]["Enums"]["release_category"]
          created_at: string | null
          group_id: string | null
          id: string
          release_date: string | null
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["release_category"]
          created_at?: string | null
          group_id?: string | null
          id?: string
          release_date?: string | null
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["release_category"]
          created_at?: string | null
          group_id?: string | null
          id?: string
          release_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "releases_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releases_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collection: {
        Row: {
          acquired_at: string | null
          id: string
          photocard_id: string | null
          user_id: string | null
        }
        Insert: {
          acquired_at?: string | null
          id?: string
          photocard_id?: string | null
          user_id?: string | null
        }
        Update: {
          acquired_at?: string | null
          id?: string
          photocard_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_collection_photocard_id_fkey"
            columns: ["photocard_id"]
            isOneToOne: false
            referencedRelation: "photocards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_groups: {
        Row: {
          id: string | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      card_rarity: "N" | "R" | "SR" | "SSR" | "UR"
      card_status: "pending" | "rejected" | "accepted"
      card_type:
        | "Album PC"
        | "POB"
        | "Lucky Draw"
        | "Trading Card"
        | "Broadcast"
      group_status: "Active" | "Hiatus" | "Disbanded"
      release_category: "Album" | "Merch" | "Event" | "Membership"
      roles: "admin" | "user"
      subject_type: "Solo" | "Unit" | "Group"
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
    Enums: {
      card_rarity: ["N", "R", "SR", "SSR", "UR"],
      card_status: ["pending", "rejected", "accepted"],
      card_type: ["Album PC", "POB", "Lucky Draw", "Trading Card", "Broadcast"],
      group_status: ["Active", "Hiatus", "Disbanded"],
      release_category: ["Album", "Merch", "Event", "Membership"],
      roles: ["admin", "user"],
      subject_type: ["Solo", "Unit", "Group"],
    },
  },
} as const