'use strict';




function giveMeAStory(recordSummaries){

  let sendThisBack = [];
  recordSummaries.forEach( record => {

    if(record.currentStatus.charAt(0) === '1'){
      sendThisBack.push(`${record.borrower} wants to borrow ${record.item} from ${record.owner}`);
    }
    else if(record.currentStatus.charAt(0) === '2'){
      sendThisBack.push(`${record.borrower} has checked out ${record.item} from ${record.owner}`);
    }
    else if(record.currentStatus.charAt(0) === '3'){
      sendThisBack.push(`${record.borrower} has returned ${record.item} to ${record.owner}`);
    }
    else if(record.currentStatus.charAt(0) === '4'){
      sendThisBack.push(`${record.borrower} no longer responsible for ${record.item} of ${record.owner}`);
    }
    else{
      sendThisBack.push(`Issue with record ${record._id}`);
    }
  });
  return sendThisBack;
}

module.exports = giveMeAStory;

