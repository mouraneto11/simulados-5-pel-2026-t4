# Simulados CFSD 2026.2 - CBMAP

Aplicativo web progressivo (PWA) desenvolvido para treinamento e aplicação de simulados técnicos voltados aos alunos do Curso de Formação de Soldados (CFSD) do Corpo de Bombeiros Militar do Amapá (CBMAP), especificamente o 5º Pelotão (CFSD 2026.2).

## Funcionalidades

*   **Progressive Web App (PWA):** Instalação direta no dispositivo móvel (via prompt nativo do navegador) e suporte 100% offline (Cache-First). Essencial para uso em ambientes sem cobertura de internet.
*   **Múltiplos Simulados:** Cada prova vive em seu próprio arquivo JSON dentro de `simulados/`, com busca e paginação para localizar rapidamente o simulado desejado, e um link único e compartilhável por simulado (`?simulado=<id>`).
*   **Cronômetro Operacional:** Contagem regressiva padronizada de 30 minutos, com alerta visual tático nos últimos 5 minutos.
*   **Métricas e Avaliação:** Cálculo automático da nota (0 a 10) ao término da prova, com relatórios de acertos e erros.
*   **Gabarito de Bolso (Impressão):** Cada simulado pode ser impresso como uma folha A4 com cartõezinhos de corte contendo pergunta resumida + resposta certa, para estudo rápido durante intervalos.
*   **Padrão Visual:** Interface baseada em Dark Mode e Glassmorphism, otimizada para legibilidade e ergonomia em dispositivos móveis.

## Tecnologias Utilizadas

*   HTML5 Semântico
*   CSS3 (Vanilla CSS - sem frameworks externos)
*   JavaScript (Vanilla JS - lógica de negócio e manipulação do DOM)
*   Service Workers & Web App Manifest (PWA)

## Como Executar Localmente

1.  Clone o repositório.
2.  Inicie um servidor web local na raiz do projeto. Exemplos:
    *   Python: `python -m http.server 8080`
    *   Node.js (http-server): `npx http-server -p 8080`
    *   VS Code: Utilize a extensão "Live Server".
3.  Acesse `http://localhost:8080` no navegador.

## Estrutura de Arquivos

*   `index.html`: Estrutura principal da interface.
*   `style.css`: Regras de estilização e padrão visual.
*   `app.js`: Motor lógico do aplicativo (timer, controle de questões, pontuação, busca/paginação de simulados).
*   `simulados/`: Banco de dados das provas — um arquivo JSON por simulado, listados em `simulados/manifest.json`.
*   `manifest.json`: Arquivo de configuração para instalação do PWA.
*   `sw.js`: Service Worker com estratégia de Cache-First para funcionamento offline.

## Atualização de Banco de Dados (Simulados)

Para inserir uma nova prova:

1.  Crie um novo arquivo em `simulados/<id-do-simulado>.json`, respeitando a estrutura de ID, Título, Texto da questão, Opções (A a E) e o índice da Resposta Correta (0 a 4).
2.  Adicione o nome do arquivo à lista em `simulados/manifest.json`.
3.  Inclua o caminho do novo arquivo em `ASSETS_TO_CACHE` no `sw.js` (e incremente `CACHE_NAME`) para que ele fique disponível offline.


