# Planka
#### Elegant open source project tracking.

![David (path)](https://img.shields.io/github/package-json/v/plankanban/planka) ![Docker Pulls](https://img.shields.io/badge/docker_pulls-5M%2B-%23066da5) ![GitHub](https://img.shields.io/github/license/plankanban/planka)

![](https://raw.githubusercontent.com/plankanban/planka/master/demo.gif)

[**Client demo**](https://plankanban.github.io/planka) (without server features).

## Features

- Create projects, boards, lists, cards, labels and tasks
- Add card members, track time, set due dates, add attachments, write comments
- Markdown support in card description and comments
- Filter by members and labels
- Customize project backgrounds
- Real-time updates
- Internal notifications
- Multiple interface languages
- Single sign-on via OpenID Connect

## How to deploy Planka

There are many ways to install Planka, [check them out](https://docs.planka.cloud/docs/intro).

For configuration, please see the [configuration section](https://docs.planka.cloud/docs/category/configuration).

## Mobile app

Here is the [mobile app repository](https://github.com/LouisHDev/planka_app) maintained by the community, where you can build an app for iOS and Android.

Alternatively, you can download the [Android APK](https://github.com/LouisHDev/planka_app/releases/latest/download/app-release.apk) directly.

If you have an iOS device and would like to test the app, you can join [TestFlight](https://testflight.apple.com/join/Uwn41eY4) (limited to 200 participants).

## Contact

- If you want to get a hosted version of Planka, you can contact us via email contact@planka.cloud
- For any security issues, please do not create a public issue on GitHub, instead please write to security@planka.cloud

We do NOT offer any public support via email, please use GitHub.

## Development

See the [development section](https://docs.planka.cloud/docs/Development).

## Tech stack

- React, Redux, Redux-Saga, Redux-ORM, Semantic UI React, react-beautiful-dnd
- Sails.js, Knex.js
- PostgreSQL

## License

Planka is [AGPL-3.0 licensed](https://github.com/plankanban/planka/blob/master/LICENSE).

## Contributors

[![](https://contrib.rocks/image?repo=plankanban/planka)](https://github.com/plankanban/planka/graphs/contributors)

# Env Vars

```sh
export BASE_URL='http://localhost:1337'
export DATABASE_URL='postgres://postgres:bdN4qLywokhwwoFKqTcN@planka-postgres.ct0m8cusowhq.us-east-1.rds.amazonaws.com:5432/planka'
export SECRET_KEY='random-secret-key-nobody-cares-about'
export TRUST_PROXY='0'
export TOKEN_EXPIRES_IN='3'
export DEFAULT_ADMIN_EMAIL='admin@boxie.ai'
export DEFAULT_ADMIN_PASSWORD='zaWDMPVL5747'
export DEFAULT_ADMIN_NAME='Admin'
export DEFAULT_ADMIN_USERNAME='admin'
```

# Local run

```sh
podman build . -t planka-boards
podman run \
  -e BASE_URL=$BASE_URL \
  -e DATABASE_URL=${DATABASE_URL} \
  -e SECRET_KEY=${SECRET_KEY} \
  -e TRUST_PROXY=${TRUST_PROXY} \
  -e TOKEN_EXPIRES_IN=${TOKEN_EXPIRES_IN} \
  -e DEFAULT_ADMIN_EMAIL=${DEFAULT_ADMIN_EMAIL} \
  -e DEFAULT_ADMIN_PASSWORD=${DEFAULT_ADMIN_PASSWORD} \
  -e DEFAULT_ADMIN_NAME=${DEFAULT_ADMIN_NAME} \
  -e DEFAULT_ADMIN_USERNAME=${DEFAULT_ADMIN_USERNAME} \
  -p 1337:1337 \
  planka-boards
```

# Deploy to AWS ECS

## Upload image to AWS ECR

```sh
export AWS_ACCOUNT_NUMBER=673666028488
export AWS_REGION=us-east-1
export AWS_PROFILE=boxie-prod
export AWS_ECR_REPOSITORY_NAME=boxie/planka-boards

# authentication in AWS
aws ecr get-login-password --region ${AWS_REGION} | podman login --username AWS --password-stdin ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com

# build image with the proper tag
podman build -t ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${AWS_ECR_REPOSITORY_NAME}:latest .

# upload using aws cli
podman push ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${AWS_ECR_REPOSITORY_NAME}:latest
```

RDS Postgres

```sh
AWS RDS planka-db
master username: postgres
master password: bdN4qLywokhwwoFKqTcN
# postgres://<username>:<password>@<database_endpoint>/<database_name>
```
