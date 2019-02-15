var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
  region: process.env.AWS_SES_SERVICE
});

const SES = new AWS.SES({
  apiVersion: '2010-12-01',
});

/**
 * 
 * @param {*} toMail 
 * @param {*} generatedRandomNumber 
 * @description Send Welcome Email With Passcode
*/
router.get('/:mailTo', async (req, res, next) => {
  let {mailTo} = req.params;
  let {message,subject} = req.query;
  let from = process.env.ACCOUNT_VERIFICATION_EMAIL_FROM;
  let emailParam = {
                  Source: from,
                  Destination: {
                      ToAddresses: [mailTo]
                  },
                  Message: {
                      Body: {
                          Html: {
                              Charset: "UTF-8",
                              Data: message
                          },
                      },
                      Subject: {
                          Charset: "UTF-8",
                          Data: subject
                      }
                  }
  };
  let emailResObject = await SES.sendEmail(emailParam);
  let emailResponse =  await emailResObject.promise();
  res.json({
    success:true,
    message:emailResponse
  });
});

module.exports = router;
