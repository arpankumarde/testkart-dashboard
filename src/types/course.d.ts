export interface Course {
  id: number;
  academy_id: number;
  exam_id: number | null;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  discount: number;
  discount_type: string | null;
  original_price: number | null;
  is_published: boolean;
  module_based: boolean;
  created_at: string;
  updated_at: string;
  contents: Content[];
  modules: any[];
}

export interface Content {
  id: number;
  course_id: number;
  module_id: number | null;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  pdf_url: string | null;
  duration_seconds: number;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
}
