## Backend Dijango

---

### Khởi động backend (nếu đã có cơ sở dữ liệu)

1. Cài đặt các thư viện (Tại /backend)
```bash
pip install -r requirements.txt
```

2. Chạy migrate database (Tại /backend/bin)
```bash
python manage.py migrate
```

3. Tạo migration (Tại /backend/bin)
```bash
python manage.py makemigrations
```

4. Nạp dữ liệu vào db (Tại /backend/bin)
```bash
python db_csv.py
```

5. Khởi động server
```bash
python manage.py runserver
```

---

### Tạo cơ sở dữ liệu - mysql docker (Nếu chưa có csdl) - Linux/Window

1. Cài đặt docker
   
Windows: Tải và cài Docker Desktop từ: https://www.docker.com/products/docker-desktop

Linux: 
```bash
sudo apt update
sudo apt install docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

2. Cài đặt mysql (bằng lệnh)
```bash
docker run --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  -d mysql:8.0
```

`--name mysql-container`: tên container bạn đặt (tự đặt)

`-e MYSQL_ROOT_PASSWORD=yourpassword`: đặt mật khẩu root (admin123 xem tại `/backend/src/app/settings.py`)

`-e MYSQL_DATABASE=mydb`: tạo sẵn database tên mydb (điền `pharmacy_system` hoặc tự tạo sau)

`-p 3306:3306`: mở cổng để kết nối từ bên ngoài (VD: DBeaver, PHPMyAdmin)

`-v mysql_data:/var/lib/mysql`: lưu data trong volume mysql_data

`-d mysql:8.0`: chạy bản MySQL 8


3. Kiểm tra kết nối
```bash
docker ps
# hoặc docker ps -a
```

4. Khởi động container vừa tạo
- Lệnh chạy lần đầu
```bash
docker exec -it mysql-container mysql -u root -p
```

Lưu ý các lần sau đó thực hiện chạy bằng lệnh sau:

- Khởi động:
```bash
docker start mysql-container
```

- Dừng:
```bash
docker stop mysql-container
```

---

### Tạo cơ sở dữ liệu - mysql (Không dùng docker)
Xem hướng dẫn trong học phần CT467
```bash
https://drive.google.com/drive/folders/12CPj5cC7M2b5HFrTSBPzYI5KDpuV5lWj?usp=sharing
```
