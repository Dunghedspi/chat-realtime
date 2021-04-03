import React from 'react';
import './Signin.css';
import { AuthApi } from '../../apis/AuthApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthAction } from '../../actions/auth.action';
import * as toastify from '../../utils/toastify';
import * as yup from 'yup';

function Form({ option, onSubmit, methods }) {
  const { register, control, handleSubmit, errors } = methods;

  return (
    <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
      <div
        className={
          'account-form-fields ' +
          (option === 1 ? 'sign-in' : option === 2 ? 'sign-up' : 'forgot')
        }
      >
        <input
          id="email"
          name="email"
          type="email"
          placeholder="E-mail"
          required
          ref={register}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required={option === 1 || option === 2 ? true : false}
          disabled={option === 3 ? true : false}
          ref={option === 3 ? null : register}
        />
        <input
          id="repeat-password"
          name="repeatPassword"
          type="password"
          placeholder="Repeat password"
          required={option === 2 ? true : false}
          disabled={option === 1 || option === 3 ? true : false}
          ref={option === 2 ? register : null}
        />
      </div>
      <button className="btn-submit-form" type="submit">
        {option === 1 ? 'Sign in' : option === 2 ? 'Sign up' : 'Reset password'}
      </button>
    </form>
  );
}

const schema = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().required(),
});
export default function AuthPage() {
  const [option, setOption] = React.useState(1);
  const navigation = useNavigate();
  const methods = useForm({ validationSchema: schema, mode: 'onBlur' });
  const dispatch = useDispatch();
  const handleSubmit = async payload => {
    switch (option) {
      case 1:
        {
          const user = await AuthApi.SignIn(payload);
          console.log(user);
          if (user) {
            toastify.toastifySuccess('Logged in successfully');
            dispatch(AuthAction.signIn(user));
            navigation('/');
          } else {
            toastify.toastifyError('Email or password is incorrect');
          }
        }
        break;

      case 2:
        console.log(payload);
        if (payload.password === payload.repeatPassword) {
          const isSignUp = await AuthApi.SignUp(payload);
          if (isSignUp) {
            toastify.toastifySuccess('Create Account Success');
            toastify.toastifyInfo('Please login again');
            setOption(1);
          } else {
            toastify.toastifyError('Email is already in use!');
          }
        } else {
          toastify.toastifyError('Passwords do not match');
        }
        break;

      case 3:
        const isReset = await AuthApi.ForgotPassword(payload);
        if (isReset) {
          toastify.toastifySuccess('password reset was successful');
          toastify.toastifySuccess('check your email inbox');
        } else {
          toastify.toastifyError('Account does not exist!');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="auth-box">
      <div className="container">
        <header>
          <div
            className={
              'header-headings ' +
              (option === 1 ? 'sign-in' : option === 2 ? 'sign-up' : 'forgot')
            }
          >
            <span>Sign in to your account</span>
            <span>Create an account</span>
            <span>Reset your password</span>
          </div>
        </header>
        <ul className="options">
          <li
            className={option === 1 ? 'active' : ''}
            onClick={() => setOption(1)}
          >
            Sign in
          </li>
          <li
            className={option === 2 ? 'active' : ''}
            onClick={() => setOption(2)}
          >
            Sign up
          </li>
          <li
            className={option === 3 ? 'active' : ''}
            onClick={() => setOption(3)}
          >
            Forgot
          </li>
        </ul>
        <Form option={option} onSubmit={handleSubmit} methods={methods} />
        <footer>
          <a href="https://facebook.com/dunghedspi" target="_blank">
            Dunghedspi
          </a>
        </footer>
      </div>
    </div>
  );
}
