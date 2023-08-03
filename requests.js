import axios from 'axios';

/**
 *
 * @param {string} idTicket - Tienen la forma INNOVA-XXXXX
 * @param {string} timeSpent - Tienen la forma "50m", "1h"15m, 1.5, etc
 * @param {*} comment - Comentario opcional en la carga
 * @returns
 */
export const addTimeToIssue = async (
  idTicket,
  dateString,
  timeSpent,
  comment = ''
) => {
  const date = new Date(dateString);
  if (!idTicket || !timeSpent || isNaN(date)) {
    return reject();
  }
  const started =
    new Date(date).toISOString().split('T')[0] + 'T12:00:00.755-0500';
  return axios.post(
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
          'Basic bHVjaWFuby5hcnJ1YUBpbm92dGVjaC5jb20ubXg6c3RMQXBOblh5Tnc3bUZzaG45V0lGQUM2',
      },
    }
  );
};

/**
 *
 * @param {string} idTicket - Tienen la forma INNOVA-XXXXX
 * @param {string} originalEstimate - Tienen la forma "50m", "1h"15m, 1.5, etc
 * @returns
 */
export const updateBasicFields = async (idTicket, originalEstimate) => {
  return axios.put(
    `https://seguritechdeva.atlassian.net/rest/api/3/issue/${idTicket}`,
    {
      fields: {
        customfield_10416: 100,
        customfield_10429: { id: '10780', value: 'Media' },
        customfield_10427: { id: '10750', value: 'Desarrollo-Front End' },
        timetracking: {
          originalEstimate,
        },
      },
    },
    {
      headers: {
        Authorization:
          'Basic bHVjaWFuby5hcnJ1YUBpbm92dGVjaC5jb20ubXg6c3RMQXBOblh5Tnc3bUZzaG45V0lGQUM2',
      },
    }
  );
};

/**
 * Me asigna el ticket a mi accountId=618c659a51e87500720dac58 es "Luciano Arrúa"
 * @param {string} idTicket - Tienen la forma INNOVA-XXXXX
 * @returns
 */
export const assignTicketToMe = async (idTicket) => {
  return axios.put(
    `https://seguritechdeva.atlassian.net/rest/api/3/issue/${idTicket}/assignee`,
    { accountId: '618c659a51e87500720dac58' },
    {
      headers: {
        Authorization:
          'Basic bHVjaWFuby5hcnJ1YUBpbm92dGVjaC5jb20ubXg6c3RMQXBOblh5Tnc3bUZzaG45V0lGQUM2',
      },
    }
  );
};
