import useSWR from "swr";
import { BASE_DATA_URL } from "./config";
import { parse } from 'csv-parse/browser/esm/sync';
import { useRef } from "react";

const fetcher = (url: string) => 
    fetch(url)
    .then(res => res.text())
    .then(text => parse(text, {columns: false}).map(parseEditionData));

export interface Edition {
    name: string,
    directory: string,
    active: boolean,
}

export function useEditions() {
    const { data, isLoading, error } = useSWR(BASE_DATA_URL + 'editions.csv', fetcher);

    return {
        data: data as Edition[],
        isLoading,
        error,
    };
}

function parseEditionData([name, directory, active]: string[]): Edition {
    return {
        name,
        directory,
        active: active === 'active',
    };
}

export function EditionChooser({ editions, edition, setEdition }: { editions: Edition[], edition: Edition | null, setEdition: (edition: Edition) => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    if (edition === null) {
        return <span>(wybierz edycję)</span>;
    } else {
        return <>
            <dialog ref={dialogRef}>
                <ul>
                    {editions.map(edition => <li key={edition.name} onClick={() => {setEdition(edition); dialogRef.current?.close(); }}>{edition.name}</li>)}
                </ul>
            </dialog>
            <span onClick={() => {
                dialogRef.current?.showModal();
            }}>{edition.name}</span>
        </>
    }
}
