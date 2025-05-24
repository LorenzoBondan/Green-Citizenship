import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../../../services/userService';
import { DUser } from '../../../../models/user';
import ButtonInverse from '../../../../components/ButtonInverse';
import SearchBar from '../../../../components/SearchBar';
import ButtonNextPage from '../../../../components/ButtonNextPage';
import DialogInfo from '../../../../components/DialogInfo';
import DialogConfirmation from '../../../../components/DialogConfirmation';
import DropdownMenu from '../../../../components/DropdownMenu';

type QueryParams = {
    page: number;
    name: string;
}

export default function UserList() {

    const navigate = useNavigate();

    const [dialogInfoData, setDialogInfoData] = useState({
        visible: false,
        message: "Sucesso!"
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    const [isLastPage, setIsLastPage] = useState(false);

    const [users, setUsers] = useState<DUser[]>([]);

    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        name: ""
    });

    useEffect(() => {
        userService.findAll(queryParams.name, queryParams.page, 8, "name,asc")
            .then(response => {
                const nextPage = response.data.content;
                setUsers(users.concat(nextPage));
                setIsLastPage(response.data.last);
            });
    }, [queryParams]);

    function handleNewChallengeClick() {
        navigate("/admin/users/create");
    }

    function handleSearch(searchText: string) {
        setUsers([]);
        setQueryParam({ ...queryParams, page: 0, name: searchText });
    }

    function handleNextPageClick() {
        setQueryParam({ ...queryParams, page: queryParams.page + 1 });
    }

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleUpdateClick(userId: number) {
        navigate(`/admin/users/${userId}`);
    }

    function handleDeleteClick(userId: number) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: userId, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, userId: number) {
        if (answer) {
            userService.deleteById(userId)
                .then(() => {
                    setUsers([]);
                    setQueryParam({ ...queryParams, page: 0 });
                })
                .catch(error => {
                    setDialogInfoData({
                        visible: true,
                        message: error.response.data.error
                    })
                });
        }

        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Usuários</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                <table className="table mb20 mt20">
                    <thead>
                        <tr>
                            <th className="tb576">Código</th>
                            <th className="txt-left">Nome</th>
                            <th className="txt-left">Email</th>
                            <th className="txt-left">Papéis</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users
                            .map(user => (
                                <tr key={user.id}>
                                    <td className="tb576">{user.id}</td>
                                    <td className="txt-left">{user.name}</td>
                                    <td className="txt-left">{user.email}</td>
                                    <td className="txt-left">{user.roles.map(role => role.authority).join(", ")}</td>
                                    <td>
                                        <DropdownMenu
                                            onEdit={() => handleUpdateClick(user.id)}
                                            onDelete={() => handleDeleteClick(user.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    !isLastPage &&
                    <ButtonNextPage onNextPage={handleNextPageClick} />
                }
            </section>

            {
                dialogInfoData.visible &&
                <DialogInfo
                    message={dialogInfoData.message}
                    onDialogClose={handleDialogInfoClose}
                />
            }

            {
                dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }
        </main>
    );
}