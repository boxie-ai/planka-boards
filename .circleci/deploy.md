# Env Vars

```sh
export BASE_URL='http://localhost:1337'
export DATABASE_URL='postgres://postgres:bdN4qLywokhwwoFKqTcN@planka-postgres.ct0m8cusowhq.us-east-1.rds.amazonaws.com:5432/planka'
export SECRET_KEY='8b7fb48fa5325bacbf772556e28a5401a66a3bd8f1901257861b5e1f5269999141f8cd9f4cabee1b0bb25cdd1a113f2d1d8ddd25de863cab92ddafa4ec1e382c'
# export TRUST_PROXY='0'
# export TOKEN_EXPIRES_IN='3'
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

docker build . -t planka-boards
docker run \
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

```sh
export AWS_ACCOUNT_NUMBER=673666028488
export AWS_REGION=us-east-1
export AWS_PROFILE=boxie-prod
export AWS_ECR_REPOSITORY_NAME=boxie/planka-boards

# authentication in AWS
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com

# build image with the proper tag
docker build -t ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${AWS_ECR_REPOSITORY_NAME}:latest .

# upload using aws cli
docker push ${AWS_ACCOUNT_NUMBER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${AWS_ECR_REPOSITORY_NAME}:latest
```

RDS Postgres

```sh
AWS RDS planka-db
master username: postgres
master password: bdN4qLywokhwwoFKqTcN
# postgres://<username>:<password>@<database_endpoint>/<database_name>
```


# EC2 (a la mala)

## Connect vía ssh

```sh
cd ~/.ssh
export EC2_PUBLIC_DNS=ec2-44-204-250-69.compute-1.amazonaws.com
ssh -o 'IdentitiesOnly yes' -i "planca-ec2-key.pem" ec2-user@${EC2_PUBLIC_DNS}

## Setup de instance

```sh
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
exit
# reconnect
docker ps
```

## Aws cli configure

export DEFAULT_REGION=us-east-1

```sh
aws configure set aws_access_key_id ${CI_ACCESS_KEY}
aws configure set aws_secret_access_key ${CI_SECRET_ACCESS_KEY}
aws configure set region ${DEFAULT_REGION}
aws configure set output json
```

## Run de docker container

```sh
# set Docker container url as env variable
export PLANKA_BOARDS_DOCKER_IMAGE_URL=$(aws ecr describe-repositories | jq '.repositories[] | select(.repositoryName == "boxie/planka-boards") | .repositoryUri' -r)
export BOXIE_ECR_REGISTRY_ID=$(aws ecr describe-repositories | jq '.repositories[] | select(.repositoryName == "boxie/planka-boards") | .registryId' -r)

# usa las credenciales de aws para iniciar sesión en docker
aws ecr get-login-password | docker login --username AWS --password-stdin ${BOXIE_ECR_REGISTRY_ID}.dkr.ecr.us-east-1.amazonaws.com


# trae la última versión de la imagen
docker pull ${PLANKA_BOARDS_DOCKER_IMAGE_URL}:latest

# exporta variables de entorno
# export BASE_URL='http://boards1.boxie.ai'
export BASE_URL='http://44.204.250.69'
export DATABASE_URL='postgres://postgres:bdN4qLywokhwwoFKqTcN@planka-postgres.ct0m8cusowhq.us-east-1.rds.amazonaws.com:5432/planka'
export SECRET_KEY='8b7fb48fa5325bacbf772556e28a5401a66a3bd8f1901257861b5e1f5269999141f8cd9f4cabee1b0bb25cdd1a113f2d1d8ddd25de863cab92ddafa4ec1e382c'
export TRUST_PROXY='0'
export TOKEN_EXPIRES_IN='3'
export DEFAULT_ADMIN_EMAIL='admin@boxie.ai'
export DEFAULT_ADMIN_PASSWORD='zaWDMPVL5747'
export DEFAULT_ADMIN_NAME='Admin'
export DEFAULT_ADMIN_USERNAME='admin'


# arranca el contenedor
docker run \
  -e BASE_URL=$BASE_URL \
  -e DATABASE_URL=${DATABASE_URL} \
  -e SECRET_KEY=${SECRET_KEY} \
  -e TRUST_PROXY=${TRUST_PROXY} \
  -e TOKEN_EXPIRES_IN=${TOKEN_EXPIRES_IN} \
  -e DEFAULT_ADMIN_EMAIL=${DEFAULT_ADMIN_EMAIL} \
  -e DEFAULT_ADMIN_PASSWORD=${DEFAULT_ADMIN_PASSWORD} \
  -e DEFAULT_ADMIN_NAME=${DEFAULT_ADMIN_NAME} \
  -e DEFAULT_ADMIN_USERNAME=${DEFAULT_ADMIN_USERNAME} \
  -p 80:1337 \
  --detach \
  ${PLANKA_BOARDS_DOCKER_IMAGE_URL}
```
