## Tài liệu triển khai


### Triển khai bằng Docker
Lưu ý: Môi trường nextjs sẽ hardcode các env NEXT_PUBLIC_* khi build nên nếu muốn deploy an toàn thì sẽ phải build image mới cho mỗi môi trường (dev/staging/prod) với các biến môi trường tương ứng.

**Yêu cầu hệ thống:**
- Máy chủ Linux
- Quyền root
**Yêu cầu phần mềm:**
- Docker (khuyến nghị v20+)
- Docker Compose (tùy chọn, cho thiết lập nhiều dịch vụ)
- Bash (cho script build)

**Các bước:**
1. Clone repository:
	```sh
	git clone https://github.com/bestfizzz/Netnam_AI_Search.git
	cd Netnam_AI_Search
	```

2. Bỏ comment dòng output Docker trong `next.config.ts`:
	```js
	// output: 'standalone', // Docker
	```

3. Chuẩn bị và chạy script build Docker (`docker_build.sh`):
	```sh
	#!/bin/bash
	set -e
	NEXT_PUBLIC_URL='http://localhost:3000'
	NEXT_PUBLIC_BACKEND_URL='http://10.30.12.151:3000/api/v1'
	DOCKER_BUILD_NAME="ai-search-client"
	echo "Đang build Docker image với build args..."
	echo "NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL"
	echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL"
	docker build \
	  --build-arg NEXT_PUBLIC_URL="$NEXT_PUBLIC_URL" \
	  --build-arg NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
	  -t $DOCKER_BUILD_NAME .
	chmod +x docker_build.sh
	./docker_build.sh
	```

4. Khởi động container (chọn một):
	```sh
	# Sử dụng docker-compose cho thiết lập nhiều dịch vụ
	docker-compose up -d
	# hoặc
	docker run -d -p 3000:3000 --env JWT_SECRET="secret" $DOCKER_BUILD_NAME
	```


### Triển khai thông thường (Node.js)
Lưu ý: Trong Production, set cookie chỉ hoạt động khi server chạy https.(do browser)

**Các bước:**

1. **Xuất các biến môi trường** trong terminal Linux trước khi khởi động service hoặc cài đặt:

```sh
export APP_NAME="Netnam_AI_Search"
export NEXT_PUBLIC_URL="http://localhost:3000"
export NEXT_PUBLIC_BACKEND_URL="http://10.30.12.151:3000/api/v1"
export JWT_SECRET="$(openssl rand -hex 32)"
export NODE_ENV="production"
```

2. **Clone repository vào `/opt/${APP_NAME}`**:

```sh
sudo mkdir -p /opt/${APP_NAME}
sudo chown $USER:$USER /opt/${APP_NAME}
git clone https://github.com/bestfizzz/Netnam_AI_Search.git /opt/${APP_NAME}
cd /opt/${APP_NAME}
```

3. **Cài đặt Node.js bằng nvm (khuyến nghị)**:

```sh
# Tải và cài đặt nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Nạp lại shell để dùng nvm:
. "$HOME/.nvm/nvm.sh"

# Cài đặt Node.js phiên bản 24:
nvm install 24

# Kiểm tra phiên bản Node.js:
node -v   # Kết quả nên là "v24.11.1"

# Kiểm tra phiên bản npm:
npm -v    # Kết quả nên là "11.6.2"
```

4. **Tạo file `.env`** và điền các biến môi trường:

```sh
cat <<EOF > .env
APP_NAME=${APP_NAME}
NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
JWT_SECRET=${JWT_SECRET}
NODE_ENV=${NODE_ENV}
EOF
```

5. **Cài đặt dependencies**:

```sh
npm install
```

6. **Build project (nếu cần)**:

```sh
npm run build
```

7. **Khởi động ứng dụng** (chỉ test ban đầu):

```sh
npm start
# hoặc cho môi trường phát triển
npm run dev
```

8. **Chạy ứng dụng như service (systemd)**

* **Tạo user chuyên dụng cho Next.js (không đăng nhập, thuộc nhóm nodejs)**:

```sh
sudo groupadd nodejs
sudo useradd -r -s /usr/sbin/nologin -G nodejs nextjs
sudo chown -R nextjs:nodejs /opt/${APP_NAME}
sudo chmod 711 /opt
```

* **Kiểm tra và export đường dẫn npm**:

```sh
n=$(which node)
n=${n%/bin/node}
chmod -R 755 $n/bin/*
sudo cp -r $n/{bin,lib,share} /usr/local
# Thường sẽ là /usr/local/bin/npm hoặc /usr/bin/npm
```

* **Tạo file systemd service**:

```sh
sudo bash -c "cat > /etc/systemd/system/${APP_NAME}.service << EOF
[Unit]
Description=Netnam AI Search Node.js Service
After=network.target

[Service]
Type=simple
User=nextjs
WorkingDirectory=/opt/${APP_NAME}
ExecStart=/usr/local/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF"
```

* **Khởi động và kiểm tra service**:

```sh
sudo systemctl daemon-reload
sudo systemctl enable ${APP_NAME}
sudo systemctl restart ${APP_NAME}
sudo systemctl status ${APP_NAME}
```

9. **Chạy ứng dụng qua PM2**:

```sh
npm install -g pm2
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup
```
---