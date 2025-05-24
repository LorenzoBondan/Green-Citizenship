import './styles.css';
import { useContext, useState } from 'react';
import * as authService from '../../../services/authService';
import * as userService from '../../../services/userService';
import * as forms from '../../../utils/forms';
import { useNavigate } from 'react-router-dom';
import { ContextToken } from '../../../utils/context-token';
import FormInput from '../../../components/FormInput';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { AuthContext } from '../../../utils/auth-context';
import { Link } from 'react-router-dom';

export default function Login() {

    const { setUser } = useContext(AuthContext);

    const { setContextTokenPayload } = useContext(ContextToken);

    const navigate = useNavigate();

    const [submitResponseFail, setSubmitResponseFail] = useState(false);

    const [formData, setFormData] = useState<any>({
        username: {
            value: "",
            id: "username",
            name: "username",
            type: "text",
            placeholder: "Email",
            validation: function (value: string) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.toLowerCase());
            },
            message: "Email inválido",
        },
        password: {
            value: "",
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Senha",
        }
    });

    function handleSubmit(event: any) {
        event.preventDefault();

        setSubmitResponseFail(false);

        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) {
            setFormData(formDataValidated);
            return;
        }

        authService.loginRequest(forms.toValues(formData))
            .then(response => {
                authService.saveAccessToken(response.data.access_token);
                setContextTokenPayload(authService.getAccessTokenPayload());
                userService.findMe().then(res => {
                    setUser(res.data);
                    navigate("/");
                });
                navigate("/");
            })
            .catch(() => {
                setSubmitResponseFail(true);
            });
    }

    function handleInputChange(event: any) {
        setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value));
    }

    function handleTurnDirty(name: string) {
        setFormData(forms.dirtyAndValidate(formData, name));
    }

    return (
        <main>
            <section id="login-section" className="container">
                <div className="login-form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <div className="form-controls-container-login">
                            <div>
                                <FormInput
                                    {...formData.username}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.username.message}</div>
                            </div>
                            <div>
                                <FormInput
                                    {...formData.password}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {
                            submitResponseFail &&
                            <div className="form-global-error">
                                Usuário ou senha inválidos
                            </div>
                        }

                        <div className="login-form-buttons mt20">
                            <ButtonPrimary text='Login' />
                        </div>

                        <p className='mt20' style={{color:"green"}}>Não tem conta? <Link to="/register">Cadastre-se</Link></p>

                    </form>
                </div>
            </section>
        </main>
    );
}