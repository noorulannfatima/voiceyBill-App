import * as FileSystem from 'expo-file-system';

export type TranscodedFile = { uri: string; mime: string; name: string };

// Attempt to transcode an input audio file (e.g., M4A) to WAV/PCM using ffmpeg-kit-react-native if present.
// This helper avoids static imports so Expo Go can still build when ffmpeg-kit isn't installed.
export async function tryTranscodeM4AToWav(inputUri: string): Promise<TranscodedFile | null> {
  try {
    const dynamicRequire = (globalThis as any).require ? (globalThis as any).require : (eval('require') as any);
    const ffmpeg = dynamicRequire('ffmpeg-kit-react-native');
    const FFmpegKit = ffmpeg.FFmpegKit;
    const ReturnCode = ffmpeg.ReturnCode;

    // Ensure output dir exists
  const baseDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || 'file:///';
    const outDir = baseDir + 'transcoded/';
    try { await (FileSystem as any).makeDirectoryAsync(outDir, { intermediates: true }); } catch {}
    const outUri = `${outDir}voice-${Date.now()}.wav`;

    const inPath = inputUri.replace('file://', '');
    const outPath = outUri.replace('file://', '');
    const cmd = `-y -i "${inPath}" -ar 44100 -ac 1 -sample_fmt s16 -f wav "${outPath}"`;
    const session = await FFmpegKit.execute(cmd);
    const rc = await session.getReturnCode();
    if (ReturnCode.isSuccess(rc)) {
      return { uri: outUri, mime: 'audio/wav', name: 'recording.wav' };
    }
    return null;
  } catch {
    return null;
  }
}
