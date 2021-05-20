const getTemplate = require('./partialTemplate');

module.exports = {
  subject: () => 'RSVPHK Community || Requested for the username',
  html: (name, username) => getTemplate(`
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
>Hi ${name}, You are receiving this because you (or someone else)
have requested the username of your
account.</span
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
Username: ${username}
</p>
</center>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`),
  text: (name, username) => `Hi ${name},\n\n You are receiving this because you (or someone else)
have requested the username of your
account. Your username is: ${username}`,
};
