'use strict';

module.exports = (content, reason) => {
  return [{
    content,
    type: reason || 'success'
  }];
}
