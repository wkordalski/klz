import useSWR from "swr";
import { BASE_DATA_URL } from "./config";
import { parse } from 'csv-parse/browser/esm/sync';

const fetcher = (url: string) => 
    fetch(url)
    .then(res => res.text())
    .then(text => parse(text, {columns: true}).map(parseTaskData));

export interface Task {
    name: string,
    file: string,
    start: string,
    end: string,
    points: {[key: string]: number},
}

export function useTasks(editionDirectory: string) {
    const { data, isLoading, error } = useSWR(BASE_DATA_URL + editionDirectory + '/data.csv', fetcher);

    return {
        data: data as Task[],
        isLoading,
        error,
    };
}

function parseTaskData(object: any): Task {
    return {
        name: object['Name'],
        file: object['File'],
        start: object['Start'],
        end: object['End'],
        points: {},
    };
}
