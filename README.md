It looks like you want to set up a local Docker environment for your project using Docker Compose. Here’s a step-by-step guide based on the steps you've provided:

### Step 1: Build a Local Docker Image

To build your Docker image, navigate to the directory containing your `docker-compose.yml` file and run the following command:

```bash
docker-compose build
```

### Step 2: Run Docker and Pull the Container from the Docker Image

After the image is built, you can start the containers defined in your `docker-compose.yml` file with:

```bash
docker-compose -f docker-compose.yml up -d
```

The `-d` flag runs the containers in detached mode, allowing them to run in the background.

### Step 3: Run the Project

Once the containers are running, you can access your API and site:

- **API URL:** [http://api.localhost/](http://api.localhost/)
- **Site URL:** [http://localhost/](http://localhost/)

#### Login Credentials

To log in, use the following credentials:

- **Username:** `admin`
- **Email:** `admin@example.com`
- **Password:** `123`

### Additional Step: Read the README File

Make sure to check the `README.md` file for any additional setup instructions, dependencies, or specific configurations required for your project. The README often contains valuable information about how to run and interact with your application.

### Note

Ensure that Docker and Docker Compose are properly installed and running on your machine. If you encounter any issues during these steps, feel free to ask for help!
