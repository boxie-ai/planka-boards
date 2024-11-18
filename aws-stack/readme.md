# Planka AWS Stacks

## Configuration files

```sh
export AWS_PROFILE=boxie-prod
export CONFIGURATION_CLOUDFORMATION_FILES_BUCKET_NAME=cloudformation-planka
export AWS_DEFAULT_REGION=us-east-1

# create bucket
aws s3api create-bucket --bucket ${CONFIGURATION_CLOUDFORMATION_FILES_BUCKET_NAME} --region ${AWS_DEFAULT_REGION}

# copy files to bucket
aws s3 cp . s3://${CONFIGURATION_CLOUDFORMATION_FILES_BUCKET_NAME} --recursive --exclude ".git/*" --exclude README.md --exclude user_data.txt --exclude ".images/*"

# check files
aws s3 ls s3://cloudformation-planka

# get recomended ami details
aws ec2 describe-images --filters "Name=name,Values=al2023-ami-2023*" "Name=architecture,Values=x86_64" "Name=root-device-type,Values=ebs" "Name=virtualization-type,Values=hvm" --query "Images | sort_by(@, &CreationDate) | [-1]" --profile boxie-prod > aws-ami.json

# save ami id in env variable
export EC2_IAM_ID=$(jq '.ImageId' aws-ami.json -r)

# validate template
aws cloudformation validate-template --template-body file://root.yaml --profile boxie-prod --debug

# create stack in aws
export STACK_NAME=planka-stack
export KEY_FILE_NAME=planka-ec2-key
export BOXIE_HOSTED_ZONE_ID=Z03850243JY72J8U3JMYU
export BOXIE_DOMAIN_NAME=boxie.ai
export BOXIE_SUB_DOMAIN_NAME=boards

aws cloudformation create-stack \
  --stack-name ${STACK_NAME} \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --capabilities CAPABILITY_NAMED_IAM \
  --disable-rollback \
  --parameters \
    ParameterKey=PublicKeyMaterial,ParameterValue="$(cat ~/.ssh/${KEY_FILE_NAME}.pub)" \
    ParameterKey=HostedZoneId,ParameterValue=${BOXIE_HOSTED_ZONE_ID} \
    ParameterKey=AmiID,ParameterValue=${EC2_IAM_ID} \
    ParameterKey=DomainName,ParameterValue=${BOXIE_DOMAIN_NAME} \
    ParameterKey=SubDomainName,ParameterValue=${BOXIE_SUB_DOMAIN_NAME} \
    ParameterKey=EC2AvailabilityZone,ParameterValue=us-east-1c
    # ParameterKey=TemplateUrlBase,ParameterValue=file://s3://${CONFIGURATION_CLOUDFORMATION_FILES_BUCKET_NAME}
    # ParameterKey=UserData,ParameterValue="$(base64 -i user_data.txt)" \

```

## Referencias

- https://github.com/aws-cloudformation/aws-cloudformation-templates
- https://gitlab.com/Andr1500/cognito_alb_ec2
