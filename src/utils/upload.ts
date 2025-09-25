import { AxiosInstance } from 'axios';

interface UploadOptions {
  request: AxiosInstance;
}

interface UploadParams {
  action: string;
  method: string;
  file: File;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  onProgress?: (progress: number) => void;
}

export const customRequest = ({ request }: UploadOptions) => ({
  action,
  method,
  file,
  onSuccess,
  onError,
  onProgress,
}: UploadParams) => {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: action,
    method,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  })
    .then((response) => {
      onSuccess(response.data);
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
      throw error;
    });
};