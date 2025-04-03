import ButtonPrimary from "../ButtonPrimary";

type Props = {
    message: string;
    onDialogClose: Function;
}

export default function DialogInfo({ message, onDialogClose }: Props) {

    return (
        <div className="dialog-background" onClick={() => onDialogClose()}>
            <div className="dialog-box" onClick={(event) => event.stopPropagation() }>
                <h2>{message}</h2>
                <div className="dialog-btn" onClick={() => onDialogClose()}>
                    <ButtonPrimary text="Ok" />
                </div>
            </div>
        </div>
    )
}
