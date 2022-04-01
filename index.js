const { App } = require("@slack/bolt");
const {google} = require('googleapis')
var _ = require('lodash')
require("dotenv").config();
const express = require('express')
const app2 = express()
app2.use(express.json());
app2.post('/api/v1/backlog-onboard/listen', (req, res) => {
  console.log(req.body)
})
const nodemailer = require('nodemailer')
// read file.json
const fs = require('fs')
let raw = fs.readFileSync('db.json');
let faqs= JSON.parse(raw);
let productlist = fs.readFileSync('productdb.json');
let faqs2= JSON.parse(productlist);

// key of google calendar api
var z =  {"type": "service_account",
"project_id": "calenderapi-341303",
"private_key_id": "d525c7b16556c11262a5236fa2cd29a00e6317ae",
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZB/KBqLzIat0l\nbf2jCcw8FNhWVH0j7TYi3H9tUHC+SprsuHkB7JllodMFOu2565doac0ehzOSqVyE\n05L0We8S+2Pn4xdKs6x60P5SRXD3/dwi9jSlcvfVZzygxCmSKvGw3MQ+0eqRq7yS\neJgH580XfgX4U8PBbT2z9Iw++R2Ox/z9ZuTXUPyGiVyScVGo/TKI6Mca/yhmocpl\nx5jusQhmT6uF67SpYwgV4u/eNXAjQTFVl1BG6NRpGykyhku2OIYvWem2QdnQ21cG\nXtGMvx9v5N0wgHWTpJROGygDS8QDmIT2T1TlcSCOxhjkyldw3GP3HCwZAPi4LE20\ng4G5IWvHAgMBAAECggEAPmrybBZSIgEMgJbTbGuzpRHvh47gmAXKHgAH7aNwyP0P\nIdzAZpuFmeGee7SkgD/qusjkxD3rODfiJ79QYmBIVlq5TjzfJDYS9OlHwnDWeiBO\naOg5Yv54vc9k+EHqntbrS/NQDDt8zLvap3eOszLGAX4Cm143Ky8OitcFWS4s8y5X\nYW76jfU5APBwM/Vr1AvTNU40PKEmZ2N7Tg6NW0BX3tjzJkb4zeeI/xH6OmARP8jR\n7W5ZRkBeQPaxp9CuGc8OXudnqVAAg7fCATNlQecqS6hRQ+iVvZzT2OrM3t/w9irt\ngKkNfVBzmQW9nLIhXJiNko6j6bLi8Wsm2ikvpx2miQKBgQDTNaAMe9knZTIHJMB5\nPvuylw9w/uj4rI0AebSSys/2IaVh8CF6g4DG225KXSJIiwsn0ElnPe7XWW1txRLf\n75qn3OPABOyQAf9raaakdwv+EoVFb+H997XMwYJYg+1lNIBn4SEQZq1s9872GKs3\nqGuEDwPuTimTyw+27FF1oK00IwKBgQC5e93oC3vnMNKgE5rDWZqc3Z5dwPCMhZdh\n2r3S7zMWM9cd7nOhzzqS6djgHIYvtSbcTkhNEc9RkIlJPzXcjHbZt0yB7WcVdqJT\n22pg6/C/BXOeanAeT+9DdSCYAxnDVir0WyxGLVyFWREQZ9DNwm1s4xV9AZW4JYJU\n0qwY1HSCDQKBgD1TY75cM4hJzMXgOPa7f++yBuzDRzf1Ohe6PuEkfE+2I0QVqlLd\nXgXfbt2uvyabIMkVpEqS5AepUqm9wCY/dwNoksSNaXbC7bvteFJmspe6HvIzc0X/\np8zlHwi+fa6WGPaQmr4dYhuytGgmb4iAoX89sOF/1niwTEbLxTdHSSNLAoGAPtP1\nQ594NcR04+IgHyGf3Ji5BvrOwFqT/4JvoB6ECHZA3JOjuWCPb6okWy1uSoSrCB7A\nINLyjadOyW/O18kAjRiooq3+p+eKbqs46mGhJ6M6GaPmHG5pFkl7Y+JQ/LiYTjL/\n2TmOSGD2Bb+Um83K8QIuiixaQYj7D65YuwRj/pUCgYBd2gff6wOFUNcLx3f6HxNJ\nqSy2hv6VMLrnp+oIWr1ZJ4E+Bt2ET2kb1NMs9yn6Gvc9Ll4nDAM0SAa4jO+JH8Wo\nbCoUYEt6Fa7ASETMawi2o83QBXhLhTGu5MSB6i3pLrPtGShPXET554lbUjDOQU05\nzUE5TbGmWKt4155wAjjNjg==\n-----END PRIVATE KEY-----\n",
"client_email": "testing-google-calender-api@calenderapi-341303.iam.gserviceaccount.com",
"client_id": "101834834985746862809",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/testing-google-calender-api%40calenderapi-341303.iam.gserviceaccount.com"
}

