import { http } from "@/utils/http";

export const sendCode = (phone: string) => {
  return http<null>({
    method: "POST",
    url: "/common/sendSms?phone=" + phone,
  });
};

export const phoneLogin = (phone: string, code: string) => {
  return http<LoginResult>({
    method: "POST",
    url: `/auth/login?phone=${phone}&code=${code}`,
  });
};

export const myWxLogin = (code: string, encryptedData: string, iv: string) => {
  return http<LoginResult>({
    method: "POST",
    url: "/auth/weChatLogin",
    data: {
      code,
      encryptedData,
      iv,
    },
  });
};

export const logout = () => {
  return http<null>({
    method: "POST",
    url: "/auth/logout",
  });
};

export const getUserInfo = () => {
  return http<UserInfo>({
    method: "GET",
    url: "/user/info",
  });
};
