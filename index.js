import { getJsonArrayFronSheet } from './utils.js';
import {
  addTimeToIssue,
  assignTicketToMe,
  updateBasicFields,
} from './requests.js';

const json = getJsonArrayFronSheet('2023/08/03', ``);
console.log('\n🚀 DATA');
console.table(json);
console.log('\n🚀 =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=');

const addTimeSuccessIds = [];
const addTimeErrorIds = [];
const updateFieldsSuccessIds = [];
const updateFieldsErrorIds = [];
const assignToMeSuccessIds = [];
const assignToMeErrorIds = [];

for (let index = 0; index < json.length; index++) {
  try {
    console.log('🕒');
    console.table([json[index]]);
    const { id, dateString, timeSpent, comment, originalEstimate, assignToMe } =
      json[index];
    console.log('🚀', id);
    try {
      await addTimeToIssue(id, dateString, timeSpent, comment);
      addTimeSuccessIds.push(id);
    } catch (error) {
      addTimeErrorIds.push({ id, error });
    }
    try {
      await updateBasicFields(id, originalEstimate);
      updateFieldsSuccessIds.push(id);
    } catch (error) {
      updateFieldsErrorIds.push({ id, error });
    }
    try {
      if (assignToMe) {
        await assignTicketToMe(id);
      }
      assignToMeSuccessIds.push(id);
    } catch (error) {
      assignToMeErrorIds.push({ id, error });
    }
  } catch (error) {
    console.error('🚀', 'Id was not found');
    continue;
  }
}

function printErrorArray(array = []) {
  array?.forEach((element) => {
    console.log(`${element.id} - ${element.error || ''}`);
  });
}

console.log('\n🚀 ADD TIME');
console.log('\n SUCCESS IDs');
console.log(addTimeSuccessIds);
console.log('\n ERROR IDs');
printErrorArray(addTimeErrorIds);

console.log('\n🚀 UPDATE');
console.log('\n  SUCCESSS IDs');
console.log(updateFieldsSuccessIds);
console.log('\n ERROR IDs');
printErrorArray(updateFieldsErrorIds);

console.log('\n🚀 ASSIGNED TO ME IDs');
console.log('\n  SUCCESSS IDs');
console.log(assignToMeSuccessIds);
console.log('\n ERROR IDs');
printErrorArray(assignToMeErrorIds);
