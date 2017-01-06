# Menubot

> Warning: This guide has not been changed since the change of name from Menubot to suss. Consequently, please swap out any mentions of Menubot or it's domain to the new version.

## DNS forwarding

### First time setup

Made using:
* https://cloud.google.com/dns/quickstart
* https://cloud.google.com/compute/docs/configure-instance-ip-addresses#reserve_new_static

##### Documentation begins
1. First, using Google Cloud services, create your project, server instance, and activate billing.
2. Buy a domain name, for example menubot.xyz
3. Acquire a static IP for the domain via either:
    * Assigning an already existing static IP to the instance: https://console.cloud.google.com/networking/addresses/
    * Reserving a new static IP for the domain: https://console.cloud.google.com/networking/addresses/add
4. Create a zone. A zone controls the DNS of a single domain name, like for example, menubot.xyz. We should already have a zone for Menubot.xyz. https://console.cloud.google.com/networking/dns/zones
5. Create an appropriate record in this zone, for the static IP you just created
    * If your IP address is in the form #.#.#.#, you have an IPv4 address and need to create an A record.
    * If your IP address is in the format #:#:#:#:#:#:#:#, you have an IPv6 address and should create an AAAA record to point the domain to the IP address.
6. Create an appropriate CNAME. Click Add record set while in the Cloud Platform Console.
7. Under DNS Name, enter www.
8. Under Resource Record Type, choose CNAME.
9. Under Canonical name, enter the domain name, followed by a period. For example, “menubot.xyz.”
10. Click Create.
11. Now we must set our domain name on our domain name registration service (EG: Onlydomians, gandi.net) to point to google’s name servers. Log onto the service with which the domain was registered. You can find the logon for the Onlydomains account on the google doc: Business passwords.
12. Find the name servers for the zone we just created. These can be found as the data value for the automatically created “NS” entry.
13. Set the domain name on our domain name registration service to delegate to the name servers we found in the previous step.

##### Congratulations, you’re done. The changes should propagate in no more than 48 hours.



## Facebook app

### First time setup
> Note: This process cannot be completed without a running version of the site. As of such, only follow this guide when another process instructs you to.

##### Documentation begins
1. First create a Facebook profile, or log on to your existing profile.
2. Navigate to https://developers.facebook.com/apps and click the green "+ Add a New App" button.
3. Enter an appropriate name, contact email address, and enter the category as messenger bot. Click "Create App ID" to proceed.
4. On the sidebar, click "+ Add Product", then click "Get Started" for Facebook Login.
5. Add your url (either from Ngrok or the live site url) to the “Valid OAuth redirect URIs” field with two amendments:
    1. Change `https` to `http`
    2. Add the suffix `/auth/facebook/callback`
6. Save your changes with the blue button in the bottom right corner.
7. Once again, on the sidebar, click "+ Add Product", but this time click "Get Started" for Webhooks.
8. Click the green "New Subscription" button, then select page.
9. Add your domain to the “callback url” field with the `/webhook` extension.
10. Enter the application's current verify token. This can be found in the `process.json` file in the `menubot` directory. The verify token is stored under `"FB_VERIFY_TOKEN"`. Be sure to copy the one for the env you intend to run the application as.
11. Tick the following checkboxes:
    * `messages`
    * `messaging_optins`
    * `messaging_postbacks`
12. Click "Verify and Save", then click the "Settings" button.
13. Click the "+ Add Platform" button.
14. Click the "Website" button.
15. Add your domain to the “App Domains” field, and “Site URL” field.
16. Add an appropriate "App Icon". You can find one in `menubot/dist/images/menubotlogo.png`
17. Save your changes with the blue button in the bottom right corner.
18. Note down the App ID and App Secret.
    > Live production server

    * In `process.json` add App ID under '"FACEBOOK_ID"', and App Secret under "FB_APP_SECRET".

    > Development environment

    * Add your App ID & App Secret to `local-dev-variables.js` (file under gitignore, may have to be created at this stage)
    file should look like this
    ```
    module.exports = {
        FACEBOOK_ID: <App ID>,
        FB_APP_SECRET: <App Secret>
    };
    ```

