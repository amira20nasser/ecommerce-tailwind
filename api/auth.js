async function login(username, password) {
    try {
        console.log(username);
        console.log(password);
        let headers = {
            'Content-Type': 'application/json'
        };
        let body = JSON.stringify({
            username: username,
            password: password,
            expiresInMins: 60,
        });
        let res = await fetch(
            "https://dummyjson.com/auth/login",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                // credentials: 'include'
            });
        let data = await res.json();
        return data;
    } catch (error) {
        console.error("Login: " + error);
        throw error;
    }
}

async function refreshUserToken(refreshToken) {
    try {
        let res = await fetch('https://dummyjson.com/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refreshToken: refreshToken
            }),
            credentials: 'include'
        });
        let data = await res.json();
        return data;
    } catch (error) {
        console.error("refreshToken: " + error);
        throw error;
    }
}

async function getCurrentUser(accessToken) {
    try {
        let res = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        let data = await res.json();
        return data;
    } catch (error) {
        console.error("getCurrentUser: " + error);
        throw error;
    }
}
export { login, refreshUserToken, getCurrentUser }