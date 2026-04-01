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
      ban_appeals: {
        Row: {
          admin_note: string | null
          ban_log_id: number | null
          created_at: string
          id: number
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["appel_status"] | null
        }
        Insert: {
          admin_note?: string | null
          ban_log_id?: number | null
          created_at?: string
          id?: number
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["appel_status"] | null
        }
        Update: {
          admin_note?: string | null
          ban_log_id?: number | null
          created_at?: string
          id?: number
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["appel_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "ban_appeals_ban_log_id_fkey"
            columns: ["ban_log_id"]
            isOneToOne: false
            referencedRelation: "ban_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ban_logs: {
        Row: {
          action: Database["public"]["Enums"]["action"] | null
          action_by: string | null
          created_at: string
          end_date: string | null
          id: number
          metadata: Json | null
          reason: string | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["action"] | null
          action_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          metadata?: Json | null
          reason?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["action"] | null
          action_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          metadata?: Json | null
          reason?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      binder_cards: {
        Row: {
          created_at: string
          id: number
          page_id: number | null
          position: number | null
          user_collection_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          page_id?: number | null
          position?: number | null
          user_collection_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          page_id?: number | null
          position?: number | null
          user_collection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "binder_cards_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "binder_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "binder_cards_user_collection_id_fkey"
            columns: ["user_collection_id"]
            isOneToOne: false
            referencedRelation: "user_collection"
            referencedColumns: ["id"]
          },
        ]
      }
      binder_pages: {
        Row: {
          binder_id: string | null
          created_at: string
          id: number
          page_number: number | null
        }
        Insert: {
          binder_id?: string | null
          created_at?: string
          id?: number
          page_number?: number | null
        }
        Update: {
          binder_id?: string | null
          created_at?: string
          id?: number
          page_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "binder_pages_binder_id_fkey"
            columns: ["binder_id"]
            isOneToOne: false
            referencedRelation: "binders"
            referencedColumns: ["id"]
          },
        ]
      }
      binders: {
        Row: {
          created_at: string
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      distribution_types: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          rarity_weight: number
          tier: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rarity_weight: number
          tier?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rarity_weight?: number
          tier?: string | null
        }
        Relationships: []
      }
      global_card_modifiers: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: number
          modifier: number
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          modifier: number
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          modifier?: number
          name?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          agency: string | null
          category_name: string
          created_at: string
          id: string
          image_url: string | null
          is_compressed: boolean | null
          is_logo_migrated: boolean | null
          is_migrated: boolean | null
          logo_url: string | null
          name: string
          parent_group_id: string | null
          slug: string
          status: string
          wiki_last_updated: string
          wiki_page_id: number
        }
        Insert: {
          agency?: string | null
          category_name: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_compressed?: boolean | null
          is_logo_migrated?: boolean | null
          is_migrated?: boolean | null
          logo_url?: string | null
          name: string
          parent_group_id?: string | null
          slug: string
          status: string
          wiki_last_updated: string
          wiki_page_id: number
        }
        Update: {
          agency?: string | null
          category_name?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_compressed?: boolean | null
          is_logo_migrated?: boolean | null
          is_migrated?: boolean | null
          logo_url?: string | null
          name?: string
          parent_group_id?: string | null
          slug?: string
          status?: string
          wiki_last_updated?: string
          wiki_page_id?: number
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
          group_id: string
          id: string
          idol_id: string
          status: string
        }
        Insert: {
          group_id: string
          id?: string
          idol_id: string
          status: string
        }
        Update: {
          group_id?: string
          id?: string
          idol_id?: string
          status?: string
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
          created_at: string
          id: string
          image_url: string | null
          is_compressed: boolean | null
          is_migrated: boolean | null
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
          created_at?: string
          id?: string
          image_url?: string | null
          is_compressed?: boolean | null
          is_migrated?: boolean | null
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
          created_at?: string
          id?: string
          image_url?: string | null
          is_compressed?: boolean | null
          is_migrated?: boolean | null
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
      local_collection_modifiers: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          modifier: number | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          modifier?: number | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          modifier?: number | null
          name?: string
        }
        Relationships: []
      }
      photocard_submissions: {
        Row: {
          created_at: string
          data: Json
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["card_status"]
          submitted_by: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status: Database["public"]["Enums"]["card_status"]
          submitted_by: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["card_status"]
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "photocard_submissions_submitted_by_fkey1"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photocards: {
        Row: {
          back_image_url: string | null
          created_at: string
          distribution_type_id: string
          front_image_url: string
          id: string
          is_double_sided: boolean | null
          is_horizontal: boolean | null
          name: string
          primary_group_id: string
          rarity: Database["public"]["Enums"]["card_rarity"]
          release_id: string | null
          search_vector: unknown
          submission_id: string | null
        }
        Insert: {
          back_image_url?: string | null
          created_at?: string
          distribution_type_id: string
          front_image_url: string
          id?: string
          is_double_sided?: boolean | null
          is_horizontal?: boolean | null
          name: string
          primary_group_id: string
          rarity: Database["public"]["Enums"]["card_rarity"]
          release_id?: string | null
          search_vector?: unknown
          submission_id?: string | null
        }
        Update: {
          back_image_url?: string | null
          created_at?: string
          distribution_type_id?: string
          front_image_url?: string
          id?: string
          is_double_sided?: boolean | null
          is_horizontal?: boolean | null
          name?: string
          primary_group_id?: string
          rarity?: Database["public"]["Enums"]["card_rarity"]
          release_id?: string | null
          search_vector?: unknown
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photocards_distribution_type_id_fkey"
            columns: ["distribution_type_id"]
            isOneToOne: false
            referencedRelation: "distribution_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_primary_group_id_fkey"
            columns: ["primary_group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_primary_group_id_fkey"
            columns: ["primary_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
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
            foreignKeyName: "photocards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "photocard_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      photocards_idol: {
        Row: {
          card_id: string
          created_at: string
          id: number
          idol_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: number
          idol_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: number
          idol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photocards_subject_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "photocards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_subject_idol_id_fkey"
            columns: ["idol_id"]
            isOneToOne: false
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
        ]
      }
      photocards_modifiers_global: {
        Row: {
          card_id: string
          created_at: string
          id: number
          modifier_id: number
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: number
          modifier_id: number
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: number
          modifier_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photocards_modifiers_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "photocards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photocards_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "global_card_modifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned_until: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          preferred_currency: string | null
          role: Database["public"]["Enums"]["roles"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          preferred_currency?: string | null
          role?: Database["public"]["Enums"]["roles"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banned_until?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          preferred_currency?: string | null
          role?: Database["public"]["Enums"]["roles"] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          category: Database["public"]["Enums"]["release_category"]
          created_at: string
          group_id: string
          id: string
          release_date: string | null
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["release_category"]
          created_at?: string
          group_id: string
          id?: string
          release_date?: string | null
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["release_category"]
          created_at?: string
          group_id?: string
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
      releases_idol: {
        Row: {
          created_at: string
          id: number
          idol_id: string
          releases_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          idol_id: string
          releases_id: string
        }
        Update: {
          created_at?: string
          id?: number
          idol_id?: string
          releases_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_era_idol_id_fkey"
            columns: ["idol_id"]
            isOneToOne: false
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_era_releases_id_fkey"
            columns: ["releases_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collection: {
        Row: {
          acquired_at: string | null
          acquired_currency:
            | Database["public"]["Enums"]["acquired_currency"]
            | null
          acquired_price: number | null
          card_id: string
          condition: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_verified: boolean | null
          notes: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          acquired_at?: string | null
          acquired_currency?:
            | Database["public"]["Enums"]["acquired_currency"]
            | null
          acquired_price?: number | null
          card_id: string
          condition?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_verified?: boolean | null
          notes?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          acquired_at?: string | null
          acquired_currency?:
            | Database["public"]["Enums"]["acquired_currency"]
            | null
          acquired_price?: number | null
          card_id?: string
          condition?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_verified?: boolean | null
          notes?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_collection_photocard_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "photocards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collection_modifiers: {
        Row: {
          created_at: string
          id: number
          modifier_id: number
          user_collection_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          modifier_id: number
          user_collection_id: string
        }
        Update: {
          created_at?: string
          id?: never
          modifier_id?: number
          user_collection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collection_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "local_collection_modifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_collection_modifiers_user_collection_id_fkey"
            columns: ["user_collection_id"]
            isOneToOne: false
            referencedRelation: "user_collection"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wishlist: {
        Row: {
          card_id: string
          created_at: string
          id: number
          priority: Database["public"]["Enums"]["wishlist_priority"]
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: number
          priority?: Database["public"]["Enums"]["wishlist_priority"]
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: number
          priority?: Database["public"]["Enums"]["wishlist_priority"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wishlist_card_id_fkey"
            columns: ["card_id"]
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
      acquired_currency: "IDR" | "KRW" | "USD" | "EUR"
      action: "ban" | "unban"
      appel_status: "approved" | "rejected" | "pending"
      card_rarity: "N" | "R" | "SR" | "SSR" | "UR"
      card_status: "pending" | "rejected" | "accepted"
      group_status: "Active" | "Hiatus" | "Disbanded"
      release_category: "Album" | "Merch" | "Event" | "Membership"
      roles: "admin" | "user"
      scope: "local" | "global" | "both"
      subject_type: "Solo" | "Unit" | "Group" | "Multi" | "Mascot Pet"
      wishlist_priority: "high" | "medium" | "low"
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
      acquired_currency: ["IDR", "KRW", "USD", "EUR"],
      action: ["ban", "unban"],
      appel_status: ["approved", "rejected", "pending"],
      card_rarity: ["N", "R", "SR", "SSR", "UR"],
      card_status: ["pending", "rejected", "accepted"],
      group_status: ["Active", "Hiatus", "Disbanded"],
      release_category: ["Album", "Merch", "Event", "Membership"],
      roles: ["admin", "user"],
      scope: ["local", "global", "both"],
      subject_type: ["Solo", "Unit", "Group", "Multi", "Mascot Pet"],
      wishlist_priority: ["high", "medium", "low"],
    },
  },
} as const