##### Congratulations, you have set up Facebook integration for MenuBot, you may now return to where you were in the process that directed you here.



## Node.js server setup



### First time setup

Made using:
* https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
* https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-6-set-up-auto-renewal
* http://redis.io/topics/quickstart


##### Documentation begins
First create an Ubuntu 16 instance on Google Cloud.

```
sudo adduser pm2er
```

Add password as listed on business password doc, if you enter a different password, be sure to make a note if it on the doc. Leave user information as default.

```
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

Enter the domain name as `www.menubot.xyz, menubot.xyz`

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
        ssl_certificate /etc/letsencrypt/live/www.menubot.xyz/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/www.menubot.xyz/privkey.pem;
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

> Note that the application assumes the application server will be running on internal IP: 10.146.0.2 and the database server will be running on internal IP: 10.146.0.3 .
> Check that this is the case on the Google Clould console instances page, and if needed, change the configuration in process.json .


```
cd ~
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo cp utils/redis_init_script /etc/init.d/redis_6379
sudo nano /etc/init.d/redis_6379
```

Add the following text at the top of the file:

```
### BEGIN INIT INFO
# Provides: redis_6379
# Required-Start:    $network $remote_fs $local_fs
# Required-Stop:     $network $remote_fs $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: start and stop redis_6379
# Description: Redis daemon
### END INIT INFO
```

Write out with CTRL + O, then ENTER, then exit with CTRL + X

```
sudo cp redis.conf /etc/redis/6379.conf
sudo mkdir /var/redis/6379
sudo nano /etc/redis/6379.conf
```

Make the following changes
* Set daemonize to yes (by default it is set to no).
* Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
* Set the logfile to /var/log/redis_6379.log
* Set the dir to /var/redis/6379 (very important step!)

```
sudo update-rc.d redis_6379 defaults
sudo /etc/init.d/redis_6379 start
```

If you feel like it, make sure that everything is working as expected:
* Check redis is working with `redis-cli ping`, it should return PONG.
* Do a test save with `redis-cli save` and check that the dump file is correctly stored into `/var/redis/6379/` (you should find a file called `dump.rdb`).
* Check that your Redis instance is correctly logging in the log file `sudo nano /var/log/redis_6379.log`.

Please now follow the "Facebook app: First time setup" process you can find earlier in this documentation page.

##### Congratulations, you're done with setting up the application server. However, the database server still needs to be setup.

### Day to day live server running
> This setup process is used to run the server when the first time setup process has already been followed. This might when you've pulled a new version of the server from git, or when you've otherwise changed the live version, and now need to restart to implement your changes.

##### Documentation begins
```
sudo -i
sudo -u pm2er -i
```

Preform any changes you wanted to implement, such as pulling in a new update from git.

```
cd ~/menubot
sudo npm i
sudo ./build.sh
npm run prod
pm2 logs --lines 100
```
##### Congratulations, the server has been started once again.


### Useful commands

##### To log on as pm2er user
```
sudo -i
sudo -u pm2er -i
```

> A PM2 daemon started by a user cannot be interacted with, or seen by any other user. This makes it difficult when different developers are using different accounts. One process has to be stopped for the other developer to have access to PM2. By running the process on a third party user, anyone can access PM2 by changing to this pm2er user.


###### To stop PM2
```
pm2 stop all
```

###### To kill the pm2 daemon
```
pm2 kill
```

###### To view logs
```
pm2 logs --lines 1000
```

> Streams new logs, and shows the previous 1000 lines of logs.

###### To remove previous logs, and only log new logs
```
pm2 flush
npm start
```

> It's very easy to mix up logs from previous runs of the application, as there isn't any visible break point separating the two. This may confuse you into thinking the errors of the previous run are still around. This prevents just such a mix up.

###### To clone a fresh branch from git
```
cd [LOCATION OF MENUBOT DIRECTORY]
sudo rm -r menubot
sudo git clone https://github.com/Potrimpo/menubot.git --branch [NAME OF BRANCH]
```

> Occasionally, the errors you've caused by fiddling about are too large to warrant a fix, and you just want to start fresh. Use these commands to totally delete the menubot directory, and replacing it with a fresh one from git.

###### To check port activity
```
netstat -tulpn
```

> Use this command to check if nginx and PM2 are listening on ports.

###### To see if ngnix is running
```
ps waux | grep nginx
```

> This command checks if Nginx is running. Note, this command will often also pick up the grep command running. For each line returned by this command, check to the far right entry. If it is "grep nginx", you’re picking up on the grep command.


## Postgres database setup

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

> Unsure whether this needs to be part of the setup docs.

> After setting the database running, you may need to create the user that we connect as.

```
sudo -u postgres psql menubot
CREATE USER postgres WITH PASSWORD '<postgresPassword>';
```


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

##### Restarting postgres
```
sudo /etc/init.d/postgresql restart
```

> I can't remember why this is important.


## Development environment setup

### Ubuntu development: First time setup

##### Cloning the server code
```
cd [PREFERED LOCATION]
sudo git clone https://github.com/Potrimpo/menubot.git
```

##### Setting up ngrok
[Download ngrok](https://ngrok.com/download)

```
unzip [PATH TO NGROK]/ngrok.zip
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
```

##### Install & configure postgres

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo nano /etc/postgresql/[POSTGRESQL VERSION NUMBER]/main/pg_hba.conf
```

