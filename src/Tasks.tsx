import useSWR from "swr";
import { parse } from 'csv-parse/browser/esm/sync';

const fetcher = (url: URL) => 
    fetch(url)
    .then(res => res.text())
    .then(text => parse(text, {columns: true}).map((o: any) => parseTaskData(o, url)));

export interface Task {
    id: number,
    name: string,
    file: URL,
    start: Date,
    end: Date,
    points: {[key: string]: number},
}

export function useTasks(edition_url?: URL) {
    const { data, isLoading, error } = useSWR(edition_url ?? null, fetcher);

    return {
        data: data as Task[],
        isLoading,
        error,
    };
}

function parseTaskData(object: any, edition_url: URL): Task {
    return {
        id: object['id'],
        name: object['name'],
        file: new URL(object['url'], edition_url),
        start: new Date(object['start']),
        end: new Date(object['end']),
        points: {},
    };
}
