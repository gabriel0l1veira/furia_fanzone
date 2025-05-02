# Aplicativo de Chat ao Vivo da FURIA - README Técnico

## Overview

Este projeto é um aplicativo de chat ao vivo projetado especificamente para a comunidade da equipe FURIA. Ele permite que os usuários interajam em tempo real, assistam à transmissão ao vivo na Twitch e usem emojis personalizados dentro do chat. O aplicativo oferece uma experiência fluida e envolvente para que os fãs se conectem uns com os outros e com a equipe.

## Key Features

*   **Chat ao Vivo:** Os usuários podem enviar e receber mensagens de texto em tempo real, promovendo uma comunidade dinâmica e interativa.
*   **Integração com a Transmissão da Twitch:** A transmissão ao vivo da Twitch da FURIA é incorporada diretamente no aplicativo, permitindo que os usuários assistam e conversem simultaneamente.
*   **Suporte a Emojis Personalizados:** Melhore a comunicação com uma variedade de emojis personalizados, tornando as conversas mais expressivas e divertidas.
*   **Login com Apelido:** Os usuários podem fazer login usando o apelido escolhido, facilitando a identificação e a conexão com outras pessoas.
*   **Contato do WhatsApp:** Um link direto para o contato do WhatsApp da equipe FURIA está disponível para suporte adicional ou dúvidas.

## Technical Stack

*   **Next.js:** Utilizado por sua renderização do lado do servidor e capacidades eficientes de roteamento.
*   **React:** O framework principal para construir a interface do usuário com uma arquitetura baseada em componentes.
*   **TypeScript:** Garante a segurança de tipo e melhora a manutenção do código-base.

## Project Structure

O projeto segue uma organização baseada em componentes, facilitando o gerenciamento, a escalabilidade e a reutilização de elementos de UI. Os principais diretórios incluem:

*   **src/app:** Contém os principais pontos de entrada do aplicativo e as rotas das páginas.
*   **src/components:** Abriga todos os componentes de UI reutilizáveis, separados por funcionalidade.
*   **src/hooks:** Contém hooks personalizados do React para gerenciar o estado e a lógica do aplicativo.
*   **src/lib:** Inclui funções utilitárias e outras lógicas principais.
*   **src/services:** Inclui a lógica para integrações com outros serviços, por exemplo, twitch.
*   **src/ai:** Lógica para a integração de IA

## Code Quality

*   **Interfaces do TypeScript:** As interfaces são definidas em todo o projeto para garantir a segurança de tipo e impor estruturas de dados consistentes.
*   **Arquivos Tipados:** Todos os arquivos são escritos em TypeScript, fornecendo um ambiente de desenvolvimento robusto e previsível.

## Getting Started

Para explorar o código-base e começar, dê uma olhada em `src/app/page.tsx`. Este arquivo contém a implementação da página principal, incluindo a interface de chat e os componentes de interação do usuário.
