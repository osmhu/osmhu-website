#!/usr/bin/env bash

# Script to initialize machine for development (run as normal user)

SOURCE_CODE_DIR="/srv/osmhu-website"


echo "Installing tab completion for npm..."
# source: https://docs.npmjs.com/cli/completion
if ! command -v npm &> /dev/null; then
	echo "ERROR! npm command could not be found. Exiting" >&2
	exit 1
fi
npm completion >> ~/.bashrc


echo "Installing watchexec for running commands on file change..."
if ! curl --silent --show-error https://webinstall.dev/watchexec | bash > /dev/null; then
	echo "ERROR! Failed to install watchexec. Exiting" >&2
	exit 1
fi


echo "Setting default chromedriver snap filepath for npm install chromedriver..."
{
	echo "# Set default chromedriver snap filepath for npm install chromedriver"
	echo "export CHROMEDRIVER_FILEPATH=\"/snap/bin/chromium.chromedriver\""
	echo "# End"
	echo ""
} >> ~/.bashrc


if [ "${SOURCE_CODE_DIR}" == "/srv/osmhu-website" ]; then
	echo "Setting default directory when connecting from vagrant ssh..."
	echo "cd ${SOURCE_CODE_DIR}" >> ~/.profile
fi


if [ ! -d "${SOURCE_CODE_DIR}/node_modules" ]; then
	echo "Installing npm packages needed by frontend..."
	cd "${SOURCE_CODE_DIR}" || exit
	make --silent npm-install-in-tmp
else
	echo "Skipping npm install, because node_modules already exists in source directory"
fi
