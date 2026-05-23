export type UserRole = "student" | "admin";

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
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          email?: string;
          role?: UserRole;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          subject: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          subject?: string | null;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          subject?: string | null;
          is_published?: boolean;
          created_by?: string | null;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          prompt: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          prompt: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          prompt?: string;
          position?: number;
        };
        Relationships: [];
      };
      options: {
        Row: {
          id: string;
          question_id: string;
          label: string;
          is_correct: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          label: string;
          is_correct?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          label?: string;
          is_correct?: boolean;
          position?: number;
        };
        Relationships: [];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          answers: Json;
          score: number;
          total_questions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          answers?: Json;
          score?: number;
          total_questions?: number;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      scores: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          quiz_id: string;
          value: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          quiz_id: string;
          value: number;
          total: number;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type QuizSummary = Database["public"]["Tables"]["quizzes"]["Row"] & {
  questions: { id: string }[];
};

export type QuizQuestion = Database["public"]["Tables"]["questions"]["Row"] & {
  options: Database["public"]["Tables"]["options"]["Row"][];
};

export type QuizWithQuestions = Database["public"]["Tables"]["quizzes"]["Row"] & {
  questions: QuizQuestion[];
};
