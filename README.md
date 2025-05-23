# 📝 Simple To-Do List PWA — My Cloud Deployment Journey

This project chronicles my hands-on experience building a basic **Progressive Web Application (PWA)** To-Do List, packaging it using **Docker**, and deploying it on **Amazon Web Services (AWS)** using an **EC2 instance** behind an **Application Load Balancer (ALB)**. This was part of my learning journey in **frontend development**, **containerization**, and **cloud deployment**—and is a valuable entry in my cloud engineering portfolio.

---

## 🚀 Project Goal

Create a fully functional and installable To-Do List PWA, containerized with Docker and deployed on AWS infrastructure. Document all the steps, wins, and challenges encountered during the process.

---

## 💡 What I Learned

- Web development with **HTML**, **CSS**, and **JavaScript**
- Saving data locally using `localStorage`
- Key concepts behind **PWAs** (Web Manifest, Service Workers)
- Docker basics: **Dockerfile creation**, image building, container execution
- Deployment on **AWS EC2**
- Configuring an **Application Load Balancer (ALB)**
- Using **AWS Security Groups** effectively
- Importance of cleaning up resources to avoid surprise billing

---

## 🧱 Section 1: Building the Frontend

### 1.1 HTML Structure (`index.html`)
- Input box, button, and task list
- Linked CSS and JS files
- PWA-compatible meta tags and manifest link
- Custom "Install App" button
- `<script>` tag placed before `</body>`

### 1.2 Styling (`style.css`)
- Clean and responsive layout
- Mobile-first tweaks with media queries
- Highlighted install button

### 1.3 JavaScript Logic (`script.js`)
- Functions for **adding**, **deleting**, and **loading** tasks
- Used `localStorage` for persistence
- Captured `beforeinstallprompt` and handled custom installation
- Registered `appinstalled` event to manage install button visibility

#### 🔧 Debugging Tools:
- `console.log()` for script tracing
- Chrome DevTools → Console + Application tabs

#### ⚠️ Common Issues:
- JSON syntax errors in `manifest.json`
- Incorrect file paths for icons and start URLs

---

### 1.5 Service Worker (`sw.js`)
- Added service worker for offline support
- Cached static assets using `cache.addAll()`

#### 🛠 Issues Faced:
- Service worker not registering due to:
  - JS syntax error (missing `}`)
  - Failed cache (404 error for listed assets)

#### ✅ Resolved via:
- Chrome DevTools → Console, Application, and Network tabs
- Incremental logging in `script.js`

---

## 📦 Section 2: Containerizing with Docker

### 2.1 Dockerfile

Used a minimal setup with:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

### 2.2 Building the Image

```bash
docker build -t simple-todo-pwa .
```

---

## ☁️ Section 3: AWS Deployment (HTTP Only)

### 3.1 EC2 Setup

- Launched Free Tier EC2 (Amazon Linux 2023 or Ubuntu 22.04)
- Configured SSH and HTTP access via Security Groups
- Installed Docker and Git
- Cloned GitHub repo and built Docker image
- Ran container: `docker run -d -p 80:80 simple-todo-pwa`

### 3.2 Application Load Balancer (ALB)

- Created Internet-facing ALB
- Configured HTTP listener (port 80)
- Created and attached Target Group
- Modified EC2 Security Group to only accept HTTP from ALB

### 3.3 Access via ALB DNS

- Website accessible via ALB DNS
- PWA install button visible, but **install fails** — HTTPS required

---

## 🧹 Section 4: Resource Cleanup

To prevent unexpected charges:

- Terminated EC2 instance
- Deleted ALB and Target Group
- Removed custom Security Groups

---

## 🔐 Section 5: Future Plan — HTTPS & PWA Installation

### Upcoming Tasks

- 🔑 Purchase domain name
- 📄 Issue SSL certificate with **AWS Certificate Manager**
- 🔄 Add HTTPS listener to ALB
- 🌐 Update DNS to point to ALB
- ✅ Enable PWA install prompt over HTTPS

---

## 📌 Conclusion

This project connected **frontend development**, **containerization**, and **cloud deployment** into a seamless learning experience. From debugging service workers to configuring security groups, every step taught me something new.

**Next stop: full HTTPS deployment and a polished PWA experience. Stay tuned!**
