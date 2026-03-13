export const postJson = async (url: string, payload: any): Promise<{ status: number; text: string }> => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload ?? {}),
    });
    return { status: res.status, text: await res.text() };
}