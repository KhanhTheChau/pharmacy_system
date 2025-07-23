

## Frontend React Application

### Mô tả

Ứng dụng frontend React kết nối với backend Django qua API, sử dụng Axios để gọi các endpoint.

---

### Công nghệ chính

- Tailwindcss

- Typescript

- Thư viện hổ trợ react (như `recharts`, `react-toastify`, ...)

- Thư viện hổ trợ xuất file `xlsx`, ...

- Thư viện hổ trợ validation `formik` và `yup`

- `axios` thư viện hổ trợ call APIAPI

- ...v.v...

---

### Yêu cầu

- Node.js (phiên bản >= 16)
- npm hoặc yarn
- Backend Django đang chạy trên `http://localhost:8000` hoặc port khác cũng được

---

### Cài đặt

1. Clone repo frontend (nếu chưa)

```bash
git clone <url-repo-frontend>
cd <thư-mục-frontend> # fontend/app
```

2. Cài đặt thư viện 

```bash
npm install
# hoặc
yarn install
```

3. Cấu hình URL kết nối Backend

Vào file frontend/app/.env (Kiểm tra địa chỉ server backend)

```ts
// Địa chỉ máy chủ backend
VITE_API_URL=http://localhost:8000/api/v1/

```

4. Khởi động web
```bash
npm run dev
```

5. fix bug
*error*: Some issues need review, and may require choosing a different dependency.
- npm cache clean --force
- Xóa node_modules và package-lock.json
- npm install
