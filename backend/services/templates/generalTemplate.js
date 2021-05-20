const getTemplate = require('./partialTemplate');

module.exports = {
  generic: {
    subject: (subject) => subject || 'RSVPHK',
    html: (body) => getTemplate(`
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
>${body}</span
>
</p>
</tr>
</tbody>
</table>
</td>
</tr>
`),
    text: (body) => body,
  },
};
