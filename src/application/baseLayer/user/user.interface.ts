export interface User {
    id: string;
    username: string;
    password: string; // 数据加密存储
    createAt: string;
    updateAt: string;
}