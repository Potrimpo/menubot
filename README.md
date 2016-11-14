# Menubot


## DNS forwarding

### First time setup

Made using:
* https://cloud.google.com/dns/quickstart
* https://cloud.google.com/compute/docs/configure-instance-ip-addresses#reserve_new_static

##### Documentation begins
1. First, using Google Cloud services, create your project, server instance, and activate billing.
2. Buy a domain name, for example menubot.xyz
3. Acquire a static IP for the domain
    a. Assign an already existing static IP to the instance: https://console.cloud.google.com/networking/addresses/
    b. Reserve a new static IP for the domain: https://console.cloud.google.com/networking/addresses/add
4. Create a zone. A zone controls the DNS of a single domain name, like for example, menubot.xyz. We should already have a zone for Menubot.xyz. https://console.cloud.google.com/networking/dns/zones
5. Create an appropriate record in this zone, for the static IP you just created.
    a. If your IP address is in the form #.#.#.#, you have an IPv4 address and need to create an A record.
    b. If your IP address is in the format #:#:#:#:#:#:#:#, you have an IPv6 address and should create an AAAA record to point the domain to the IP address.
6. Create an appropriate CNAME. Click Add record set while in the Cloud Platform Console.
7. Under DNS Name, enter www.
8. Under Resource Record Type, choose CNAME.
9. Under Canonical name, enter the domain name, followed by a period. For example, “menubot.xyz.”
10. Click Create.
11. Now we must set our domain name on our domain name registration service (EG: Onlydomians, gandi.net) to point to google’s name servers. Log onto the service with which the domain was registered. You can find the logon for the Onlydomains account on the google doc: Business passwords.
12. Find the name servers for the zone we just created. These can be found as the data value for the automatically created “NS” entry.
13. Set the domain name on our domain name registration service to delegate to the name servers we found in the previous step.

##### Congratulations, you’re done. The changes should propagate in no more than 48 hours.



## Application server

### First time setup

Made using:
* https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
* https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-6-set-up-auto-renewal


##### Documentation begins
First create an Ubuntu 16 instance on Google Cloud.

```
cd ~
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
nano nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs build-essential letsencrypt
sudo git clone https://github.com/Potrimpo/menubot.git --branch ssl/tsl
cd menubot/
sudo npm i
sudo npm install -g pm2
pm2 start process.json
pm2 startup systemd
```

Enter the commands returned.

```
cd ~
sudo apt-get install nginx
sudo rm /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
```

Paste in the following text:

```
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
```

Write out with CTRL + O, then ENTER, then exit with CTRL + X

```
sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo systemctl stop nginx
sudo letsencrypt certonly --standalone
```

Enter the domain name as menubot.xyz

```
sudo nano /etc/nginx/sites-enabled/default
```

Remove the text there, and paste in the following text, with one alteration; change the placeholder [INTERNAL IP] to the server’s internal IP, found on the instances page on the Google Cloud console:

```
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
```

Write out with CTRL + O, then ENTER, then exit with CTRL + X

```
sudo nginx -t
sudo systemctl start nginx
sudo crontab -e
```

Add the following lines:

```
30 2 * * 1 /usr/bin/letsencrypt renew >> /var/log/le-renew.log
35 2 * * 1 /bin/systemctl reload nginx
```

Write out with CTRL + O, then ENTER, then exit with CTRL + X

Note that the application assumes the application server will be running on internal IP: 10.146.0.2 and the database server will be running on internal IP: 10.146.0.3 .
Check that this is the case on the Google Clould console instances page, and change the configuration in process.json .
Secondarily, the app must be configured to work with Facebook. This has been excluded from the documentation because we haven't done it yet.
##### Congratulations, you're done with setting up the application server. However, the database server still needs to be setup.


### Useful commands

##### To start PM2
```
cd [LOCATION OF MENUBOT DIRECTORY]/menubot
pm2 start process.json
```


##### To totally stop PM2
```
pm2 kill
```


##### To view logs
```pm2 logs --lines 1000```

> Streams new logs, and shows the previous 1000 lines of logs.


##### To remove previous logs, and only log new logs
```
pm2 kill
pm2 flush
sudo pm2 start process.json
pm2 logs --lines 1000
```

> It's very easy to mix up logs from previous runs of the application, as there isn't any visible break point separating the two. This may confuse you into thinking the errors of the previous run are still around. This prevents just such a mix up.


##### To clone a fresh branch from git
```
cd [LOCATION OF MENUBOT DIRECTORY]
sudo rm -r menubot
sudo git clone https://github.com/Potrimpo/menubot.git --branch [NAME OF BRANCH]
```

