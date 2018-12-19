import { documentReady, $, delegate } from 'web-cell';

documentReady.then(() => {
    const file_path = $('git-path')[0];

    document.addEventListener('signin', ({ detail }) => {
        file_path.user = detail.login;
    });
});

document.addEventListener(
    'change',
    delegate('git-path', ({ target: { value } }) => console.info(value))
);
