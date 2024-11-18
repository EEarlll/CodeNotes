import { noteType } from "@/types";
import { Button } from "@/components/ui/button";
import NoteCardForm from "../Notes/NoteCardForm";
import { Link } from "react-router-dom";

const noteList: noteType[] = [
  {
    id: 123,
    category: "default",
    format: "javascript",
    DateCreated: "2024-10-25 07:15:39.129184",
    message: `import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = useCallback<(value: T) => string>(
    (value) => {
      if (options.serializer) {
        return options.serializer(value);
      }

      return JSON.stringify(value);
    },
    [options]
  );

  const deserializer = useCallback<(value: string) => T>(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      // Support 'undefined' as a value
      if (value === "undefined") {
        return undefined as unknown as T;
      }

      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return defaultValue; // Return initialValue if parsing fails
      }

      return parsed as T;
    },
    [options, initialValue]
  );

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Prevent build error "window is undefined" but keep working
    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(\`Error reading localStorage key “\${key}”:\`, error);
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue();
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        \`Tried setting localStorage key “\${key}” even though environment is not a client\`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value;

      // Save to local storage
      window.localStorage.setItem(key, serializer(newValue));

      // Save state
      setStoredValue(newValue);

      // We dispatch a custom event so every similar useLocalStorage hook is notified
      window.dispatchEvent(new StorageEvent("local-storage", { key }));
    } catch (error) {
      console.warn(\`Error setting localStorage key “\${key}”:\`, error);
    }
  };

  const removeValue = () => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        \`Tried removing localStorage key “\${key}” even though environment is not a client\`
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Remove the key from local storage
    window.localStorage.removeItem(key);

    // Save state with default value
    setStoredValue(defaultValue);

    // We dispatch a custom event so every similar useLocalStorage hook is notified
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  // this only works for other documents, not the current one
  window.addEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  window.addEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue, removeValue];
}


// some Component.tsx
const [value, setValue, removeValue] = useLocalStorage<number[]>("pinList", []);
    `,
    pin: 1,
    title: "useLocalStorage.tsx",
    user: "earl",
  },
  {
    id: 124,
    category: "default",
    format: "python",
    DateCreated: "2024-10-25 07:15:39.129184",
    message: `from dotenv import load_dotenv
from functools import wraps
from flask import request, jsonify
import firebase_admin
import os
from firebase_admin import credentials, auth


def prGreen(skk):
    print("\\033[92m {}\\033[00m".format(skk))


# initialize firebase credentials
load_dotenv()
cred = credentials.Certificate(
    {
        "type": os.environ.get("TYPE"),
        "project_id": os.environ.get("PROJECT_ID"),
        "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
        "private_key": os.environ.get("PRIVATE_KEY").replace(r"\\n", "\\n"),
        "client_email": os.environ.get("CLIENT_EMAIL"),
        "client_id": os.environ.get("CLIENT_ID"),
        "auth_uri": os.environ.get("AUTH_URI"),
        "token_uri": os.environ.get("TOKEN_URI"),
        "auth_provider_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
        "client_x509_cert_url": os.environ.get("CLIENT_X509_CERT_URL"),
        "universe_domain": os.environ.get("UNIVERSE_DOMAIN"),
    }
)

firebase_admin.initialize_app(cred)


def verify_token(id_token):
    """Verify Firebase Id token. Return UID"""
    try:
        decoded_token = auth.verify_id_token(id_token,clock_skew_seconds=10)
        uid = decoded_token["uid"]
        return uid
    except Exception as e:
        prGreen(e)
        return None


def requires_auth(f):
    """Decorator to require Authentication and return decoded token"""

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization").split(" ")[1]
        uid = "guest"

        if auth_header != "undefined":
            token = auth_header
            uid = verify_token(token)

        if not uid:
            return jsonify(f"Token Verification Error"), 401

        request.uid = uid
        return f(*args, **kwargs)

    return decorated

# convert serviceAccount.json to .env
import json
import os

print(os.getcwd())
data = json.load(open("server/flaskr/serviceAccount.json"))

f = open(".env", "x")

for key,val in data.items():
    f.write(f"{key.upper()}={val}\\n")

    `,
    pin: 0,
    title: "Flask Firebase Authentication",
    user: "earl",
  },
  {
    id: 127,
    category: "default",
    format: "markdown",
    DateCreated: "2024-10-25 07:15:39.129184",
    message: `## **Table of Contents**
- [Basic Linux](#basic-linux)
- [Basic Vim](#basic-vim)
- [ngnix](#ngnix)
- [pm2](#pm2)
- [ufw](#ufw)
- [unattended-upgrades](#unattended-upgrades)
- [Basic Logging](#basic-logging)
- [docker](#docker)
- [Git](#git)

### useful links
1. [Crontab Made Easy](https://crontab.guru/)
2. [Markdown Made Easy](https://medium.com/@dipan.saha/markdown-made-easy-unlocking-the-secrets-in-under-5-minutes-519bbc7b8023)
3. [Certbot Https](https://certbot.eff.org/instructions)

# Basic Linux
| Command                                                | Description                                        |
| ------------------------------------------------------ | -------------------------------------------------- |
| \`ls\`                                                   | show directory                                     |
| \`ls -la\`                                               | show directory with permissions                    |
| \`ls -a\`                                                | show directory with hidden files                   |
| \`pwd\`                                                  | print working directory                            |
| \`mkdir <file path>\`                                    | create directory                                   |
| \`mkdir -p ./temp/foo/bar.txt\`                          | create nested directory                            |
| \`rm -rf <dir>\`                                         | delete directory recursively                       |
| \`cd\`                                                   | set current directory                              |
| \`cd ..\`                                                | move up current directory                          |
| \`cd ~\`                                                 | navigate to home directory                         |
| \`ctrl + c\`                                             | exit program                                       |
| \`touch <text.txt>\`                                     | create file                                        |
| \`less <file.txt>\`                                      | print in one line at a time                        |
| \`cat <file.txt>\`                                       | see contents of file                               |
| \`man <command>\`                                        | manual page (q to exit)                            |
| \`clear\`                                                | clear terminal                                     |
| \`exit\`                                                 | exit current ssh session                           |
| \`echo <text>\`                                          | print any text                                     |
| \`echo $0 / echo $SHELL\`                                | print current shell                                |
| \`echo $USER \`                                          | print username                                     |
| \`openssl <encrpy> <file>\`                              | encrpy the file with hash                          |
| \`ssh-keygen\`                                           | Generate a ssh key                                 |
| \`ping <domain.com>\`                                    | check status of network                            |
| \`traceroute <domain.com>\`                              | check all destination of network to domain         |
| \`netstat\`                                              | see all network process                            |
| \`nmap <ip>\`                                            | see all open ports                                 |
| \`nslookup <domain.com>\`                                | Look at nameserver for domain                      |
| \`dig <domain.com>\`                                     | look at dns records for domain                     |
| \`apt update\`                                           | update packages                                    |
| \`apt upgrade\`                                          | upgrade packages                                   |
| \`shutdown now -r\`                                      | shutdown current time & restart (1 day default)    |
| \`sudo su\`                                              | run as root                                        |
| \`su earl\`                                              | run as user                                        |
| \`chmod 644 <file/dir>\`                                 | chng perm(4,2,1) (owner,group,everyone) (r,w,e)    |
| \`adduser <user>\`                                       | add user                                           |
| \`userdel <user>\`                                       | delete user                                        |
| \`usermod -aG <pem>\`                                    | add user in permission (ex sudo )                  |
| \`sudo vi /etc/ssh/sshd_config\`                         | edit config of ssh                                 |
| \`sudo service ssh restart\`                             | restart daemon configs                             |
| \`less /etc/passwd\`                                     | show all list of users                             |
| \`ctrl A + ctrl K \`                                     | wipe current line terminal                         |
| \`ctrl L\`                                               | sshortcut clear                                    |
| \`Ctrl Y\`                                               | recall                                             |
| \`sudo !!\`                                              | sudo last command                                  |
| \`pkill node / killall node\`                            | Kill all node process if stuck                     |
| \`htop\`                                                 | view all running process in os                     |
| \`sudo chown -R $USER:$USER /var/www\`                   | change ownership of path                           |
| <code> < cmd return > &#124; grep < pattern ></code>   | mode           run command based on return of pipe |
| \`eval $(ssh-agent) && ssh-add <private key>\`           | add new identity                                   |
| \`curl -m 2 <endpoint>/?q=<param>\`                      | http get request -m(timeout)                       |
| \`curl --data "param1=value1&param2=value2" <endpoint>\` | http post request                                  |
| \`sudo lsof -i :<Port>\`                                 | view open port at                                  |
| \`kill -9 <PID>\`                                        | kill port at PID                                   |




# Basic Vim
| Commands       | Description                    |
| -------------- | ------------------------------ |
| \`i\`            | enter insert mode              |
| \`ESC\`          | Enter normal mode              |
| \`: <cmd>\`      | Command Mode                   |
| \`ESC :wq\`      | Save and Exit                  |
| \`ESC :q!\`      | quit w/o saving                |
| \`ESC u\`        | undo                           |
| \`ESC ctrl + r\` | redo                           |
| \`ESC x\`        | remove                         |
| \`ESC v\`        | visual mode                    |
| \`ESC dd\`       | Delete line                    |
| \`ESC V\`        | Select line                    |
| \`ESC vap\`      | Select all line in paragraph   |
| \`ESC gg\`       | Start line                     |
| \`ESC G\`        | Last line                      |
| \`ESC O\`        | New line                       |
| \`ESC a\`        | end of current line and insert |
| \`ESC b\`        | start of current line          |

copy paste script
1. Create .vimbuffer
2. paste in .vimrc
3. " copy (write) highlighted text to .vimbuffer
vmap <C-c> y:new ~/.vimbuffer<CR>VGp:x<CR> \| :!cat ~/.vimbuffer \| clip.exe <CR><CR>
" paste from buffer
map <C-v> :r ~/.vimbuffer<CR>


# ngnix 
| Commands / Filepaths               | Description                       |
| ---------------------------------- | --------------------------------- |
| \`sudo service nginx start\`         | start nginx server                |
| \`sudo service nginx restart\`       | restart nginx server              |
| \`sudo ngnix -t \`                   | test server configs               |
| \`/var/www/<site> \`                 | file path of project              |
| \`/etc/nginx/nginx.conf \`           | changed virtual host configs/gzip |
| \`/etc/nginx/sites-enabled/<site> \` | config of project server file     |

nginx setups 
1. in \`/etc/nginx/sites-enabled/<site>\` create file and put it in nginx.conf
2. server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name earleustacio.me; // domain name
        access_log /var/log/nginx/access.log upstreamlog // log balancer script 

        location / {
                proxy_set_header Upgrade $http_upgrade; // websocket
                proxy_set_header Connection "upgrade"; // websocket
                proxy_pass http://127.0.0.1:3000;   // localhost or loadbalancer
        }
}
Load Balancer script log on nginxconf
\`log_format upstreamlog '[$time_local] $remote_addr - $remote_user - $server_name $host to: $upstream_addr: $request $status upstream_response_time $upstream_response_time msec $msec request_time $request_time';
  \`



# pm2
| Commands                         | Description                             |
| -------------------------------- | --------------------------------------- |
| \`pm2 start <app.js> --watch\`     | start app without need of terminal open |
| \`pm2 stop <app.js> --watch\`      | stop app on pm2                         |
| \`pm2 list\`                       | show list of current process            |
| \`pm2 save\`                       | save process / configs                  |
| \`pm2 startup\`                    | show command to start process           |
| \`pm2 logs / pm2 logs [app-name]\` | output log of pm2                       |


# ufw
| Commands                            | Description           |
| ----------------------------------- | --------------------- |
| \`sudo ufw status\`                   | check if ufw is on    |
| \`sudo ufw allow/deny/reject <port>\` | set up rules          |
| \`sudo ufw enable\`                   | enable firewall (ufw) |
| \`sudo ufw list\`                     | show list of commands |

# unattended-upgrades
| Commands                                                   | Description    |
| ---------------------------------------------------------- | -------------- |
| \`sudo dpgkg-reconfigure --priority=low unattended upgrade\` | enable upgrade |

# Basic Logging
| Commands                                                        | Description                       |
| --------------------------------------------------------------- | --------------------------------- |
| \`**** sh /var/www/app/<file>.sh 2>&1 pipe logger -t <file.sh> \` | log crontab                       |
| \`/var/log/<syslog>,<auth.log>,</nginx/accesslog>\`               | log file path                     |
| \`pm2 logs / pm2 logs [app-name]\`                                | output log of pm2                 |
| \`cat /etc/os-release\`                                           | output ver of os                  |
| \`tail -f\`                                                       | outpat last part w/ follow        |
| \`head\`                                                          | output first part                 |
| \`less\`                                                          | output one page at a time         |
| \`cat\`                                                           | output entire file                |
| <code> &#124; <code>                                            | read from stout                   |
| \`>\`                                                             | write stdout to file              |
| \`>>\`                                                            | append stdout to file             |
| \`<\`                                                             | read from stdin                   |
| \`2>&1\`                                                          | redirect both stdin/out           |
| \`find <dir> -type <f/d> -name <(*.ext, file/>\`                  | search file name                  |
| \`grep -<i/> '<search exp>' <dir>\`                               | search file contents              |
| \`zgrep <file> \`                                                 | search file without uncompressing |


# docker
| Commands                                                                        | Description                             |
| ------------------------------------------------------------------------------- | --------------------------------------- |
| \`FROM <os>\`                                                                     | what type of os running                 |
| \`RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app\` | create a dir for node & change perms    |
| \`WORKDIR /home/node/app\`                                                        | change work dir                         |
| \`COPY --chown=node:node package*.json ./\`                                       | copy package json in the directory      |
| \`USER node\`                                                                     | set user to node                        |
| \`RUN npm i\`                                                                     | run npm i from the earlier copy package |
| \`COPY --chown=node:node . .\`                                                    | copy everything from the directory      |
| \`EXPOSE 3000\`                                                                   | expose port                             |
| \`CMD ["node", <app.js>]\`                                                        | run command                             |
| \`sudo docker build -t <name> .\`                                                 | build docker image  from cur dir        |
| \`sudo docker run -d -p <out port>:<in port> <imagename>\`                        | run docker -d(background) -p(port)      |
| \`sudo docker ps\`                                                                | view all running docker                 |
| \`sudo docker image ls \`                                                         | view  dir of docker image               |



# Git
| Commands                             | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| \`git status \`                        | get status of files                          |
| \`git remote add origin <ssh.git >\`   | create remote                                |
| \`git pull -u origin <branch>\`        | get latest                                   |
| \`git pull origin <branch> --ff-only\` | pull changes that are diff not collide exist |
| \`git clone <ssh.git> .\`              | clone repo w/o folder                        |
| \`git add .\`                          | add all                                      |
| \`git commit \`                        | commit files                                 |
| \`git commit -am "<msg>"\`             | commit & add files w/ msg                    |
| \`git push\`                           | push repo                                    |
| \`git clear\`                          | delete untracked files                       |
| \`gh repo create <name>\`              | create repo                                  |
| \`gh repo rename <name>\`              | rename repo                                  |


Node
npm link
"bin": { "<cli>" : "./index.js"}
#!/usr/bin/env node
    `,
    pin: 0,
    title: "Various Commands",
    user: "earl",
  },
  {
    id: 150,
    category: "default",
    format: "shell",
    DateCreated: "2024-10-25 07:15:39.129184",
    message: `#!/bin/bash
# Simple line count example, using bash
#
# Bash tutorial: http://linuxconfig.org/Bash_scripting_Tutorial#8-2-read-file-into-bash-array
# My scripting link: http://www.macs.hw.ac.uk/~hwloidl/docs/index.html#scripting
#
# Usage: ./line_count.sh file
# -----------------------------------------------------------------------------

# Link filedescriptor 10 with stdin
exec 10<&0
# stdin replaced with a file supplied as a first argument
exec < $1
# remember the name of the input file
in=$1

# init
file="current_line.txt"
let count=0

# this while loop iterates over all lines of the file
while read LINE
do
    # increase line counter
    ((count++))
    # write current line to a tmp file with name $file (not needed for counting)
    echo $LINE > $file
    # this checks the return code of echo (not needed for writing; just for demo)
    if [ $? -ne 0 ]
     then echo "Error in writing to file \${file}; check its permissions!"
    fi
done

echo "Number of lines: $count"
echo "The last line of the file is: \`cat{file}\`"

# Note: You can achieve the same by just using the tool wc like this
echo "Expected number of lines: \`wc -l $in\`"

# restore stdin from filedescriptor 10
# and close filedescriptor 10
exec 0<&10 10<&-
    `,
    pin: 0,
    title: "Shell",
    user: "earl",
  },
  {
    id: 126,
    category: "default",
    format: "json",
    DateCreated: "2024-10-25 07:15:39.129184",
    message: `{
  "data": [
    {
      "type": "video_listing",
      "title": "Daniela Flores",
      "data": [
        {
          "type": "video",
          "videoId": "FHGzy9jezWk",
          "title": "turning a hair mask into hair dye🫢😳😳",
          "viewCount": "7158969",
          "publishedText": "1 month ago",
          "lengthText": "SHORTS",
          "thumbnail": [
            {
              "url": "https://i.ytimg.com/vi/FHGzy9jezWk/hq2.jpg?sqp=-oaymwE1CNIBEHZIVfKriqkDKAgBFQAAiEIYAHABwAEG8AEB-AHOBYACgAqKAgwIABABGH8gEyg4MA8=&rs=AOn4CLBOc-pEtcJ5978_zOqTujb_azsqsg",
              "width": 210,
              "height": 118
            },
            {
              "url": "https://i.ytimg.com/vi/FHGzy9jezWk/hq2.jpg?sqp=-oaymwE2CPYBEIoBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARh_IBMoODAP&rs=AOn4CLAXseFjY8yZHCIB6nkgETdy4_VxSg",
              "width": 246,
              "height": 138
            },
            {
              "url": "https://i.ytimg.com/vi/FHGzy9jezWk/hq2.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARh_IBMoODAP&rs=AOn4CLCnovIgLfo_0bC1Fh8zzzCctpQgsA",
              "width": 336,
              "height": 188
            }
          ]
        },
        {
          "type": "video",
          "videoId": "H9GlZWByhm0",
          "title": "curly hair probs",
          "viewCount": "3190793",
          "publishedText": "1 month ago",
          "lengthText": "SHORTS",
          "thumbnail": [
            {
              "url": "https://i.ytimg.com/vi/H9GlZWByhm0/hq2.jpg?sqp=-oaymwE1CNIBEHZIVfKriqkDKAgBFQAAiEIYAHABwAEG8AEB-AHOBYACgAqKAgwIABABGGUgUShHMA8=&rs=AOn4CLAQlKqiSqCIOyM1Jo7M1fuCzUkTdQ",
              "width": 210,
              "height": 118
            },
            {
              "url": "https://i.ytimg.com/vi/H9GlZWByhm0/hq2.jpg?sqp=-oaymwE2CPYBEIoBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARhlIFEoRzAP&rs=AOn4CLDZBTvS3fMEwp0LMy4VJ1FhKSCwwg",
              "width": 246,
              "height": 138
            },
            {
              "url": "https://i.ytimg.com/vi/H9GlZWByhm0/hq2.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARhlIFEoRzAP&rs=AOn4CLAR05TP9CFGZpLkdO0SW8JBAxQ5lw",
              "width": 336,
              "height": 188
            }
          ]
        },
        {
          "type": "video",
          "videoId": "XCevjmoODyQ",
          "title": "this hairstyle makes my life easier",
          "viewCount": "42521",
          "publishedText": "2 weeks ago",
          "lengthText": "SHORTS",
          "thumbnail": [
            {
              "url": "https://i.ytimg.com/vi/XCevjmoODyQ/hq2.jpg?sqp=-oaymwE1CNIBEHZIVfKriqkDKAgBFQAAiEIYAHABwAEG8AEB-AHOBYACgAqKAgwIABABGGUgUihDMA8=&rs=AOn4CLBSe1kChGYjRuLglBIwxwS3JaB2Mw",
              "width": 210,
              "height": 118
            },
            {
              "url": "https://i.ytimg.com/vi/XCevjmoODyQ/hq2.jpg?sqp=-oaymwE2CPYBEIoBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARhlIFIoQzAP&rs=AOn4CLB7P1r866YX-mwRsKVwTh0vvmaceg",
              "width": 246,
              "height": 138
            },
            {
              "url": "https://i.ytimg.com/vi/XCevjmoODyQ/hq2.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGABwAcABBvABAfgBzgWAAoAKigIMCAAQARhlIFIoQzAP&rs=AOn4CLCpZ0CoOm9pCEtUGUdMXgbhYieLIw",
              "width": 336,
              "height": 188
            }
          ]
        }
      ]
    }
  ]
}
    `,
    pin: 0,
    title: "Youtube json ",
    user: "earl",
  },
];

export default function Features() {
  return (
    <div className="w-full my-12">
      <div className="flex flex-wrap md:gap-8">
        <div className="w-80 px-6 py-6">
          <h1 className="text-2xl font-semibold">
            Find inspiration from others.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover, explore, and share the work of individuals across the
            development community to gain new insights and inspiration.
          </p>
        </div>
        {noteList.map((note: noteType, index: number) => {
          return (
            <div key={index}>{<NoteCardForm note={note} key={note.id} />}</div>
          );
        })}
      </div>
      <div className="flex justify-center mt-6">
        <Button>
          <Link to={"/Notes/"}>Explore</Link>{" "}
        </Button>
      </div>
    </div>
  );
}
