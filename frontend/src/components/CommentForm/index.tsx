import { useEffect, useState } from 'react';
import { DPost } from '../../models/post';
import { DUser } from '../../models/user';
import * as commentService from '../../services/commentService';
import * as userService from '../../services/userService';
import * as authService from '../../services/authService';
import * as forms from '../../utils/forms';
import './styles.css';
import FormTextArea from '../FormTextArea';

type Props = {
    post: DPost;
    onButtonClick: Function;
}

export default function CommentForm({post, onButtonClick} : Props) {

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

    const [formData, setFormData] = useState<any>({
        text: {
            value: "",
            id: "text",
            name: "text",
            type: "text",
            placeholder: "",
            validation: function (value: string) {
                return /^.{3,100}$/.test(value);
            },
            message: "O comentário deve ter entre 3 e 100 caracteres"
        },
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
    
        if (user) {
            requestBody.user = user;
            requestBody.post = post;
            requestBody.date = new Date().toISOString();
    
            const request = commentService.insert(requestBody);

            request
                .then(() => {
                    onButtonClick();

                    setFormData((prevFormData: any) => ({
                        ...prevFormData,
                        text: {
                          ...prevFormData.text,
                          value: ""
                        }
                    }));
                })
                .catch(error => {
                    const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                    setFormData(newInputs);
                });
        }
    }

    return(
            <section id="comment-form-section">
                <div className="comment-form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <div className="form-controls-container">
                            <div>
                                <label htmlFor="">Comentário</label>
                                <FormTextArea
                                    {...formData.text}
                                    className="form-control textarea"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.text.message}</div>
                            </div>
                        </div>
                        <div className="comment-form-buttons">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                    </form>
                </div>
            </section>
    );
}