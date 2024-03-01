#!/usr/bin/env bash

# Prepare distribution bundle (css and js will not be included, only static non-built assets)

output_dir=${1:-"distribution"}

# Remove files from previous builds
rm --recursive --force "${output_dir}"

mkdir --parents "${output_dir}"

# Copy all directories
mkdir --parents "${output_dir}/config" "${output_dir}/includes" "${output_dir}/js"
mkdir --parents "${output_dir}/kepek" "${output_dir}/query"
cp --recursive config "${output_dir}"
cp --recursive includes "${output_dir}"
rsync --archive kepek "${output_dir}" --exclude *.xcf
cp --recursive query "${output_dir}"

mkdir --parents "${output_dir}/css"
cp --recursive node_modules/leaflet/dist/images "${output_dir}/css"

# Copy root files
cp .htaccess "${output_dir}"
cp favicon.ico "${output_dir}"
cp lib.php "${output_dir}"
cp terkep.php "${output_dir}"
cp validatestreetnames.php "${output_dir}"

# Copy content html files
cp *.shtml "${output_dir}"

# Add read permission for other users (eg. www-data)
chmod --recursive o+r "${output_dir}"

# +X sets execute/search only if the file is a directory (or already has execute permission for some user)
chmod --recursive +X "${output_dir}"
