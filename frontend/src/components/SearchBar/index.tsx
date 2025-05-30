import { useState } from 'react';
import './styles.css';

type Props = {
    onSearch: Function;
}

export default function SearchBar({ onSearch }: Props) {

    const [text, setText] = useState("");

    function handleChange(event: any) {
        setText(event.target.value);
    }

    function handleResetClick() {
        setText("");
        onSearch(text);
    }
    
    function handleSubmit(event: any) {
        event.preventDefault();
        onSearch(text);
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <button type="submit">🔎︎</button>
            <input 
                value={text}
                type="text" 
                placeholder="Nome" 
                onChange={handleChange}
            />
            <button onClick={handleResetClick}></button>
        </form>
    );
}
