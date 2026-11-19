# awesome-3some-triscola

A web-based Briscola made by three deeply mentally unstable and unemployed  ♥ psychopaths ♥

## this is what we want to make ❤️

- we start with two players

- guyss we need someone to write the rules of briscola/triscola but since we start from two so we just make it 2 for now. Let's give this job to the italia.

- i want to add some senario to the project becuase my home uni asked us to do this(and this is kinda interesting):

    `I'm a happy uni student who is on a train going to my morning 8:15am fucking lecture. So to kill time i want to play a quick round briscola with my friend.`

    `So i clicked on the url to the awesome3some-triscola web. First it asks me to login, so i logged in. Then i can choose from either play with Robot or play with friends.`

    `After i clicked 'play with friends', web page ask me if i want to create a room or to join a room. Because i have played with Mario before, so the web remember the room we have created, which is called 'soy-milk'. So i just clicked the room, and i joined it. I sent a message to my frined so my friend also joined it. Then we started to play`

- so to start should what functions should we write first?

## Prerequisites

- [Bun](https://bun.com) 1.4 or newer (it is both the runtime and package manager).

## Install and configure

```bash
bun install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Set `BETTER_AUTH_SECRET` in `apps/server/.env` to a unique high-entropy value of at least 32 characters. A safe way to create it is:

```bash
openssl rand -base64 48
```

## Database

```bash
bun run auth:schema
bun run db:generate
bun run db:migrate
```

## Run

```bash
bun run dev
bun run dev:web
bun run dev:server
```

## Verification

```bash
bun run lint
bun run lint:fix
bun run check
bun run build
```
