import useSWR from "swr";
import { API_URL } from "@/constants/url";

async function fetcher(key: string) {
    return fetch(key).then((res) => res.json());
}

export const useTodos = () => {
    const { data, isLoading, error, mutate } = useSWR( // SWRでデータを取得。
        `${API_URL}/allTodos`,
        fetcher
      );
    return { 
      todos: data, 
      isLoading, 
      error, 
      mutate 
    };
}
