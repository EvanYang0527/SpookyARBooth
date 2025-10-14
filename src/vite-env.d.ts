/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GOOGLE_API_KEY?: string;
  readonly GOOGLE_API_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
