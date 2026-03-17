interface EnvType {
    VITE_SERVER_NAME: string;
}
export const EnvData: EnvType = {
    VITE_SERVER_NAME: import.meta.env.VITE_SERVER_NAME,
};