const CREDENTIALS = z
const calendarId = process.env.CALENDAR_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

// Get googleAuth
const auth2 = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = _.constant('+07:00')()
// Initializes your app with your slackbot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken:process.env.APP_TOKEN
});

app.message("hey", async ({say})=>{
  say("hello")
})

// show list message
app.command("/knowledge", async ({ command, ack, say }) => {
  try {
    await ack();
    let message = { blocks: [] };
    // faqs.data.map
    _.map(faqs.data,(faq) => {
      message.blocks.push(
           {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Question* ❓",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: faq.question,
              },
            },
            {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Answer* ✔️",
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: faq.answer,
                },
              }
          );
        });
        say(message);
      } catch (error) {
        console.log("err");
        console.error(error);
      }
});

//show list message(image) 
app.command("/productlist", async ({ command, ack, body,say }) => {
  try {
      await ack();
      let message = { blocks: [] };
      let message3 = { 
        elements:[
        ] 
      }
      _.setWith(message.blocks,'type','actions',Object)
      _.setWith(message.blocks,'block_id','actions1',Object)
      _.setWith(message.blocks,'elements',[],Object)
      _.map(faqs2.blocks,(faq,index) => {
        if(_.isNil(faq.accessory) && !_.isNil(faq.text )) {
          message.blocks.push(
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: faq.text.text,
              },
            }
          );
        }
          if(!_.isNil(faq.accessory)) {
            message.blocks.push(
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: faq.text.text,
                },
                accessory: {
                  type: "image",
                  image_url: faq.accessory.image_url,
                  alt_text: faq.accessory.alt_text
                }
              }
            );
          }
          if(!_.isNil(faq.elements)) {
            _.map(faq.elements,(faq2,index2)=>{
              message3.elements.push({
                type:"button",
                text:{
                  type:"plain_text",
                  text:faq2.text.text,
                  emoji:true
                },
                value:faq2.value,
                action_id:faq2.action_id
              })
            })
          }
      });
      say(message);
      // say(message2);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
});

var x= _.stubString()
var y= _.stubString()

// show modal by command
app.command("/ticket", async ({ ack, body, client, logger }) => {
  await ack();
  try {
    // client.views.open
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'view_12',
        title: {
          type: 'plain_text',
          text: 'Modal information'
        },
        blocks: [
          {
            type: "input",
            block_id: "my_block",
            element: {
              type: "plain_text_input",
              action_id: "Fullname",
              placeholder: {
                type: "plain_text",
                text: "Nhập tên "
              }
            },
            label: {
              type: "plain_text",
              text: "Full Name"
            }
          },
          {
            type: "section",
            block_id: "my_block2",
            text: {
              type: "mrkdwn",
              text: "Ngày sinh"
            },
            accessory: {
              type: "datepicker",
              initial_date: "1990-04-28",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true
              },
              action_id: "datepicker_action"
            }
          },
          {
            type: "section",
            block_id: "my_block3",
            text:{
              type: "mrkdwn",
              text:"Giới tính"
            },
            accessory:{
              type:"radio_buttons",
              action_id: "this_is_an_action_id",
              options:[
                {
                  text:{
                    type:"plain_text",
                    text:"nam"
                  },
                  value:"value-0"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"nữ"
                  },
                  value:"value-1"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"khác"
                  },
                  value:"value-2"
                }
              ]
            }
          },
          {
            type: "section",
            block_id: "my_block4",
            text:{
              type: "mrkdwn",
              text:"Chức vụ"
            },
            accessory:{
              type:"static_select",
              action_id: "this_is_an_action_id2",
              placeholder:{
                type:"plain_text",
                text:"Chọn chức vụ",
                emoji: true
              },
              options:[
                {
                  text:{
                    type:"plain_text",
                    text:"Back-end",
                    emoji: true,
                  },
                  value:"value-0"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Front-end",
                    emoji: true,
                  },
                  value:"value-1"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Fullstack",
                    emoji: true,
                  },
                  value:"value-2"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Tester",
                    emoji: true,
                  },
                  value:"value-3"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Data-engin",
                    emoji: true,
                  },
                  value:"value-3"
                },
              ]
            }
          },

        ],
        submit: {
          type: 'plain_text',
          text: 'Gửi'
        }
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

