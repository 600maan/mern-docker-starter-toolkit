const getTemplate = require('./partialTemplate');

module.exports = {
  activeStatusOff: {
    subject: () => 'RSVPHK Community || Your Question on RSVPHK disapproved',
    html: (questionedUsername, question) => getTemplate(`
<tr>
<td
class="one-column"
style="
padding-top: 0;
padding-bottom: 0;
padding-right: 0;
padding-left: 0;
background-color: #ffffff;
"
>
<!--[if gte mso 9]>
<center>
<table width="80%" cellpadding="20" cellspacing="30">
<tr>
<td valign="top">
<![endif]-->
<table style="border-spacing: 0" width="100%">
<tbody>
<tr>
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin-top: 20;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>Hi ${questionedUsername}, You question on RSVPHK has been disapproved.</span
>
</p>
</tr>
<tr>
<td
class="inner contents center"
style="
padding-top: 15px;
padding-bottom: 15px;
padding-right: 30px;
padding-left: 30px;
text-align: left;
"
>
<center>
<p
class="h1 center"
style="
margin: 0;
text-align: center;
font-family: 'flama-condensed', 'Arial Narrow',
Arial;
font-weight: 100;
font-size: 30px;
margin-bottom: 26px;
"
>
Thread disapproved
</p>
<!--[if (gte mso 9)|(IE)]> <![endif]-->
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin: 0;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>
${question}</span
>
</p>
</center>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`),
    text: (question) => `You question on RSVPHK has been disapproved. <h4>${question}</h4>`,
  },
  activeStatusOn: {
    subject: () => 'RSVPHK Community || Your Question on RSVPHK re-approved',
    html: (questionedUsername, question, questionId) => getTemplate(`
<tr>
<td
class="one-column"
style="
padding-top: 0;
padding-bottom: 0;
padding-right: 0;
padding-left: 0;
background-color: #ffffff;
"
>
<!--[if gte mso 9]>
<center>
<table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
<![endif]-->
<table style="border-spacing: 0" width="100%">
<tbody>
<tr>
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin-top: 20;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>Hi ${questionedUsername}, Your thread on RSVPHK has been re-approved.</span
>
</p>
</tr>

<tr>
<td
class="inner contents center"
style="
padding-top: 15px;
padding-bottom: 15px;
padding-right: 30px;
padding-left: 30px;
text-align: left;
"
>
<center>
<p
class="h1 center"
style="
margin: 0;
text-align: center;
font-family: 'flama-condensed', 'Arial Narrow',
Arial;
font-weight: 100;
font-size: 30px;
margin-bottom: 26px;
"
>
Thread re-approved
</p>
<!--[if (gte mso 9)|(IE)]> <![endif]-->
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin: 0;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>
${question}</span
>
</p>
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin: 0;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>
To view the entire thread, CLick the link below</span
>
</p>

<div style="
background-color: rgb(8, 73, 101);
color: rgb(255, 255, 255);
text-decoration: none;
padding-left: 22px;
padding-right: 22px;
font-weight: 600;
min-height: 37px;
border: none;
border-radius:3px;
padding-top: 8
">
<a href='${process.env.APP_HOST}/community/${questionId}'>See Full Thread</a>
</div>

</center>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`),
    text: (question) => `You question on RSVPHK has been re-approved. \n\n ${question}`,
  },
  replyAdded: {
    subject: (name) => `RSVPHK Community || ${name} just added a reply to your thread.`,
    html: (repliedUserName, questionedUsername, questionId) => getTemplate(`
<tr>
<td
class="one-column"
style="
padding-top: 0;
padding-bottom: 0;
padding-right: 0;
padding-left: 0;
background-color: #ffffff;
"
>
<!--[if gte mso 9]>
<center>
<table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
<![endif]-->
<table style="border-spacing: 0" width="100%">
<tbody>
<tr>
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin-top: 20;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>Hi ${questionedUsername}, ${repliedUserName} just added a reply to your thread.</span
>
</p>
</tr>

<tr>
<td
class="inner contents center"
style="
padding-top: 15px;
padding-bottom: 15px;
padding-right: 30px;
padding-left: 30px;
text-align: left;
"
>
<center>
<p
class="h1 center"
style="
margin: 0;
text-align: center;
font-family: 'flama-condensed', 'Arial Narrow',
Arial;
font-weight: 100;
font-size: 30px;
margin-bottom: 26px;
"
>
Community Forums
</p>
<!--[if (gte mso 9)|(IE)]> <![endif]-->

<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin: 0;
text-align: center;
max-width: 320px;
color: #a1a8ad;
line-height: 24px;
font-size: 15px;
margin-bottom: 10px;
margin-left: auto;
margin-right: auto;
"
>
<span
style="
color: rgb(161, 168, 173);
font-family: Muli, 'Arial Narrow', Arial;
font-size: 15px;
text-align: center;
background-color: rgb(255, 255, 255);
"
>
To view the entire thread, CLick the link below</span
>
</p>

<div style="
background-color: rgb(8, 73, 101);
color: rgb(255, 255, 255);
padding-left: 22px;
padding-right: 22px;
font-weight: 600;
min-height: 37px;
border: none;
border-radius:3px;
">
<a href='${process.env.APP_HOST}/community/${questionId}'>See Full Thread</a>
</div>

</center>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`),
    text: (repliedUserName, questionedUsername, questionId) => `Hi ${questionedUsername},\n\n ${repliedUserName} just added a reply to your thread. Open this link to your browser to see full thread: ${process.env.APP_HOST}/community/${questionId}`,
  },
};
