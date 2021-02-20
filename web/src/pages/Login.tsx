import { FormEvent, useEffect, useState } from "react";
import { FiArrowRight, FiEye, FiEyeOff, FiRotateCw } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import api from "../api/api";
import '../styles/Login.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ISignInResponse {
  status: 'success' | 'error';
  message: string;
  token?: string;
}

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      history.push('/content');
    }
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await api.post<ISignInResponse>('/signin', {
      email,
      password,
    });
    if (response.data.status === "error") {
      toast.error(`Erro no login: ${response.data.message}`, {
      });
      if (response.data.message === "USER DOES NOT EXIST") {
        history.push('/signup');
      }
      setLoading(false);
      return;
    }
    if (!response.data.token) {
      toast.error('Erro na autenticação');
      return;
    }
    setLoading(false);
    toast.success('Usuário logado com sucesso!');
    localStorage.setItem('token', response.data.token)
    history.push('/content');
  }

  return (
    <div className="box">
      <div className="side">
        <main>
          <h1>Sign in</h1>
          <div className="text">Access your account.</div>
        </main>
        <Link to="/signup" className="button">
          <div className="text">
            Don't have an account?
                </div>
          <div id="login">
            <strong>
              Sign up
                  </strong>
            <FiArrowRight size={24} color="#FFF" />
          </div>
        </Link>
      </div>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <input className="input" type="email" name="email" id="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
        <div className="input">
          <input type={showPass ? "text" : "password"} name="password" id="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
          {showPass ? (
            <span onClick={() => setShowPass(!showPass)}><FiEye size={16} color="rgba(0,0,0,0.5)" /></span>
          ) : (
              <span onClick={() => setShowPass(!showPass)}><FiEyeOff size={16} color="rgba(0,0,0,0.5)" /></span>
            )
          }
        </div>
        <button type="submit">
          {!loading ? "Sign in" : <FiRotateCw className="loading" size={24} />}
        </button>
      </form>
    </div>
  );
}

export default Login;