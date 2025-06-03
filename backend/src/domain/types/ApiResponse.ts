export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
}

export interface ApiError {
  success: false;
  message?: string;
  error?: string;
}
