import { FormEvent, useState } from "react";
import { FiArrowRight, FiRotateCw } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import '../styles/SignUp.css';

interface ISignUpResponse {
  status: 'success' | 'error';
  message: string;
}

function SignUp() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('The password and its confirmation did not match!');
      return;
    }
    setLoading(true);
    const response = await api.post<ISignUpResponse>('/signup', {
      email,
      password,
    });
    if(response.data.status === 'success'){
      setLoading(false);
      toast.success('Usuário criado com sucesso! Faça login para continuar.');
      history.push('/signin');
    } else {
      setLoading(false);
      toast.error(`Erro na criação de usuário: ${response.data.message === 'ALREADY EXISTS' ? 'Esse usuário já existe no sistema!' : 'unknown'}`);
    }
  }

  return (
    <div className="box">
      <div className="side">
        <main>
          <h1>Sign up</h1>
          <div className="text">Get started if you don't have an account.</div>
        </main>
        <Link to="/signin" className="button">
          <div className="text">
            Have an account?
                </div>
          <div id="login">
            <strong>
              Sign in
                  </strong>
            <FiArrowRight size={24} color="#FFF" />
          </div>
        </Link>
      </div>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <input type="email" name="email" id="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} required />
        <input type="password" name="password" id="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} required />
        <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirm password" onChange={(event) => setConfirmPassword(event.target.value)} required />
        <button type="submit">
          {!loading ? "Sign up" : <FiRotateCw className="loading" size={24} />}
        </button>
      </form>
    </div>
  );
}

export default SignUp;