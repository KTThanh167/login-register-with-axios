import type { Rule } from 'ant-design-vue/es/form';

// Kiểm tra mật khẩu phải có ít nhất 6 ký tự, 1 hoa, 1 thường, 1 số
export const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

// Hàm validate mật khẩu dùng chung
export const validatePassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập mật khẩu!');
  }
  if (!password_regex.test(value)) {
    return Promise.reject(
      'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số!'
    );
  }
  return Promise.resolve();
}

export const gmail_regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const validateGmail = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('Vui lòng nhập email!');
  if (!gmail_regex.test(value)) return Promise.reject('Email phải có định dạng @gmail.com!');
  return Promise.resolve();
};
