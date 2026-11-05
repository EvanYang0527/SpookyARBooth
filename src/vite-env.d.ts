/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Set to "true" to enforce login even in dev mode
  readonly VITE_REQUIRE_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
