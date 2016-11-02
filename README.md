## Menubot

### Server

##### Nodejs installation
1. `$ apt-get git npm`
2. `$ curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh`
3. `$ sudo bash ./nodesource_setup.sh`
4. `$ sudo apt-get install nodejs`
5. `$ sudo apt-get install build-essential`

###### Route traffic from port 80 to 3000 (run server on 3000)
`$ sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000`

##### Running
> postgresURL = postgres instance internal IP
> serverIP = node-server instance internal IP
> postgresPassword = menubot database user password

```
postgresURL=xxxx serverIP=xxxx postgresPassword=xxxx node app.js
```

##### Running for Development
1. Download ngrok. On mac `$ brew install ngrok`
2. ngrok http {menubot server port}
3. Open localhost:4040 to initialize tunnel URL

### Database

##### Creating
* `$ sudo -u postgres createdb menubot`

##### Inspecting
* `$ sudo -u postgres psql menubot`

##### Connecting
1. `$ sudo vim /etc/postgresql/{version}/main/postgresql.conf`
    replace `listen_addressses = 'localhost'` with `listen_addresses = '*'`

2. $ sudo vim /etc/postgresql/{version}/main/pg_hba.conf
    add new lines
    ```
    # TYPE    DATABASE    USER            ADDRESS                           METHOD
      host    all         postgres      {postgres instance local ip}/32     md5
    ```

3. `$ sudo service postgresql restart`