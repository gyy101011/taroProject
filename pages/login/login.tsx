import Taro from '@tarojs/taro'
import { phoneLogin, sendCode, myWxLogin, getUserInfo } from '@/service/user'
import { isCodeAvailable, isPhoneAvailable } from "@/utils/validate"
import { useAppDispatch } from "@/store"
import { setUserInfo } from "@/store/modules/user"
import { View, Input, Text, Button } from "@tarojs/components"
import { useEffect, useState } from "react"
import './login.scss'


const Login = () => {
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(60);
  const [timer, setTimer] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    code: ''
  });
  const getLoginUserInfo = async () => {
    const res = await getUserInfo();
    if (res.code === 0) {
      dispatch(setUserInfo(res.data));
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      });
    }
  }
  useEffect(() => {
    let interval;
    if (timer) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === 1) {
            clearInterval(interval);
            setTimer(false);
            return 60;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendPhoneCode = async () => {
    if (form.phone && isPhoneAvailable(form.phone)) {
      setTimer(true);
      const res = await sendCode(form.phone);
      if (res.code === 0) {
        Taro.showToast({
          title: '验证码发送成功',
          icon: 'none',
        });
      } else {
        Taro.showToast({
          title: '验证码发送失败',
          icon: 'none',
        });
      }
    } else {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
    }
  };

  const handleLoginClick = async () => {
    if (!form.phone || !isPhoneAvailable(form.phone)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return;
    }

    if (!form.code || !isCodeAvailable(form.code)) {
      Taro.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
      });
      return;
    }

    const res = await phoneLogin(form.phone, form.code);
    if (res.code === 0) {
      Taro.setStorageSync('token', res.data.accessToken);
      getLoginUserInfo();
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
      });

      Taro.switchTab({
        url: '/pages/index/index',
      });
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      });
      return;
    }
  };


  // const wxLogin = () => {
  // };

  const wxLogin = async () => {
    try {
      const res = await Taro.getUserProfile(
        {
          desc: '获取你的昵称、头像、地区及性别',
        }
      );

      const loginRes = await Taro.login();

      console.log(loginRes);

      if (loginRes.code) {
        const wxLoginRes = await myWxLogin(loginRes.code, res.encryptedData, res.iv);

        if (wxLoginRes.code === 0) {
          Taro.showToast({
            title: '登录成功',
            icon: 'success',
          });

          Taro.setStorageSync('token', wxLoginRes.data.accessToken);
          getLoginUserInfo();
          Taro.switchTab({
            url: '/pages/index/index',
          });
        } else {
          Taro.showToast({
            title: wxLoginRes.msg,
            icon: 'none',
          });
        }
      }
    } catch (err) {
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'none',
      });
    }

  };

  const handleInputCode = (e) => {
    setForm({ ...form, code: e.target.value });
  };
  const handleInputPhone = (e) => {
    setForm({ ...form, phone: e.target.value });
  };

  return (
    <View className='loginPage'>
      <View className='top'>
        <View className='title'>验证码登录</View>
        <View className='sinfo'>未注册的手机号验证后自动完成注册</View>
      </View>
      <View className='form'>
        <Input
          className='input'
          type='text'
          placeholder='请输入手机号码'
          value={form.phone}
          onInput={(e) => handleInputPhone(e)}
        />
        <View className='code'>
          <Input
            className='password'
            type='text'
            password
            placeholder='请输入验证码'
            value={form.code}
            onInput={(e) => handleInputCode(e)}
          />
          {
            !timer ? (
              <Text className='btn' onClick={sendPhoneCode} hidden={timer}>发送验证码</Text>
            ) : (
              <Text className='btn' hidden={!timer}>
                {count}秒后重新获取</Text>
            )

          }
        </View>
        <Button className='button' onClick={handleLoginClick}>登录</Button>
        <View className='extra'>
          <View className='caption'>
            <Text>其他方式登录</Text>
          </View>
          <View className='options'>
            <Text className='icon icon-weixin' onClick={wxLogin}>微信一键登录</Text>
          </View>
        </View>
        <View className='tips'>
          登录/注册既视为你同意《服务条款》和《隐私政策》
        </View>
      </View>
    </View>
  );
};

export default Login;




