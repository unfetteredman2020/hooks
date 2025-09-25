import { AxiosInstance } from 'axios';

interface CustomRequestParams {
  request: AxiosInstance;
}

interface UploadParams {
  action: string;
  method: 'post' | 'put' | 'patch';
  file: File;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  onProgress?: (progress: { percent: number }) => void;
}

export const customRequest = ({ request }: CustomRequestParams) => {
  return async ({ action, method, file, onSuccess, onError, onProgress }: UploadParams) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await request({
        url: action,
        method,
        data: formData,
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
      } else {
        console.error('Upload failed:', error);
      }
    }
  };
};