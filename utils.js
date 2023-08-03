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
    if (cv?.length < 4) {
      return acc;
    }
    const id = cv?.[1]?.replace(
      'https://seguritechdeva.atlassian.net/browse/',
      ''
    );
    let timeSpent = (cv?.[0] || '0')?.replace(',', '.')?.trim();
    if (!id || timeSpent === '0') {
      return acc;
    }
    let originalEstimate = timeSpent;
    // El agregado de 0.75 a la estimación original es random con 60% de posibilidad
    if (Math.random() < 0.6) {
      try {
        originalEstimate = (Number(originalEstimate) + 0.75)?.toString();
      } catch (error) {
        originalEstimate = timeSpent;
      }
    }
    const comment = (cv?.[2] || '.')?.trim();
    const assignToMe = cv?.[3]?.trim()?.toLowerCase() === 'si';

    return [
      ...acc,
      {
        id,
        dateString: day,
        timeSpent,
        originalEstimate,
        comment,
        assignToMe,
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
