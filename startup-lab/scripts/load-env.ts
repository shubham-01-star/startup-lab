type ProcessWithEnvLoader = typeof process & {
    loadEnvFile?: (path?: string) => void;
};

export function loadScriptEnv(): void {
    const processWithEnvLoader = process as ProcessWithEnvLoader;

    if (typeof processWithEnvLoader.loadEnvFile !== "function") {
        return;
    }

    for (const envFile of [".env.local", ".env"]) {
        try {
            processWithEnvLoader.loadEnvFile(envFile);
        } catch (error) {
            const envError = error as NodeJS.ErrnoException;

            if (envError.code !== "ENOENT") {
                throw error;
            }
        }
    }
}
