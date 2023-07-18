import { writeFile } from 'fs/promises';

/**
 *
 * @param {string} day YYYY/MM/DD
 * @param {*} str
 * @param {*} exportFile
 * @returns
 */
export function getJsonArrayFronSheet(day, str, exportFile = false) {
  const registers = str?.split('\n');
  const arrayRegisters = registers?.map((register) => register.split('\t'));
  const jsonArray = arrayRegisters?.reduce((acc, cv) => {
    if (cv?.length < 3) {
      return acc;
    }
    const id = cv[1]?.replace(
      'https://seguritechdeva.atlassian.net/browse/',
      ''
    );
    const timeSpent = (cv[0] || '0')?.replace(',', '.')?.trim();
    if (!id || timeSpent === '0') {
      return acc;
    }
    const comment = (cv[2] || '.')?.trim();
    return [
      ...acc,
      {
        id,
        dateString: day,
        timeSpent,
        comment,
      },
    ];
  }, []);
  if (exportFile) {
    writeFile('./logs.json', JSON.stringify(jsonArray));
  }
  return jsonArray;
}

/* getJsonArrayFronSheet(
  '2023/07/03',
  `0,5	https://seguritechdeva.atlassian.net/browse/SDCW-15693	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15695	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15696	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15550	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15549	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15694	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15547	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15697	.
  https://seguritechdeva.atlassian.net/browse/SDCW-15548	.
2	https://seguritechdeva.atlassian.net/browse/SDCW-16841	Levantar proyecto https://github.com/kaaproject/kaa-widget-webpack
4	https://seguritechdeva.atlassian.net/browse/SDCW-16842	PR Review (3864 3851 3872)
0,5	https://seguritechdeva.atlassian.net/browse/SDCW-16074	Fix PR 3851
0,5	https://seguritechdeva.atlassian.net/browse/SDCW-16843	Meet Brasil
1	https://seguritechdeva.atlassian.net/browse/SDCW-16844	Meet Silvana gestion de tareas de repo`,
  true
); */
