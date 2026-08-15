const CACHE_NAME = 'cfsd-simulados-v4';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './simulados/manifest.json',
    './simulados/salvamento_aquatico.json',
    './simulados/simulado_lri_amapa_10.json',
    './simulados/simulado_defesa_civil_amapa.json',
    './icon-192.png',
    './icon-512.png'
];

// Install Event - Armazena em cache todos os arquivos necessários
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto - Adicionando assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // Ativa o service worker imediatamente
});

// Activate Event - Limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Estratégia rigorosa "Cache-First"
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Se encontrar no cache, retorna imediatamente
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Caso não encontre (ex: pdfs soltos ou atualizações), tenta a rede
                return fetch(event.request).then(response => {
                    return response;
                }).catch(() => {
                    // Sem internet e sem cache
                    console.log('Falha na rede e asset não encontrado no cache:', event.request.url);
                });
            })
    );
});
