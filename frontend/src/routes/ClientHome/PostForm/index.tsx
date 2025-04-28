import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import * as forms from '../../../utils/forms';
import * as postService from '../../../services/postService';
import * as categoryService from '../../../services/categoryService';
import * as authService from '../../../services/authService';
import * as userService from '../../../services/userService';
import { Link } from 'react-router-dom';
import { DPostAttachment } from '../../../models/postAttachment';
import { DCategory } from '../../../models/category';
import { DUser } from '../../../models/user';
import { DStatusEnum } from '../../../models/enums/statusEnum';
import FormInput from '../../../components/FormInput';
import FormTextArea from '../../../components/FormTextArea';
import FormSelect from '../../../components/FormSelect';

export default function PostForm() {

    const params = useParams();

    const navigate = useNavigate();

    const isEditing = params.postId !== undefined && params.postId !== 'create';

    const [postAttachment, setPostAttachment] = useState<DPostAttachment>(); // because we send it together

    const [categories, setCategories] = useState<DCategory[]>([]);

    const [dateTime, setDateTime] = useState('');

    const [formData, setFormData] = useState<any>({
        category: {
            value: "",
            id: "category",
            name: "category",
            placeholder: "Categoria",
            validation: function (value: DCategory) {
                return value !== null;
            },
            message: "Categoria é obrigatória"
        },
        author: {
            value: "",
            id: "author",
            name: "author",
            placeholder: "Autor",
            validation: function (value: DUser) {
                return value !== null;
            },
            message: "Autor é obrigatório"
        },
        title: {
            value: "",
            id: "title",
            name: "title",
            type: "text",
            placeholder: "Título",
            validation: function (value: string) {
                return /^.{3,50}$/.test(value);
            },
            message: "Título deve ter entre 3 e 50 caracteres"
        },
        description: {
            value: "",
            id: "description",
            name: "description",
            type: "text",
            placeholder: "Descrição",
            validation: function (value: string) {
                return /^.{3,500}$/.test(value);
            },
            message: "Descrição deve ter entre 3 e 500 caracteres"
        },
        date: {
            value: "",
            id: "date",
            name: "date",
            placeholder: "Data"
        },    
        status: {
            value: null,
            id: "status",
            name: "status",
            placeholder: "Status"
        },
        isUrgent: {
            value: null,
            id: "isUrgent",
            name: "isUrgent",
            placeholder: "É Urgente"
        },

        // postAttachment
        
    });

    useEffect(() => {
        categoryService.findAll()
            .then(response => {
                setCategories(response.data.content);
            });
    }, []);

    const [user, setUser] = useState<DUser>();

    useEffect(() => {
        if(authService.isAuthenticated()){
          userService.findMe()
          .then(response => {
            setUser(response.data);
          })
          .catch(() => {
          });
        }
    }, []);

    const statusOptions = Object.values(DStatusEnum).map((item) => ({
        value: item.name,
        label: item.label,
    }));

    useEffect(() => {
        if (isEditing) {
            postService.findById(Number(params.postId))
                .then(response => {
                    const newFormData = forms.updateAll(formData, response.data);
                    
                    // enums
                    const statusValue = response.data.status;
                    newFormData.status.value = statusOptions.find(option => option.value === statusValue);

                    // postAttachment
    
                    // date
                    setDateTime(response.data.date ? new Date(response.data.date).toISOString().slice(0, 16) : '');
    
                    setFormData(newFormData);

                    setPostAttachment(response.data.postAttachment);
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

        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) {
            setFormData(formDataValidated);
            return;
        }

        const requestBody = forms.toValues(formData);

        requestBody.author = user;

        // date format
        requestBody.date = dateTime;

        // enum format
        //requestBody.status = formData.status.value.value;

        // nullable fields
        ['date', 'status', 'isUrgent', 'postAttachment'].forEach((field) => {
            if (requestBody[field] === "") {
                requestBody[field] = null;
            }
        });

        if (isEditing) {
            requestBody.id = Number(params.postId);
        }

        const request = isEditing
            ? postService.update(requestBody)
            : postService.insert(requestBody);

        request
            .then(() => {
                navigate("/posts");
            })
            .catch(error => {
                const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                setFormData(newInputs);
            });
    }
    
    return(
        <main>
            <section id="post-form-section" className="container">
                <div className="post-form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Dados da Publicação</h2>
                        <div className="form-controls-container">
                            <div>
                                <label htmlFor="">Título</label>
                                <FormInput
                                    {...formData.title}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.title.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Descrição</label>
                                <FormTextArea
                                    {...formData.description}
                                    className="form-control textarea"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.description.message}</div>
                            </div>
                            <div>
                                <label htmlFor="">Categoria</label>
                                <FormSelect
                                    {...formData.category}
                                    className="form-control form-select-container"
                                    options={categories}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "category", obj);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.name}
                                    getOptionValue={(obj: any) => String(obj.id)}
                                />
                                <div className="form-error">{formData.category.message}</div>
                            </div>
                        </div>
                        <div className="post-form-buttons">
                            <Link to="/posts">
                                <button type="reset" className="btn btn-inverse">Cancelar</button>
                            </Link>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}