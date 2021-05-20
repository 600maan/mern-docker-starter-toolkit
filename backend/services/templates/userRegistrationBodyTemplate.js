const getTemplate = require('./partialTemplate');

module.exports = {
  subject: () => 'Verify your email address',
  text: (token) => 'We are excited to have you get started. First you need to confirm your account. Just copy and paste the link below \n\n'
+ ` ${process.env.APP_HOST}/${process.env.EMAIL_CONFIRM_URL}/?token=${token}`
+ 'Verification codes expire after two hours.',
  html: (token) => getTemplate(`<tr>
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
<td
align="center"
class="inner"
style="
padding-top: 15px;
padding-bottom: 15px;
padding-right: 30px;
padding-left: 30px;
"
valign="middle"
>
<span
class="sg-image"
data-imagelibrary="%7B%22width%22%3A%22255%22%2C%22height%22%3A93%2C%22alt_text%22%3A%22Forgot%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"
><img
alt="Forgot Password"
class="banner"
height="93"
src="https://marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png"
style="
border-width: 0px;
margin-top: 30px;
width: 255px;
height: 93px;
"
width="255"
/></span>
</td>
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
Confirm your Account
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
We are excited to have you get started. First you need to confirm your account.Just click the button below.</span
>
</p>

<div style="
background-color: rgb(8, 73, 101);
color: rgb(255, 255, 255);
max-width: 200;
padding-left: 22px;
padding-right: 22px;
font-weight: 600;
min-height: 37px;
border: none;
border-radius:3px;
">
<a href='${process.env.APP_HOST}/${process.env.EMAIL_CONFIRM_URL}/?token=${token}' style="
color: rgb(255, 255, 255);
text-decoration: none;
">Confirm Account</a>
</div>
<p
class="description center"
style="
font-family: 'Muli', 'Arial Narrow', Arial;
margin: 0;
margin-top: 10px;
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
If button is not working, just copy and paste the link in the browser.</span
>
</p>
<a href='${process.env.APP_HOST}/${process.env.EMAIL_CONFIRM_URL}/?token=${token}'>${process.env.APP_HOST}/${process.env.EMAIL_CONFIRM_URL}/?token=${token}</a>
</center>
</td>
</tr>
</tbody>
</table>
</td>
</tr>`),
};
