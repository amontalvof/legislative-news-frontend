export const fetchWithoutToken = async <T, U>(
    endpoint: string,
    data?: T,
    method = 'GET'
): Promise<U> => {
    let resp;
    if (method === 'GET') {
        resp = await fetch(endpoint);
    } else {
        resp = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }
    if (resp.status === 401) {
        localStorage.removeItem('token');
    }
    if (!resp.ok) {
        const { message } = await resp.json();
        throw new Error(message);
    }
    return resp.json();
};
