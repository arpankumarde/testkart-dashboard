export interface Apiresponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
