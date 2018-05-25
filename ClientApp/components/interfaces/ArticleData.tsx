import { Resource } from './Resource';

//data type for every article
export interface ArticleData {
    name: string;
    link: string;
    desc: string;
    date: string;
    image: string;
    author: string;
    resource: Resource;
}