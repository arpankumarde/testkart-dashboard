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
}
