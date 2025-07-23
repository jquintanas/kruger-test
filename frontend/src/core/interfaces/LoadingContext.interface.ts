export interface LoadingContextProps {
  loading: boolean;
  loadingText?: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}