'use strict';




function giveMeAStory(recordSummaries){
  console.log('in the story');
  let sendThisBack = [];
  recordSummaries.forEach( record => {
    let text;
    if(record.currentStatus.charAt(0) === '1'){
      text = `${record.borrower} wants to borrow ${record.item} from ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '2'){
      text = `${record.borrower} is going to pickup ${record.item} from ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '3'){
      text = `${record.borrower} is returning ${record.item} to ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '4'){
      text = `${record.borrower} no longer responsible for ${record.item} of ${record.owner}`;
    }
    else{
      text = `Issue with record ${record._id}`;
    }
    record.text = text;
    record.rental_id = record._id;
    record.status = record.currentStatus;
    sendThisBack.push(record);
  });
  console.log(sendThisBack);
  return sendThisBack;
}

module.exports = giveMeAStory;

