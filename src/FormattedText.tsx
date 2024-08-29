
import { useEffect } from 'react';
import { Marked, type Tokens } from "marked";
import DOMPurify from "dompurify";
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
type FormattedTextProps = 
{
    text: string
}

export const FormattedText = ({ text }: FormattedTextProps) =>
{
    const marked = new Marked();
    const renderer = 
    {
        code({ text, lang, escaped }: Tokens.Code): string  
        {
            let language;
            if(lang)
                language = hljs.getLanguage(lang) ? lang : 'autodetect';
            let highlighted = String();
            if(language)
                highlighted = hljs.highlight(text, {language}).value;
            else
                highlighted = hljs.highlightAuto(text).value;

            return `<br /><pre style="white-space: pre-wrap"><code class="hljs ${language}">${highlighted}</code></pre> <br />`;
        }
    }

    marked.use({
        useNewRenderer: true,
        renderer: renderer,
    });

    const markText = (text: string) => {
        //temp fix
        if(text.length > 5)
        {
            const rawMarkup = marked.parse(text).toString();
            const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
            return { __html: sanitizedMarkup };    
        }
        else
        {
            const sanitizedMarkup = DOMPurify.sanitize(text);
            return { __html: sanitizedMarkup };    
        }
    };

    const handleClick = (event: MouseEvent) => 
    {
        const target = event.target as HTMLElement;
        const parent = target.parentElement;
        if(parent)
        {
            target.innerText = '';
            navigator.clipboard.writeText(parent.innerText);
            target.innerText = 'Copied!';
            setTimeout(function () 
            {
                target.innerText = 'Copy';
            }, 1000)        
        }
    };

    useEffect(() => 
    {
        var snippets = document.getElementsByTagName('pre');
        var numberOfSnippets = snippets.length;
        for (var i = 0; i < numberOfSnippets; i++) 
        {
            var code = snippets[i].getElementsByTagName('code')[0].innerText;

            snippets[i].classList.add('hljs');

            if(!snippets[i].innerHTML.includes('<button class="hljs-copy'))
            {
                snippets[i].innerHTML = '<button class="hljs-copy w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" type="button" >Copy</button>' + snippets[i].innerHTML; // append copy button
                
                const ref = snippets[i].getElementsByClassName('hljs-copy')[0] as HTMLElement;
                ref.addEventListener('click', handleClick);
            }

        }
    }, [])

    return (
        <p className="text-gray-800 dark:text-neutral-200" dangerouslySetInnerHTML={markText(text)}></p>
    );
}
