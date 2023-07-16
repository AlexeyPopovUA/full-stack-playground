import {useAtom} from 'jotai'
import React, {useCallback, useEffect} from 'react';
import {useQuery} from "react-query";

import {counterAtom} from "./state/counter";

import './App.css';

type CounterResponse = {
    environment: string;
    value: number;
}

const fetchCounter = async (): Promise<CounterResponse> => {
    const res = await fetch('https://service.fs.examples.oleksiipopov.com/by-key?environment=counter');
    return res.json();
}

function App() {
    const [counter, setCounter] = useAtom(counterAtom);
    const {data} = useQuery<CounterResponse>('counter', fetchCounter);

    useEffect(() => {
        setCounter(data?.value ?? 0);
    }, [data?.value]);

    const handleClick = useCallback(() => {
        setCounter((c) => typeof c === 'number' ? c + 1 : 0);
    }, [counter]);

    return (
        <div className="App">
            <header className="App-header">
                <div>{counter}</div>
                <button onClick={handleClick}>Add</button>
            </header>
        </div>
    );
}

export default App;
