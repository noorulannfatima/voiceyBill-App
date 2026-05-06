declare module 'lamejs' {
  const lame: any;
  export default lame;
}

declare module 'ffmpeg-kit-react-native' {
  const content: any;
  export = content;
}

declare module 'expo-file-system/legacy' {
  export const EncodingType: any;
  export const cacheDirectory: string;
  export function readAsStringAsync(uri: string, options?: any): Promise<string>;
  export function writeAsStringAsync(uri: string, data: string, options?: any): Promise<void>;
  export function deleteAsync(uri: string, options?: any): Promise<void>;
  export function makeDirectoryAsync(path: string, options?: any): Promise<void>;
  const FileSystem: any;
  export default FileSystem;
}

declare module 'expo-file-system' {
  export const EncodingType: any;
  export const cacheDirectory: string;
  export function readAsStringAsync(uri: string, options?: any): Promise<string>;
  export function writeAsStringAsync(uri: string, data: string, options?: any): Promise<void>;
  export function deleteAsync(uri: string, options?: any): Promise<void>;
  const FileSystem: any;
  export default FileSystem;
}
