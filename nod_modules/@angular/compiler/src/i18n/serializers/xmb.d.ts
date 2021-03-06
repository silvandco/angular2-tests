import * as i18n from '../i18n_ast';
import { Serializer } from './serializer';
export declare class Xmb implements Serializer {
    write(messages: i18n.Message[]): string;
    load(content: string, url: string): {
        [msgId: string]: i18n.Node[];
    };
    digest(message: i18n.Message): string;
}
export declare function digest(message: i18n.Message): string;
