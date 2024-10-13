import useSWR from "swr";
import { BASE_DATA_URL } from "./config";
import { parse } from 'csv-parse/browser/esm/sync';
import { useRef } from "react";

const EDITIONS_URL = BASE_DATA_URL + 'editions.csv';

const fetcher = (url: string) => 
    fetch(url)
    .then(res => res.text())
    .then(text => parse(text, {columns: true}).map(parseEditionData));

export interface Edition {
    name: string,
    url: URL,
    active: boolean,
}

export function useEditions() {
    const { data, isLoading, error } = useSWR(EDITIONS_URL, fetcher);

    return {
        data: data as Edition[],
        isLoading,
        error,
    };
}

interface EditionData {
    name: string,
    url: string,
    is_active: string,
}

function parseEditionData({name, url, is_active}: EditionData): Edition {
    return {
        name,
        url: new URL(url, EDITIONS_URL),
        active: is_active === 'active',
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
