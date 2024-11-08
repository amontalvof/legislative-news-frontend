import { INews } from '../types/news';

export const sortNewsByCategories = (
    newsArray: INews[],
    categories: string[]
): INews[] => {
    const clonedNewsArray: INews[] = JSON.parse(JSON.stringify(newsArray));
    const categoriesArray = categories ?? [];
    return clonedNewsArray.sort((a, b) => {
        const aInCategories = categoriesArray.includes(a.category);
        const bInCategories = categoriesArray.includes(b.category);

        if (aInCategories && !bInCategories) {
            return -1;
        } else if (!aInCategories && bInCategories) {
            return 1;
        } else {
            return 0;
        }
    });
};
