import { useState } from 'react';

export const DarkTheme = () =>
{
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const onClick = () => 
    {
        const html = document.querySelector('html');
        if(html)
        {
            if (isDarkMode)
            {
                console.log("enabling light");
                html.classList.remove('dark');
                html.classList.add('light');
                setIsDarkMode(false);
            }
            else
            {
                console.log("enabling dark");
                html.classList.remove('light');
                html.classList.add('dark');
                setIsDarkMode(true);
            }
        }
    }

    return (
        <input onChange={onClick} type="checkbox" id="hs-basic-with-description-checked" className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200" checked={isDarkMode} />


    );
}
