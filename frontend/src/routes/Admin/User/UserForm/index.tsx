import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as forms from '../../../../utils/forms';
import * as userService from '../../../../services/userService';
import * as roleService from '../../../../services/roleService'
import { DRole } from '../../../../models/user';
import FormInput from '../../../../components/FormInput';
import FormSelect from '../../../../components/FormSelect';
import FormLabel from '../../../../components/FormLabel';

export default function UserForm() {

    const params = useParams();

    const navigate = useNavigate();

    const isEditing = params.userId !== 'create';

    const [roles, setRoles] = useState<DRole[]>([]);

    const [formData, setFormData] = useState<any>({
        name: {
            value: "",
            id: "name",
            name: "name",
            type: "text",
            placeholder: "Nome",
            validation: function (value: string) {
                return /^.{3,50}$/.test(value);
            },
            message: "Nome deve ter entre 3 e 50 caracteres"
        },
        password: {
            value: "",
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Senha",
            validation: function (value: string) {
                return /^.{3,250}$/.test(value);
            },
            message: "Senha deve ter entre 3 e 250 caracteres"
        },
        email: {
            value: "",
            id: "email",
            name: "email",
            type: "text",
            placeholder: "Email",
            validation: function (value: string) {
                return /^.{3,50}$/.test(value);
            },
            message: "Email deve ter entre 3 e 50 caracteres"
        },
        roles: {
            value: [],
            id: "roles",
            name: "roles",
            placeholder: "Papéis",
            validation: function (value: DRole[]) {
                return value.length > 0;
            },
            message: "Escolha ao menos um papel"
        }

    });

    useEffect(() => {
        roleService.findAll()
            .then(response => {
                setRoles(response.data.content);
            });
    }, []);

    useEffect(() => {
        if (isEditing) {
            userService.findById(Number(params.userId))
                .then(response => {
                    const newFormData = forms.updateAll(formData, response.data);
                    setFormData(newFormData);
                });
        }
    }, []);

    function handleInputChange(event: any) {
        setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value));
    }

    function handleTurnDirty(name: string) {
        setFormData(forms.dirtyAndValidate(formData, name));
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        const successMessage = isEditing ? 'Usuário editado!' : 'Usuário Inserido!';

        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) {
            setFormData(formDataValidated);
            return;
        }

        const requestBody = forms.toValues(formData);

        if (isEditing) {
            requestBody.id = Number(params.userId);
        }

        const request = isEditing
            ? userService.update(requestBody)
            : userService.insert(requestBody);

        request
            .then(() => {
                //toast.success(successMessage);
                navigate("/admin/users");
            })
            .catch(error => {
                //toast.error(error.response.data.error);
                const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                setFormData(newInputs);
            });
    }  
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Usuário</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Nome" isRequired />
                                <FormInput
                                    {...formData.name}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.name.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Senha" isRequired />
                                <FormInput
                                    {...formData.password}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.password.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Email" isRequired />
                                <FormInput
                                    {...formData.email}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.email.message}</div>
                            </div>
                            <div>
                                <FormSelect
                                    {...formData.roles}
                                    className="form-control form-select-container"
                                    options={roles}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "roles", obj);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => obj.authority}
                                    getOptionValue={(obj: any) => String(obj.id)}
                                />
                                <div className="form-error">{formData.roles.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/admin/users">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}