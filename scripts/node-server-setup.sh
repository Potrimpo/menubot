#!/bin/bash

### NODEJS SERVER SETUP
sudo adduser pm2er
sudo usermod -aG sudo pm2er
sudo -i
sudo -u pm2er -i
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs build-essential letsencrypt
sudo git clone https://github.com/Potrimpo/menubot.git
cd menubot/
sudo npm i
sudo npm i pm2 webpack less less-plugin-clean-css -g
sudo ./build.sh
npm run prod
pm2 startup systemd

### NGINX SETUP
cd ~
sudo apt-get install nginx
sudo rm /etc/nginx/sites-available/default

sudo cp /home/pm2er/menubot/scripts/nginxConf1 /etc/nginx/sites-available/default

sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo systemctl stop nginx
sudo letsencrypt certonly --standalone
# enter domain name -- menubot.xyz

sudo nano /etc/nginx/sites-enabled/default
sudo cp /home/pm2er/menubot/scripts/nginxConf1 /etc/nginx/sites-available/default

sudo nginx -t
sudo systemctl start nginx

cd ~
crontab -l > mycron
echo "30 2 * * 1 /usr/bin/letsencrypt renew >> /var/log/le-renew.log" >> mycron
echo >> mycron
echo "35 2 * * 1 /bin/systemctl reload nginx" >> mycron
crontab mycron
rm mycron
sudo crontab -e

### REDIS SETUP
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
cp ./redis-server /usr/bin
cp ./redis-cli /usr/bin
sudo mkdir /etc/redis
sudo cp utils/redis_init_script /etc/init.d/redis_6379
sudo nano /etc/init.d/redis_6379

# Change `REDISPORT` to 6379

sudo cp redis.conf /etc/redis/6379.conf

sudo mkdir /var/redis/6379
sudo nano	/etc/redis/6379.conf

# Set daemonize to yes (by default it is set to no).
# Set the pidfile to /var/run/redis_6379.pid
# Change the port accordingly. In our example it is not needed as the default * port is already 6379.
# Set your preferred loglevel.
# Set the logfile to /var/log/redis_6379.log
# Set the dir to /var/redis/6379 (very important step!)

sudo update-rc.d redis_6379 defaults

# Run with `sudo /etc/init.d/redis_6379 start`
