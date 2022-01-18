// const fs = require('fs');
// const path = require('path');
const Service = require('egg').Service;
// const async = require('async');
// const { getDate, dataToLine, sendDateTime } = require('../utils/common')

class FileService extends Service {
  async slice() {
    const { app } = this
    const result = { file: 'test1' }
    return result
  }
}

module.exports = FileService