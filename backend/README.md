# DiceTrails Backend

This is the Java Servlet backend for the DiceTrails E-commerce project.

## Prerequisites
- **Java 17** (Ensure `JAVA_HOME` is set)
- **Maven** (installed and in your system PATH)

## Getting Started

### 1. Install Dependencies
First, make sure all dependencies are downloaded and the project is built.
```bash
cd backend
mvn clean install
```

### 2. Run the Server
We use the Tomcat 7 Maven plugin for easy local development.
```bash
mvn tomcat7:run
```
*The server will start on port `8080`.*

## API Endpoints

Once the server is running, you can access:

- **Welcome Page**: [http://localhost:8080/](http://localhost:8080/)
- **Hello API**: [http://localhost:8080/hello](http://localhost:8080/hello)
  - Returns: JSON `{"message": "...", "status": "connected"}`

## Troubleshooting
- **Port 8080 in use**: If you see an error about the address being in use, make sure to stop any other processes running on port 8080 (or kill the previous terminal running the server).
- **404 Not Found**: If you see a 404, try restarting the server with `mvn tomcat7:run` again.
