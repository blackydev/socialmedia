
# Socialmedia
The application has basic functionalities such as adding/removing/liking/commenting posts (with photos), following other users, changing avatar etc. After local installation, a sample database will be automatically created. I didn't focus heavily on the design in the application.
## Tech Stack

**Client:** Typescript, React, MUI

**Server:** Typescript, Node, Express, mongoDB, Jest

**Deploying:** Docker, Docker Compose

## Run Locally

Clone the project

```bash
  git clone https://github.com/blackydev/socialmedia
```

Go to the project directory

```bash
  cd socialmedia
```

Build and start application with sample database.

```bash
  docker-compose up --build -d
```

Open [localhost:3000](http://localhost:3000)