> Occasionally, the errors you've caused by fiddling about are too large to warrant a fix, and you just want to start fresh. Use these commands to totally delete the menubot directory, and replacing it with a fresh one from git.


##### To check port activity
```netstat -tulpn```

> Use this command to check if nginx and PM2 are listening on ports.


##### To see if ngnix is running
```ps waux | grep nginx```

> This command checks if Nginx is running. Note, this command will often also pick up the grep command running. For each line returned by this command, check to the far right entry. If it is "grep nginx", you’re picking up on the grep command.



## Database server

### First time setup

##### Documentation begins
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb menubot
sudo nano /etc/postgresql/{version}/main/postgresql.conf
```

replace `listen_addressses = 'localhost'` with `listen_addresses = '*'`

```
sudo vim /etc/postgresql/{version}/main/pg_hba.conf
```

add the new lines:

  ```
  # TYPE    DATABASE    USER            ADDRESS                           METHOD
    host    all         postgres      {postgres instance local ip}/32     md5
  ```

```
sudo service postgresql restart
```
##### Congratulations, you're done with setting up the database server.


### Useful commands

##### Inspecting the database
```
sudo -u postgres psql menubot
\d
SELECT * FROM [TABLE NAME]
```

>Use this to inspect the contents of tables.


##### Renewing the database
```
sudo -u postgres dropdb menubot
sudo -u postgres createdb menubot
```

> Use this when you've made a change to the application that will effect the database's structure in anyway, otherwise the application will error out.


## Development setup

### Ubuntu development: First time setup

##### Documentation begins
```
cd [PREFERED LOCATION]
sudo git clone https://github.com/Potrimpo/menubot.git
```

Download linux version of Ngrok

```
unzip [PATH TO NGROK]/ngrok.zip
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install pm2 -g
cd [PATH TO MENUBOT DIR]/menubot
sudo npm i
sudo nano /etc/postgresql/[POSTGRESQL VERSION NUMBER]/main/pg_hba.conf
```

Down the bottom, under the commented line `# IPv4 local connections:` change the final word on the line to `trust`

```
/etc/init.d/postgresql restart
sudo -i -u postgres
cd /home/[USERNAME]/[PATH TO MENUBOT]/menubot
pm2 start process.json --env development --watch
pm2 logs
```

Create a new terminal window

```
cd [PATH TO NGROK]/ngrok
./ngrok http 8445
```

Create a new Facebook developers app project and add the required products along with the appropriate configuration. The details of this arcane ritual have been lost to time, however clues may be gleaned from elder wizard Lewis Knox Streader.

Add the ngrok url you have just generated to the Facebook development console. This will require several things:
* In the settings section, add the domain to the “app domains” field.
* In the settings section, add the domain to the “site URL” field.
* In the Webhooks section, add the domain to the “callback url” field with the /webhook extension.
* In the products-Facebook login section, add the url to the “Valid OAuth redirect URIs” field with two amendments.
    1. Change https to http
    2. Add the suffix /auth/facebook/callback . This suffix can be found in the config/secrets.js file if it changes.

Assure the Facebook development app ID and secret ID are correct in envVariables.js and secrets.js for the Facebook development account you are using.

Access the webpage with the Ngrok url you've generated.
##### Congratulations, you may be able to develop application now. Probably not however.



### Ubuntu development: Day to day setup
> This setup assumes you have already followed the first time setup, and now need to restart the server.

##### Documentation begins
```
sudo -i -u postgres
cd /home/[USERNAME]/[PATH TO MENUBOT]/menubot
pm2 start process.json --env development --watch
pm2 logs
```

Create a new terminal window

```
cd [PATH TO NGROK]/ngrok
./ngrok http 8445
```

Add the ngrok url you have just generated to the Facebook development console. This will require several things:
* In the settings section, add the domain to the “app domains” field.
* In the settings section, add the domain to the “site URL” field.
* In the Webhooks section, add the domain to the “callback url” field with the /webhook extension.
* In the products-Facebook login section, add the url to the “Valid OAuth redirect URIs” field with two amendments.
    1. Change https to http
    2. Add the suffix /auth/facebook/callback . This suffix can be found in the config/secrets.js file if it changes.

Access the webpage with the Ngrok url you've generated.
##### Congratulations, the development application is running.

### Ubuntu development: useful commands

##### Inspecting the database
```
sudo -u postgres psql menubot
\d
SELECT * FROM [TABLE NAME]
```

>Use this to inspect the contents of tables.


##### Renewing the database
```
sudo -u postgres dropdb menubot
sudo -u postgres createdb menubot
```

> Use this when you've made a change to the application that will effect the database's structure in anyway, otherwise the application will error out.
