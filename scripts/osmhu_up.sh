#!/bin/bash
cd ~/w/osmhu

# Fully synced dirs to upload
for i in build config css includes kepek node_modules query
do
	rsync --progress -v -r -t --exclude '.svn' --exclude '.bin' "$i" c64:w/osmhu/
done

# files to up
rsync favicon.ico lib.php terkep.php validate*.php c64:w/osmhu/

# HTML
rsync *.shtml *.xml c64:w/osmhu/

# To clean up run this with no dry: be careful.
#rsync -rtv --progress --delete --dry-run node_modules/ c64:w/osmhu/node_modules/
