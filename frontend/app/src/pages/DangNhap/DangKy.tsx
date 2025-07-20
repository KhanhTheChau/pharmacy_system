import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { register } from "../../services/authApi";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Bắt buộc nhập tên tài khoản"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Bắt buộc nhập email"),
  password: Yup.string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .required("Bắt buộc nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

const DangKy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, actions) => {
            try {
              const res = await register({
                username: values.username,
                password: values.password,
                email: values.email,
              });

              if (res.success) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/dang-nhap");
              } else {
                alert(res.message || "Đăng ký thất bại!");
              }
            } catch (err) {
              alert("Có lỗi xảy ra khi đăng ký.");
              console.log(err)
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="username" className="block font-medium mb-1">
                  Tên đăng nhập
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-medium mb-1">
                  Mật khẩu
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium mb-1"
                >
                  Nhập lại mật khẩu
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full border px-3 py-2 rounded"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#12B0C2] text-white w-full py-2 rounded hover:bg-[#0E8DA1] transition"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
                <NavLink
                  to="/admin/dang-nhap"
                  className="text-[#12B0C2] hover:underline font-medium text-sm"
                >
                  Đăng nhập
                </NavLink>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DangKy;
