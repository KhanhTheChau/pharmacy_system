// src/pages/DangNhap.tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Bắt buộc nhập tên tài khoản'),
  password: Yup.string()
    .min(8, 'Mật khẩu ít nhất 8 ký tự')
    .required('Bắt buộc nhập mật khẩu'),
});

const DangNhap = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values, actions) => {
            // TODO: Gọi API đăng nhập tại đây nhé
            console.log('form đăng nhạp:', values);
            alert(`Bạn đăng nhập tài khoản: ${values.username} & ${values.password}`)
            
            // Viết API thì bỏ setTimeOUt đi, t ví dụ thôi
            setTimeout(() => {
              actions.setSubmitting(false); 
            }, 1000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Tên đăng nhập
                </label>
                <Field
                  id="username"
                  type="text"
                  name="username"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="username"
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
                  type="password"
                  name="password"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#12B0C2] text-white w-full py-2 rounded hover:bg-[#0E8DA1] transition"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Chưa có tài khoản? </span>
                <NavLink
                  to="/api/v1/dang-ky"
                  className="text-[#12B0C2] hover:underline font-medium text-sm"
                >
                  Đăng ký ngay
                </NavLink>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DangNhap;
