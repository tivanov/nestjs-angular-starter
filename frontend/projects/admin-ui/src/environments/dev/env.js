(function (window) {
    window.__env = window.__env || {};

    // API url
    window.__env.apiUrl = 'http://localhost:8200/v1';

    // Environment
    window.__env.environment = 'development';

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));
