import { AxiosInstance } from 'axios';

interface CustomRequestOptions {
  request: AxiosInstance;
}

interface UploadOptions {
  action: string;
  method: string;
  file: File;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  onProgress?: (event: { percent: number }) => void;
}

export const customRequest = ({ request }: CustomRequestOptions) => {
  return async (options: UploadOptions) => {
    const { action, file, onSuccess, onError, onProgress } = options;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await request.post(action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ percent });
          }
        },
      });
      
      onSuccess(response.data);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };
};