// app.view to return infor to message and google api
app.view('view_12', async ({ ack, body,client,logger }) => {
  // google sheet api
  const auth = new google.auth.GoogleAuth({
    keyFile:"credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  })
  const client2 = await auth.getClient()
  const googleSheets = google.sheets({version:"v4",auth: client})
  const spreadsheetId = "1u3ewJzbwFjUV-gzidttKR8PzM5CAn9sqUtZPRWEaF-8"
  // Initialize thread_ts
  var threadTs=_.stubString();
  if(!_.eq(y,"")){
    if(!_.eq(y,"")){
      threadTs = y; }else{threadTs=x;}
  }
  else{y=""}
  if(!_.eq(threadTs,"")){
    await ack();
    // get data from form submit
  const valName = JSON.stringify(body.view.state.values.my_block.Fullname.value);
  const valBirthDay = JSON.stringify(body.view.state.values.my_block2.datepicker_action.selected_date);
  const valGender = JSON.stringify(body.view.state.values.my_block3.this_is_an_action_id.selected_option.text.text);
  const valChucVu = JSON.stringify(body.view.state.values.my_block4.this_is_an_action_id2.selected_option);
  const valDateOrigin = JSON.stringify(body.view.state.values.my_block41.datepicker_action3.selected_date).replace(/["]+/g, '');
  const valHour = JSON.stringify(body.view.state.values.my_block12.gio.value).replace(/["]+/g, '');
  const valMinutes = JSON.stringify(body.view.state.values.my_block13.phut.value).replace(/["]+/g, '');
  const valNameOrigin = JSON.stringify(body.view.state.values.my_block14.TenCuocHop.value).replace(/["]+/g, '');
  const valDescriptionOrigin = JSON.stringify(body.view.state.values.my_block15.MoTaCuocHop.value).replace(/["]+/g, '');
  const dateTimeForCalander = () => {
    let date = new Date();
    let hour = _.constant(valHour)();
    if (_.lt(hour,10)) {
        hour = `0${hour}`;
    }
    let minute = _.constant(valMinute)();
    if (_.lt(minute,10)) {
        minute = `0${minute}`;
    }

    let newDateTime = `${valDateOrigin}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};
// insert calendar function
const insertEvent = async (event) => {
  try {
      let response = await calendar.events.insert({
          auth: auth2,
          calendarId: calendarId,
          resource: event
      });
  
      if (_.isEqual(response['status'],200) && _.isEqual(response['statusText'],'OK')) {
          return 1;
      } else {
          return 0;
      }
  } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0;
  }
};
let dateTime = dateTimeForCalander();
let event = {
  'summary':valNameOrigin,
  'description': valDescriptionOrigin,
  'start': {
      'dateTime': dateTime['start'],
      'timeZone': 'Asia/Kolkata'
  },
  'end': {
      'dateTime': dateTime['end'],
      'timeZone': 'Asia/Kolkata'
  },
  'conferenceData':{
    createRequest:{
      requestId:"aee-veed-ryp",
      conferenceSolutionKey:{type:"hangoutsMeet"}
    }
  },
};
insertEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
// end insert calendar function
// send mail by nodemailer 
var transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'thanh2k1582@gmail.com',
    pass:'thanh15820'
  }
})
var mailOptions = {
  from:'thanh2k1582@gmail.com',
  to:valName,
  subject:valNameOrigin,
  text:valDescriptionOrigin
}
transporter.sendMail(mailOptions,(err,info)=>{
  if(err){
    console.log("Lỗi ở vị trị "+ err)
  }
  else{
    console.log("Email sent: "+info.response)
  }
})

//
  try {
    x=_.stubString()
    y=_.stubString()
    const result = await client.chat.postMessage(
      {
        // give thread_ts
        // send to message
        channel:"ask-ztc-bot",
        thread_ts:_.constant(threadTs)(),
        type: "section",
        text: `--- Thong tin cua ban ---\nTen: ${valName} \n Ngay sinh: ${valBirthDay} \n Gioi tinh: ${valGender} \n Chuc vu: ${valChucVu} \n`
      },
    );
    // Read and Write File
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption:"USER_ENTERED",
      resource: {
          values:[
              [valName,valBirthDay,valGender,valChucVu,valDateOrigin,valHour,valMinutes,valNameOrigin,valDescriptionOrigin]
          ]
      }
  })
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
  }
  else{
    await ack();
  const valName = JSON.stringify(body.view.state.values.my_block.Fullname.value);
  const valBirthDay = JSON.stringify(body.view.state.values.my_block2.datepicker_action.selected_date);
  const valGender = JSON.stringify(body.view.state.values.my_block3.this_is_an_action_id.selected_option.text.text);
  const valChucVu = JSON.stringify(body.view.state.values.my_block4.this_is_an_action_id2.selected_option);
  const valDateOrigin = JSON.stringify(body.view.state.values.my_block41.datepicker_action3.selected_date);
  const valHour = JSON.stringify(body.view.state.values.my_block12.gio.value);
  const valMinutes = JSON.stringify(body.view.state.values.my_block13.phut.value);
  const valNameOrigin = JSON.stringify(body.view.state.values.my_block14.TenCuocHop.value);
  const valDescriptionOrigin = JSON.stringify(body.view.state.values.my_block15.MoTaCuocHop.value);
  const dateTimeForCalander = () => {

    let date = new Date();
    let hour = _.constant(valHour)();
    if (_.lt(hour,10)) {
        hour = `0${hour}`;
    }
    let minute = _.constant(valMinutes)();
    if (_.lt(minute,10)) {
        minute = `0${minute}`;
    }

    let newDateTime = `${valDateOrigin}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));
    return {
        'start': startDate,
        'end': endDate
    }
};
  try {
    const result = await client.chat.postMessage(
      {
        channel:"ask-ztc-bot",
        type: "section",
        text: `--- Thong tin cua ban ---\nTen: ${valName} \n Ngay sinh: ${valBirthDay} \n Gioi tinh: ${valGender} \n Chuc vu: ${valChucVu} \n`
      },
    );
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption:"USER_ENTERED",
      resource: {
          values:[
              [valName,valBirthDay,valGender,valChucVu,valDateOrigin,valHour,valMinutes,valNameOrigin,valDescriptionOrigin]
          ]
      }
  })
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
  }
});
app.action({action_id:"actionId2",block_id:"actions1"}, async ({ ack, say }) => {
  await ack();
  await say("chao bạn nha");
});
// show modal by click button
app.action({action_id:"button-action2",block_id:"actions2"}, async ({ ack, say,body,client,logger }) => {
  x=_.constant(body.message.ts)()
  y=_.constant(body.message.thread_ts)()
  await ack();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'view_12',
        title: {
          type: 'plain_text',
          text: 'Modal information'
        },
        blocks: [
          {
            type: "input",
            block_id: "my_block",
            element: {
              type: "plain_text_input",
              action_id: "Fullname",
              placeholder: {
                type: "plain_text",
                text: "Nhập Gmail "
              }
            },
            label: {
              type: "plain_text",
              text: "Gmail"
            }
          },
          {
            type: "section",
            block_id: "my_block2",
            text: {
              type: "mrkdwn",
              text: "Ngày sinh"
            },
            accessory: {
              type: "datepicker",
              initial_date: "2000-08-15",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true
              },
              action_id: "datepicker_action"
            }
          },
          {
            type: "section",
            block_id: "my_block3",
            text:{
              type: "mrkdwn",
              text:"Giới tính"
            },
            accessory:{
              type:"radio_buttons",
              action_id: "this_is_an_action_id",
              options:[
                {
                  text:{
                    type:"plain_text",
                    text:"nam"
                  },
                  value:"value-0"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"nữ"
                  },
                  value:"value-1"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"khác"
                  },
                  value:"value-2"
                }
              ]
            }
          },
          {
            type: "section",
            block_id: "my_block4",
            text:{
              type: "mrkdwn",
              text:"Chức vụ"
            },
            accessory:{
              type:"static_select",
              action_id: "this_is_an_action_id2",
              placeholder:{
                type:"plain_text",
                text:"Chọn chức vụ",
                emoji: true
              },
              options:[
                {
                  text:{
                    type:"plain_text",
                    text:"Back-end",
                    emoji: true,
                  },
                  value:"value-0"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Front-end",
                    emoji: true,
                  },
                  value:"value-1"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Fullstack",
                    emoji: true,
                  },
                  value:"value-2"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Tester",
                    emoji: true,
                  },
                  value:"value-3"
                },
                {
                  text:{
                    type:"plain_text",
                    text:"Data-engin",
                    emoji: true,
                  },
                  value:"value-3"
                },
              ]
            }
          },
          {
            type: "section",
            block_id: "my_block41",
            text: {
              type: "mrkdwn",
              text: "Chọn ngày cuộc họp"
            },
            accessory: {
              type: "datepicker",
              initial_date: "2022-02-02",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true
              },
              action_id: "datepicker_action3"
            }
          },
          {
            type: "input",
            block_id: "my_block12",
            element: {
              type: "plain_text_input",
              action_id: "gio",
              placeholder: {
                type: "plain_text",
                text: "Nhập giờ cuộc họp(0-23,vd:22)"
              }
            },
            label: {
              type: "plain_text",
              text: "Giờ cuộc họp"
            }
          },
          {
            type: "input",
            block_id: "my_block13",
            element: {
              type: "plain_text_input",
              action_id: "phut",
              placeholder: {
                type: "plain_text",
                text: "Nhập phút cuộc họp(0-59,vd:58)"
              }
            },
            label: {
              type: "plain_text",
              text: "Phút cuộc họp"
            }
          },
          {
            type: "input",
            block_id: "my_block14",
            element: {
              type: "plain_text_input",
              action_id: "TenCuocHop",
              placeholder: {
                type: "plain_text",
                text: "Nhập tên cuộc họp"
              }
            },
            label: {
              type: "plain_text",
              text: "Tên cuộc họp"
            }
          },
          {
            type: "input",
            block_id: "my_block15",
            element: {
              type: "plain_text_input",
              action_id: "MoTaCuocHop",
              placeholder: {
                type: "plain_text",
                text: "Nhập mô tả cuộc họp"
              }
            },
            label: {
              type: "plain_text",
              text: "Mô tả cuộc họp"
            }
          },

        ],
        submit: {
          type: 'plain_text',
          text: 'Gửi'
        }
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});
// show message by mention event
app.event('app_mention', async ({ event, say}) => {
  var threadTs;
  if(event.thread_ts){threadTs = event.thread_ts; }else{threadTs=event.ts;}
  if(/invite-member/g.test(event.text) == true) {
      say(
        {
          thread_ts:threadTs,
          "blocks": [
            {
              "type": "divider"
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              block_id: "actions2",
              "text": {
                "type": "mrkdwn",
                "text": "tin nhan de hien thi bang thong tin"
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Hiển thị modal",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "button-action2"
              }
            }
          ]
        }
      )
  }
  else(
    await say("don't has message"))
});
(async () => {
  const port = _.constant(3000)()
  // Start your app
  await app2.listen(_.defaultTo(process.env.PORT,port));
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();