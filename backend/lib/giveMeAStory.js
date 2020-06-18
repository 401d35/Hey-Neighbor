'use strict';




function giveMeAStory(recordSummaries){

  let sendThisBack = [];
  recordSummaries.forEach( record => {
    let text;
    if(record.currentStatus.charAt(0) === '1'){
      text = `${record.borrower} wants to borrow ${record.item} from ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '2'){
      text = `${record.borrower} has checked out ${record.item} from ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '3'){
      text = `${record.borrower} has returned ${record.item} to ${record.owner}`;
    }
    else if(record.currentStatus.charAt(0) === '4'){
      text = `${record.borrower} no longer responsible for ${record.item} of ${record.owner}`;
    }
    else{
      text = `Issue with record ${record._id}`;
    }
    let obj = {'text':text, 'rental_id':record._id, 'status':record.currentStatus}
    sendThisBack.push(obj);
  });
  return sendThisBack;
}

module.exports = giveMeAStory;

