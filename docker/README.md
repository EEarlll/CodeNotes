
#  CodeNotes Dockerized

This project includes a multi-service setup with **Flask**, **React**, **Nginx**, and **Certbot**. The application is containerized using Docker, making it easy to deploy and manage.

## Architecture Overview

- **Flask (API Server)**: A Python-based backend service serving API endpoints.
- **React (Client)**: A frontend React application that communicates with the Flask API.
- **Nginx**: A reverse proxy server managing traffic between the Flask API and React client.
- **Certbot**: A service that handles SSL certificate generation for HTTPS with Let's Encrypt.

## Prerequisites

Before setting up the application, make sure you have the following installed:

- Docker
- Docker Compose
- Domain name
- VPS

## Setup Instructions

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/EEarlll/CodeNotes.git
cd CodeNotes
```

### 2. Directory Structure

Ensure your project directory has the following structure:

```
/CodeNotes
    /nginx
        nginx.conf          # Nginx configuration file
    /server
        /flaskr
            .env            # environment folder for firebase (required)
    /certbot                # (Automatically generated after running Certbot service)
        /conf               # Certificate configuration
        /www                # Certbot web root
    /client
       /.env                # environment folder for firebase (required)
    docker-compose.yml      # Docker Compose configuration
```

### 3. Configuration

#### Nginx Configuration

Modify the `nginx/nginx.conf` file:

- Replace `earleustacio.me` with your actual domain name in both the HTTP and HTTPS server blocks.

#### Certbot Configuration

In the `certbot` service, the command is configured to automatically obtain SSL certificates from Let's Encrypt:

```bash
command: certonly --webroot -w /var/www/certbot --keep-until-expiring --email earleustacio@gmail.com -d earleustacio.me --agree-tos
```

Replace `earleustacio.me` with your domain name and update the email address.

### 4. Run the Application

Once the setup is complete, you can start all the services with Docker Compose:

```bash
docker-compose up --build
```

This will build and start the following services:
- **Flask Server**: Runs the backend API on `http://localhost:5000`.
- **React Client**: Runs the frontend on `http://localhost:3001`.
- **Nginx**: Serves as a reverse proxy, redirecting HTTP traffic to HTTPS and handling the routing between the Flask API and React frontend.
- **Certbot**: Automatically generates SSL certificates for secure HTTPS traffic.

### 5. Accessing the App

- The **React Client** will be accessible via `http://localhost` or your domain if you're using custom DNS (i.e., `http://earleustacio.me`).
- The **API** will be accessible via `https://earleustacio.me/api`.

### 6. SSL Configuration

After running the `certbot` service for the first time, it will automatically generate SSL certificates for your domain. Nginx will be configured to serve your application over HTTPS using these certificates.

### 7. Stopping the Services

To stop all running services, run:

```bash
docker-compose down
```

This will stop the containers and remove any associated networks or volumes.

## Docker Compose File

The `docker-compose.yml` file defines all the services and their configurations:

```yaml
services:
  flask-server:
    image: playground-flask-server:latest
    container_name: flask-server
    ports:
      - "5000:5000"
    volumes:
      - ./server/instance:/app/instance

  react-client:
    image: playground-react-client:latest
    container_name: react-client
    ports:
      - "3001:80"

  nginx:
    image: nginx
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - flask-server
      - react-client

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot --keep-until-expiring --email earleustacio@gmail.com -d earleustacio.me --agree-tos
    depends_on:
      - nginx
```

## Additional Configuration

If you need to customize the settings for Flask, React, or Nginx, refer to the respective configuration files and adjust accordingly.

## Troubleshooting

- **SSL Errors**: Make sure your domain is correctly pointing to your server and that the `certbot` service has successfully generated SSL certificates.
- **Ports Not Exposed**: Ensure that the `docker-compose.yml` file has the correct port mappings for Flask, React, and Nginx services.
- **VPS Ports**: Ensure that ports 80 (HTTP) and 443 (HTTPS) are open and properly forwarded for your domain.
  
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```