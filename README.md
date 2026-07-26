# Simulados CFSD 2026.2 - CBMAP

Aplicativo web progressivo (PWA) desenvolvido para treinamento e aplicação de simulados técnicos voltados aos alunos do Curso de Formação de Soldados (CFSD) do Corpo de Bombeiros Militar do Amapá (CBMAP), especificamente o 5º Pelotão (CFSD 2026.2).

## Funcionalidades

*   **Progressive Web App (PWA):** Instalação direta no dispositivo móvel e suporte 100% offline (Cache-First). Essencial para uso em ambientes sem cobertura de internet.
*   **Múltiplos Simulados:** Sistema flexível que permite a seleção e execução de diferentes provas através da estrutura de dados em `simulados.json`.
*   **Cronômetro Operacional:** Contagem regressiva padronizada de 30 minutos, com alerta visual tático nos últimos 5 minutos.
*   **Métricas e Avaliação:** Cálculo automático da nota (0 a 10) ao término da prova, com relatórios de acertos e erros.
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
*   `app.js`: Motor lógico do aplicativo (timer, controle de questões, pontuação).
*   `simulados.json`: Banco de dados das questões e provas.
*   `manifest.json`: Arquivo de configuração para instalação do PWA.
*   `sw.js`: Service Worker com estratégia de Cache-First para funcionamento offline.

## Atualização de Banco de Dados (Simulados)

Para inserir novas provas, edite o arquivo `simulados.json` adicionando um novo objeto ao array principal, respeitando a estrutura de ID, Título, Texto da questão, Opções (A a E) e o índice da Resposta Correta (0 a 4).


