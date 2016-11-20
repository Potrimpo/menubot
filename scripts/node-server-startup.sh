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
sudo nano /etc/nginx/sites-available/default

### somehow type this shit
server {
    listen 80;

    server_name menubot.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
### then exit the file

sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo systemctl stop nginx
sudo letsencrypt certonly --standalone
# enter domain name -- menubot.xyz

sudo nano /etc/nginx/sites-enabled/default

### replace file contents with below, replacing [internal ip]

# HTTP - redirect all requests to HTTPS:
server {
        listen 80;
        return 301 https://$host$request_uri;
}

# HTTPS - proxy requests on to local Node.js app:
server {
        listen 443;
        server_name menubot.xyz;

        ssl on;
        # Use certificate and key provided by Let's Encrypt:
        ssl_certificate /etc/letsencrypt/live/menubot.xyz/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/menubot.xyz/privkey.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

        # Pass requests for / to localhost:3000:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://[INTERNAL IP]:3000/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
}

sudo nginx -t
sudo systemctl start nginx
sudo crontab -e

### add lines

30 2 * * 1 /usr/bin/letsencrypt renew >> /var/log/le-renew.log
35 2 * * 1 /bin/systemctl reload nginx

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
