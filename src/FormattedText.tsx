
import { useEffect } from 'react';
import { Marked, type Tokens } from "marked";
import DOMPurify from "dompurify";
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
type FormattedTextProps = {
    text: string
  }

export const FormattedText = ({ text }: FormattedTextProps) =>
{
    const marked = new Marked();
    const renderer = {
        code({ text, lang, escaped }: Tokens.Code): string  {
            let language;
            if(lang)
                language = hljs.getLanguage(lang) ? lang : 'autodetect';
            let highlighted = String();
            if(language)
              highlighted = hljs.highlight(text, {language}).value;
            else
              highlighted = hljs.highlightAuto(text).value;
            const encodedCode = btoa(text);
            // const button = `<button type="button" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-clipboard-text="${encodedCode}">📋Copy</button>`;
            //${button}
            return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
        }
    }
    marked.use({
        useNewRenderer: true,
        renderer: renderer,
    });

    const markText = (text: string) => {
        const rawMarkup = marked.parse(text).toString();
        const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
        return { __html: sanitizedMarkup };
    };

    return (
    <p className="text-gray-800 dark:text-neutral-200" dangerouslySetInnerHTML={markText(text)}></p>
    );
}
