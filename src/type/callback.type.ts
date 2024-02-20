

export interface CallbackState {
    callbackKeys: {
        filter: Record<number, string[]>;
        data: Record<number, string[]>;
        interaction: Record<number, string[]>;
    };
    callbackValues: Record<string, unknown>;
}