import useSWR from "swr";
import { BASE_DATA_URL } from "./config";
import { parse } from 'csv-parse/browser/esm/sync';

const EDITIONS_URL = BASE_DATA_URL + 'editions.csv';

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

const fetcher = (url: string) => 
    fetch(url)
    .then(res => res.text())
    .then(text => parse(text, {columns: true}).map(parseEditionData));

function parseEditionData({name, url, is_active}: EditionData): Edition {
    return {
        name,
        url: new URL(url, EDITIONS_URL),
        active: is_active === 'active',
    };
}
