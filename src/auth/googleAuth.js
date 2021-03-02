let auth;

function setAuth(auth) {
    this.auth = auth;
}

function getAuth() {
    return this.auth;
}

module.exports = { getAuth, setAuth }