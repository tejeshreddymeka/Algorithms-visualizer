import { Injectable } from '@angular/core';

import * as prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

@Injectable({
    providedIn: 'root',
})
export class HighlightService {
    private languages: any = {
        cpp: prism.languages.cpp,
    };
    highlightCode(code: string, lang: string): string {
        return prism.highlight(code, this.languages[lang]);
    }
}
