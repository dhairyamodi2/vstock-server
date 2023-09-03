# NestJS Application Setup Guide 🚀

This document provides step-by-step instructions to set up the NestJS application locally.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Firebase Service Account Key](#firebase-service-account-key)
  - [Running the Application](#running-the-application)

## 🛠 Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn
- PostgreSQL/MySQL (local or remote)
- Firebase account

## 🔧 Setup

### Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-directory-name>
```
### Install Dependencies

```bash
npm install
npm install -g @nestjs/cli
```
or if you use yarn

```bash
yarn
yarn global add @nestjs/cli
```

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`environment`

`db_name`

`db_user`

`db_password`

`db_port`

`db_host`

`jwt_secret`

`jwt_expire`

`cloud_name`

`api_key`

`api_secret`

`PORT`

### Firebase Service Account Key

You would need firebase service account key to run this project


### Running the application

```bash
npm run start:dev
```
or if you use yarn

```bash
yarn start:dev
```

