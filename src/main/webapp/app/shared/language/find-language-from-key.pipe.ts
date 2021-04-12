import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {

    private readonly languages: any = {
        en: {name: 'English'},
        'pt-br': {name: 'Português (Brasil)'},
        'es': {name: 'Espanhol'}
    };

    transform(lang: string): string {
        return this.languages[lang].name;
    }

}
