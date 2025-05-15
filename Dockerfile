# Use an official Nginx image based on Alpine Linux.
# Alpine is a lightweight distribution, good for smaller image sizes.
FROM nginx:alpine

# Copy your entire project directory (where your index.html, style.css,
# script.js, manifest.json, sw.js, and Images folder are located)
# into the default web serving directory of Nginx inside the container.
# The '.' refers to the current directory where the Dockerfile is located.
COPY . /usr/share/nginx/html

# Expose port 80. This instruction informs Docker that the container
# listens on the specified network ports at runtime. It's more of a
# documentation step; the actual port mapping happens when you run the container
# using the '-p' flag. Nginx inside the container listens on port 80 by default.
EXPOSE 80

# The default command specified in the base Nginx image starts the Nginx server.
# We don't need to override it for this simple static site.
# The default command is typically something like: CMD ["nginx", "-g", "daemon off;"]
# This ensures Nginx runs in the foreground, which is suitable for Docker containers.
