import { baseApiUrl } from '../constants/data';

export const resolveQueryUrl = ({
    state,
    topic,
    keywords,
    sortKeywords,
    page = 1,
    pageSize = 10,
}: {
    state: string;
    topic: string;
    keywords: string[];
    sortKeywords: string[];
    page?: number;
    pageSize?: number;
}) => {
    let url = `${baseApiUrl}/news?page=${page}&pageSize=${pageSize}`;
    if (state) {
        url += `&state=${state}`;
    }
    if (topic) {
        url += `&category=${topic}`;
    }
    if (keywords.length > 0) {
        const searchQuery = keywords.join(',');
        url += `&search=${searchQuery}`;
    }
    if (sortKeywords.length > 0) {
        const sortQuery = sortKeywords.join(',');
        url += `&sort=${sortQuery}`;
    }
    return url;
};
