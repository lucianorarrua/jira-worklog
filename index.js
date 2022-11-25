import axios from 'axios';
import { readFile } from 'fs/promises';

// Info de como obtener un token para utilizar https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/ 

/**
 * 
 * @param {string} idTicket - Tienen la forma INNOVA-XXXXX
 * @param {*} timeSpent - Tienen la forma "50m", "1h"15m, etc
 * @param {*} comment - Comentario opcional en la carga
 * @returns 
 */
const addTimeToIssue = async (idTicket, dateString, timeSpent, comment = '') => {
    const date = new Date(dateString);
    if (!idTicket || !timeSpent || isNaN(date)) {
        return reject();
    }
    const started = new Date(date).toISOString().split('T')[0] + 'T12:00:00.755-0500';
    console.log("🚀", idTicket, started, timeSpent, comment)
    return axios
        .post(
            `https://seguritechdeva.atlassian.net/rest/internal/3/issue/${idTicket}/worklog?adjustEstimate=auto`,
            {
                timeSpent,
                comment: {
                    version: 1,
                    type: 'doc',
                    content: [
                        { type: 'paragraph', content: [{ type: 'text', text: comment }] },
                    ],
                },
                started,
            },
            {
                headers: {
                    Authorization:
                        'AGREGAR EL TOKEN DE JIRA ACÁ',
                },
            }
        );
}

const json = JSON.parse(
    await readFile('./logs.json')
);

const successIds = [];
const errorIds = []

for (let index = 0; index < json.length; index++) {
    try {
        const { id, dateString, timeSpent, comment } = json[index];
        console.log("🚀", id)
        try {
            await addTimeToIssue(id, dateString, timeSpent, comment);
            successIds.push(id)
        } catch (error) {
            errorIds.push({ id, error })
        }
    } catch (error) {
        console.error("🚀", "Id was not found")
        continue
    }
}

console.log("\n🚀 SUCCESS IDs");
console.log(successIds);
console.log("\n🚀ERROR IDs");
errorIds.forEach(element => {
    console.log(`${element.id} - ${element.error || ''}`);
});
