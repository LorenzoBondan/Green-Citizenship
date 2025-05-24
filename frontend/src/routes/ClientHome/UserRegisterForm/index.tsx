import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as forms from '../../../utils/forms';
import * as userService from '../../../services/userService';
import FormInput from '../../../components/FormInput';
import FormLabel from '../../../components/FormLabel';

export default function UserRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: {
      value: "",
      id: "name",
      name: "name",
      type: "text",
      placeholder: "Nome",
      validation: (value: string) => /^.{3,50}$/.test(value),
      message: "Nome deve ter entre 3 e 50 caracteres"
    },
    password: {
      value: "",
      id: "password",
      name: "password",
      type: "password",
      placeholder: "Senha",
      validation: (value: string) => /^.{3,250}$/.test(value),
      message: "Senha deve ter entre 3 e 250 caracteres"
    },
    email: {
      value: "",
      id: "email",
      name: "email",
      type: "text",
      placeholder: "Email",
      validation: (value: string) => /^.{3,50}$/.test(value),
      message: "Email deve ter entre 3 e 50 caracteres"
    }
  });

  function handleInputChange(event: any) {
    setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value));
  }

  function handleTurnDirty(name: string) {
    setFormData(forms.dirtyAndValidate(formData, name));
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    const formDataValidated = forms.dirtyAndValidateAll(formData);
    if (forms.hasAnyInvalid(formDataValidated)) {
      setFormData(formDataValidated);
      return;
    }

    const requestBody = forms.toValues(formData);
    requestBody.roles = [{ id: 1 }];

    userService.insert(requestBody)
      .then(() => {
        // toast.success("Cadastro realizado com sucesso!");
        navigate("/login");
      })
      .catch(error => {
        // toast.error("Erro ao cadastrar.");
        const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
        setFormData(newInputs);
      });
  }

  return (
    <main>
      <section id="form-section" className="container">
        <div className="form-container mt20">
          <form className="card form" onSubmit={handleSubmit}>
            <h2>Crie sua conta</h2>
            <div className="form-controls-container">
              <div>
                <FormLabel text="Nome" isRequired />
                <FormInput {...formData.name} className="form-control" onTurnDirty={handleTurnDirty} onChange={handleInputChange} />
                <div className="form-error">{formData.name.message}</div>
              </div>
              <div>
                <FormLabel text="Senha" isRequired />
                <FormInput {...formData.password} className="form-control" onTurnDirty={handleTurnDirty} onChange={handleInputChange} />
                <div className="form-error">{formData.password.message}</div>
              </div>
              <div>
                <FormLabel text="Email" isRequired />
                <FormInput {...formData.email} className="form-control" onTurnDirty={handleTurnDirty} onChange={handleInputChange} />
                <div className="form-error">{formData.email.message}</div>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">Cadastrar</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
