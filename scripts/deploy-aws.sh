#!/bin/bash
backup_root_name='_backup'
date=$(date +%Y_%m_%d_%H_%M_%S)
backup_folder="/${backup_root_name}/${date}"
region=[your-region]
bucket=s3://[your-bucket]
local_folder=./dist

printf "backing up existing site to $backup_folder...\n"

aws s3 cp "${bucket}" "${bucket}${backup_folder}" \
  --region $region \
  --exclude "${backup_root_name}/*" \
  --recursive \
  --quiet \
  # --dryrun

printf "\nbackup successful\n"

printf "\nbuilding and syncing $local_folder to s3...\n"

gulp build && \
aws s3 sync $local_folder $bucket \
  --region $region \
  --delete \
  --exclude "${backup_root_name}/*" \
  # --quiet \
  # --dryrun

printf "\nsite backed up and deployed!\n"