Down the bottom, under the commented line `# IPv4 local connections:` change the final word on the line to `trust`

```
/etc/init.d/postgresql restart
sudo -i -u postgres
```


##### Install node.js & the server dependencies

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 webpack less less-plugin-clean-css -g
cd [PATH TO MENUBOT DIR]/menubot
sudo npm i
sudo ./build.sh

```

##### Starting the server for real

Open 3 terminal windows


```
redis-server
```

```
npm start
```

```
cd [PATH TO NGROK]/ngrok
./ngrok http 8445
```

>If you have a reserved ngrok url use `ngrok http -subdomain=<url> 8445`

Please now follow the "Facebook app: First time setup" process you can find earlier in this documentation page.

Access the webpage with the Ngrok url you've generated.
##### Congratulations, you may be able to develop the application now. Probably not however.



### Ubuntu development: Day to day setup
> This setup assumes you have already followed the first time setup, and now need to restart the server.

Create 4 terminal windows

```
cd [PATH TO MENUBOT]/menubot
sudo npm i
sudo ./build.sh
```

```
redis-server
```

```
sudo -i -u postgres
cd /home/[USERNAME]/[PATH TO MENUBOT]/menubot
npm start
```

```
cd [PATH TO NGROK]/ngrok
./ngrok http 8445
```

Add the ngrok url you have just generated to the Facebook app development console. This will require several things:
* In the settings section, add the domain to the “App Domains” field.
* In the settings section, add the domain to the “Site URL” field.
* In the Webhooks section, add the domain to the “Callback URL” field with the `/webhook` extension.
* In the products-Facebook login section, add the url to the “Valid OAuth redirect URIs” field with two amendments.
    1. Change `https` to `http`.
    2. Add the suffix `/auth/facebook/callback`.

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

##### Restarting postgres
```
sudo /etc/init.d/postgresql restart
```

> Changing values in the postgres config files requires a restart of the database


### Testing

There are _some_ executable tests, though not a whole lot of coverage.
Testing the bot is important, but very difficult to do, due to the way the server responds to requests.

To run some of these tests, values must be added to the `local-dev-variables.js` file

```
module.exports = {
    tunnelURL: <your ngrok url>,
    senderID: <page-scoped facebook ID of user to spoof messages from>,
    testPageID: <the ID of the facebook page you're using for testing>,

    // these should already be in your file, for running server in dev environment
    FACEBOOK_ID: <App ID>,
    FB_APP_SECRET: <App Secret>
};
```
