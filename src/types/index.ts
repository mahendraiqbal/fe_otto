export interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export interface GreetingCardState {
  text: string;
  image: string | null;
}
