<?php
return [

    /*
    |----------------------------------------------------------------------
    | Laravel CORS Configuration
    |----------------------------------------------------------------------
    |
    | Here you may configure your settings for Cross-Origin Resource Sharing
    | (CORS). This determines what cross-origin requests are allowed to your
    | application. By default, all domains are allowed.
    |
    */

    'paths' => ['api/*', '/devices/*'],

    'allowed_methods' => ['*'],  // Permet toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    'allowed_origins' => ['http://127.0.0.1:8080'], // URL du frontend
    'allowed_headers' => ['*'],  // Permet tous les en-têtes

    'exposed_headers' => [],  // Si tu veux exposer certains en-têtes à l'application cliente

    'max_age' => 0,  // Temps (en secondes) que les résultats d'une requête CORS peuvent être mis en cache

    'supports_credentials' => false,  // Si tu veux que les cookies et l'authentification soient pris en compte
];
