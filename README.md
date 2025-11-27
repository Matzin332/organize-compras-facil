# Compras Organizadas "Compras simples, vida organizada!"

## Integrantes
- Matheus Alexandre
- William Magalhães
- Davi Augusto
- Anny Saldanha
- Denny Junio
- Líder: Matheus Alexandre 

## Problema
Pessoas frequentemente esquecem o que precisam comprar no mercado, o que resulta em desperdício de alimentos e gastos desnecessários, dificultando um melhor controle do consumo familiar.

## Cliente-alvo
Famílias e consumidores domésticos que desejam praticidade, organização e menos desperdício.

## Solução Proposta
Um Progressive Web App (PWA) simples, leve e acessível, que permite:
- Criação de listas de compras por categoria (alimentos, limpeza, higiene).
- Registro de compras com data, permitindo acompanhar hábitos de consumo.
- Questionário rápido após determinado período para identificar itens desperdiçados e motivo (estragou, comprou demais, esqueceu de usar).
- Relatórios simples mostrando os itens mais desperdiçados e causas do desperdício.
- Funcionalidade offline-first para uso dentro do mercado.
- Instalação direta como PWA (leve e rápido).

## Diferenciais
- Minimalista e simples (sem propagandas, sem excesso de funções).
- Funciona sem internet e sem cadastro obrigatório.
- Adaptado à realidade brasileira.
- Foco no desperdício: coleta informações do usuário e gera insights úteis.

## ODS 12 – Consumo e Produção Responsáveis
Meta 12.3: até 2030, reduzir pela metade o desperdício de alimentos per capita mundial, em nível de varejo e do consumidor, e reduzir as perdas de alimentos ao longo das cadeias de produção e abastecimento.

## Entregáveis
- Documento de requisitos + protótipo de alta fidelidade.
- MVP funcional (listas + questionário + relatórios).
- Relatório técnico detalhado.
- Defesa e apresentação final.

## Conclusão
A solução SmartGroceries é a resposta prática e inovadora para o problema da falta de organização nas compras domésticas, que gera desperdício e gastos desnecessários. Com um PWA leve e acessível, oferecemos praticidade para o usuário, redução de desperdícios e mais controle financeiro para as famílias. O foco inicial será em funcionalidades essenciais e de fácil uso, para gerar impacto imediato na vida do usuário.

## Tecnologias Utilizadas

- **Vite** - Build tool rápido
- **React** - Biblioteca JavaScript para interfaces
- **TypeScript** - JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis
- **React Router** - Roteamento para aplicações React
- **React Query** - Gerenciamento de estado de servidor

## Funcionalidades

- Lista de compras organizada por categorias
- Relatórios de desperdício
- Interface responsiva e acessível
- Suporte a Progressive Web App (PWA)
- Tema claro/escuro

## Como executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd organize-compras-facil
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:8080](http://localhost:8080) no navegador.

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria uma build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React
├── hooks/          # Hooks customizados
├── lib/            # Utilitários
├── pages/          # Páginas da aplicação
├── types/          # Definições de tipos TypeScript
└── utils/          # Funções utilitárias
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está sob a licença MIT.
