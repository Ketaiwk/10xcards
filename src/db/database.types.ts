export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      flashcard_sets: {
        Row: {
          ai_accepted_count: number | null;
          ai_edited_count: number | null;
          ai_generated_count: number | null;
          created_at: string;
          description: string | null;
          generation_duration: number;
          id: string;
          is_deleted: boolean | null;
          manual_count: number | null;
          name: string;
          source_text: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_accepted_count?: number | null;
          ai_edited_count?: number | null;
          ai_generated_count?: number | null;
          created_at?: string;
          description?: string | null;
          generation_duration?: number;
          id?: string;
          is_deleted?: boolean | null;
          manual_count?: number | null;
          name: string;
          source_text?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_accepted_count?: number | null;
          ai_edited_count?: number | null;
          ai_generated_count?: number | null;
          created_at?: string;
          description?: string | null;
          generation_duration?: number;
          id?: string;
          is_deleted?: boolean | null;
          manual_count?: number | null;
          name?: string;
          source_text?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcard_sets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcards: {
        Row: {
          answer: string;
          created_at: string;
          creation_type: Database["public"]["Enums"]["flashcard_creation_type"];
          id: string;
          is_deleted: boolean | null;
          question: string;
          set_id: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          creation_type: Database["public"]["Enums"]["flashcard_creation_type"];
          id?: string;
          is_deleted?: boolean | null;
          question: string;
          set_id: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          creation_type?: Database["public"]["Enums"]["flashcard_creation_type"];
          id?: string;
          is_deleted?: boolean | null;
          question?: string;
          set_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey";
            columns: ["set_id"];
            isOneToOne: false;
            referencedRelation: "flashcard_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          confirmed_at: string | null;
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          id: string;
        };
        Update: {
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      flashcard_creation_type: "ai_generated" | "ai_edited" | "manual";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      flashcard_creation_type: ["ai_generated", "ai_edited", "manual"],
    },
  },
} as const;
