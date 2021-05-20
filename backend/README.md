# Back End

API Server

## Prerequisites 
1. Node (12.17.0)
2. NPM (6.14.4)
3. Docker (19.03.8)


#### Installing Node/Npm
- Follow Guide from [https://nodejs.org/en/](https://nodejs.org/en/)


#### Installing Docker/DockerCompose
- [Install Docker](https://docs.docker.com/install/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

## Installation/Setup Application
1. Clone the repository
```shell script
$ git clone https://github.com/600maan/corpus-app-api.git
````
2. Copy `.env.example` to `.env`
```shell script
$ cp .env.example .env
```
3. Update `.env` as per your configuration

4. Install dependencies
```shell script
$ npm install
```
5. Start API Server
```shell script
$ npm start
```
6. Run Unit Test
```shell script
$ npm run test
```
