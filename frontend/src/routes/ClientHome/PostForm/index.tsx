import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useContext, useEffect, useState } from 'react';
import * as forms from '../../../utils/forms';
import * as postService from '../../../services/postService';
import * as categoryService from '../../../services/categoryService';
import * as postAttachmentService from "../../../services/postAttachmentService";
import { Link } from 'react-router-dom';
import { DCategory } from '../../../models/category';
import { DUser } from '../../../models/user';
import { DStatusEnum } from '../../../models/enums/statusEnum';
import FormInput from '../../../components/FormInput';
import FormTextArea from '../../../components/FormTextArea';
import FormSelect from '../../../components/FormSelect';
import { AuthContext } from '../../../utils/auth-context';
import FormCheckbox from '../../../components/FormCheckBox';
import { DPost } from '../../../models/post';

export default function PostForm() {

    const params = useParams();

    const navigate = useNavigate();

    const isEditing = params.postId !== undefined && params.postId !== 'create';

    const { user } = useContext(AuthContext);

    const [post, setPost] = useState<DPost | null>(null);

    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [attachmentName, setAttachmentName] = useState<string>('');

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB em bytes

    const [fileError, setFileError] = useState<string | null>(null);

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
            value: false,
            id: "isUrgent",
            name: "isUrgent",
            placeholder: "É Urgente"
        },
    });

    useEffect(() => {
        categoryService.findAll()
            .then(response => {
                setCategories(response.data.content);
            });
    }, []);

    const statusOptions = Object.values(DStatusEnum).map((item) => ({
        value: item.name,
        label: item.label,
    }));

    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        setFormData(forms.updateAndValidate(formData, event.target.name, checked));
    }

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            postService.findById(Number(params.postId))
                .then(response => {
                    const responsePost = response.data;
                    setPost(responsePost);

                    const newFormData = forms.updateAll(formData, response.data);
                    
                    // enums
                    const statusValue = response.data.status;
                    newFormData.status.value = statusOptions.find(option => option.value === statusValue)?.value;

                    // boolean
                    newFormData.isUrgent.value = !!response.data.isUrgent;
    
                    // date
                    setDateTime(response.data.date ? new Date(response.data.date).toISOString().slice(0, 16) : '');
    
                    setFormData(newFormData);
                });
        }
    }, []);

    useEffect(() => {
        if (post?.postAttachment?.attachment?.binary?.bytes) {
            const base64 = post.postAttachment.attachment.binary.bytes;
            const mimeType = /*post.postAttachment.attachment.mimeType ||*/ "image/png"; // use o tipo correto, se disponível
            setPreviewUrl(`data:${mimeType};base64,${base64}`);
        }
    }, [post]);

    useEffect(() => {
    if (attachmentFile) {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        };
        fileReader.readAsDataURL(attachmentFile);
    }
    }, [attachmentFile]);

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
        requestBody.date = dateTime;

        ['date', 'status', 'isUrgent', 'postAttachment'].forEach((field) => {
            if (requestBody[field] === "") {
                requestBody[field] = null;
            }
        });

        if (isEditing) {
            requestBody.id = Number(params.postId);
        } else {
            requestBody.status = DStatusEnum.IN_REVISION.name;
        }

        const request = isEditing
            ? postService.update(requestBody)
            : postService.insert(requestBody);

        request
            .then(response => {
                const createdPostId = isEditing
                    ? requestBody.id
                    : response.data.id;

                // se houver imagem, criamos o attachment
                if (attachmentFile) {
                    const postHasAttachment = post?.postAttachment?.id;

                    const handleSuccess = () => navigate("/posts");
                    const handleError = () => {
                        alert("Post salvo, mas falha ao enviar o anexo.");
                        navigate("/posts");
                    };

                    if (isEditing && postHasAttachment) {
                        postAttachmentService
                            .update(post.postAttachment.id, requestBody.id, attachmentFile, attachmentName)
                            .then(handleSuccess)
                            .catch(handleError);
                    } else {
                        postAttachmentService
                            .insert(createdPostId, attachmentFile, attachmentName)
                            .then(handleSuccess)
                            .catch(handleError);
                    }
                }
            })
            .catch(error => {
                const newInputs = forms.setBackendErrors(formData, error.response?.data?.errors || {});
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
                            <div className='form-control-wrapper-full'>
                                <label htmlFor="">Descrição</label>
                                <FormTextArea
                                    {...formData.description}
                                    className="form-control textarea"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.description.message}</div>
                            </div>
                            <FormCheckbox
                                id={formData.isUrgent.id}
                                name={formData.isUrgent.name}
                                label="É Urgente?"
                                checked={formData.isUrgent.value}
                                onChange={handleCheckboxChange}
                            />
                            <div className="form-error">{formData.isUrgent.message}</div>
                            {previewUrl && (
                                <div className='form-control-wrapper-full form-image-container'>
                                    <img
                                        src={previewUrl}
                                        alt={post?.postAttachment?.attachment?.name || "Pré-visualização da imagem"}
                                        className="form-image-preview"
                                        style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "10px" }}
                                    />
                                </div>
                            )}
                            <div className="form-control-wrapper-full">
                                <label htmlFor="attachmentFile">Imagem (opcional)</label>
                                <input
                                type="file"
                                id="attachmentFile"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;

                                    if (file && file.size > MAX_FILE_SIZE) {
                                        setFileError("O arquivo é muito grande. O tamanho máximo permitido é 1MB.");
                                        setAttachmentFile(null);
                                        return;
                                    }

                                    setFileError(null);
                                    setAttachmentFile(file);
                                    if (file) setAttachmentName(file.name);
                                }}
                                />
                                {fileError && (
                                <div className="form-error" style={{ marginTop: "5px" }}>
                                    {fileError}
                                </div>
                                )}
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