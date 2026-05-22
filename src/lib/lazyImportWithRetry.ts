type ModuleLoader<T> = () => Promise<T>;

const retryStoragePrefix = "bw7:lazy-import-retry:";

function isChunkLoadError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|MIME type/i.test(
    message,
  );
}

export function lazyImportWithRetry<T>(
  loader: ModuleLoader<T>,
  retryKey: string,
): Promise<T> {
  return loader().catch((error) => {
    if (typeof window === "undefined" || !isChunkLoadError(error)) {
      throw error;
    }

    const storageKey = `${retryStoragePrefix}${retryKey}`;
    const alreadyRetried = window.sessionStorage.getItem(storageKey) === "1";

    if (alreadyRetried) {
      window.sessionStorage.removeItem(storageKey);
      throw error;
    }

    window.sessionStorage.setItem(storageKey, "1");
    window.location.reload();

    return new Promise<T>(() => undefined);
  });
}
