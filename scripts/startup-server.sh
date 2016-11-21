!# /bin/bash

sudo -i
sudo -u pm2er -i
cd ~/menubot
sudo npm i
sudo ./build.sh
npm run prod
