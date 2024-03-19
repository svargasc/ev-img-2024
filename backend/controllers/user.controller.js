import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createAccesToken } from "../jwt/jwt.js";
import { TOKEN_SECRET } from "../config.js";
import {OAuth2Client} from 'google-auth-library';
const CLIENT_ID = "209166241205-gu840prv9amr3uhjdoqk5mdjvjvaj2n4.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);


const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password.toString(), saltRounds);
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el email ya está registrado
    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await pool.query(emailCheckQuery, [email]);

    if (existingUsers.length > 0) {
      return res.json({ Error: "Email already exists" });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Inserción de usuario
    const insertQuery =
      "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [username, email, hashedPassword]);

    const token = await createAccesToken({ id: existingUsers.id });
    res.cookie("token", token);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "eventsbrews@gmail.com",
        pass: "yrfy ukhf qzqg ioxc",
      },
    });
    transporter.sendMail({
      from: `eventsbrews@gmail.com`,
      to: `${email}`,
      subject: `Registro exitoso!`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <meta charset="UTF-8">
          <meta content="width=device-width, initial-scale=1" name="viewport">
          <meta name="x-apple-disable-message-reformatting">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta content="telephone=no" name="format-detection">
          <title></title>
          <!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]-->
          <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
          <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
          <!--[if !mso]><!-- -->
          <!-- <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet"> -->
          <!-- <link rel="stylesheet" href="index.css"> -->
          <!--<![endif]-->
          <style>
              /*
      CONFIG STYLES
      Please do not delete and edit CSS styles below
      */
      /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
      *{
          font-family: sans-serif;
      }
      #outlook a {
          padding: 0;
      }
      
      .ExternalClass {
          width: 100%;
      }
      
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
          line-height: 100%;
      }
      
      .es-button {
          mso-style-priority: 100 !important;
          text-decoration: none !important;
      }
      
      a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
      
      .es-desk-hidden {
          display: none;
          float: left;
          overflow: hidden;
          width: 0;
          max-height: 0;
          line-height: 0;
          mso-hide: all;
      }
      
      /*
      END OF IMPORTANT
      */
      s {
          text-decoration: line-through;
      }
      
      body {
          width: 100%;
          font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
      }
      
      table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
      }
      
      table td,
      html,
      body,
      .es-wrapper {
          padding: 0;
          Margin: 0;
      }
      
      .es-content,
      .es-header,
      .es-footer {
          table-layout: fixed !important;
          width: 100%;
      }
      
      img {
          display: block;
          border: 0;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
      }
      
      table tr {
          border-collapse: collapse;
      }
      
      p,
      hr {
          Margin: 0;
      }
      
      h1,
      h2,
      h3,
      h4,
      h5 {
          Margin: 0;
          line-height: 120%;
          mso-line-height-rule: exactly;
          font-family: roboto, 'helvetica neue', helvetica, arial, sans-serif;
      }
      
      p,
      ul li,
      ol li,
      a {
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          mso-line-height-rule: exactly;
      }
      
      .es-left {
          float: left;
      }
      
      .es-right {
          float: right;
      }
      
      .es-p5 {
          padding: 5px;
      }
      
      .es-p5t {
          padding-top: 5px;
      }
      
      .es-p5b {
          padding-bottom: 5px;
      }
      
      .es-p5l {
          padding-left: 5px;
      }
      
      .es-p5r {
          padding-right: 5px;
      }
      
      .es-p10 {
          padding: 10px;
      }
      
      .es-p10t {
          padding-top: 10px;
      }
      
      .es-p10b {
          padding-bottom: 10px;
      }
      
      .es-p10l {
          padding-left: 10px;
      }
      
      .es-p10r {
          padding-right: 10px;
      }
      
      .es-p15 {
          padding: 15px;
      }
      
      .es-p15t {
          padding-top: 15px;
      }
      
      .es-p15b {
          padding-bottom: 15px;
      }
      
      .es-p15l {
          padding-left: 15px;
      }
      
      .es-p15r {
          padding-right: 15px;
      }
      
      .es-p20 {
          padding: 20px;
      }
      
      .es-p20t {
          padding-top: 20px;
      }
      
      .es-p20b {
          padding-bottom: 20px;
      }
      
      .es-p20l {
          padding-left: 20px;
      }
      
      .es-p20r {
          padding-right: 20px;
      }
      
      .es-p25 {
          padding: 25px;
      }
      
      .es-p25t {
          padding-top: 25px;
      }
      
      .es-p25b {
          padding-bottom: 25px;
      }
      
      .es-p25l {
          padding-left: 25px;
      }
      
      .es-p25r {
          padding-right: 25px;
      }
      
      .es-p30 {
          padding: 30px;
      }
      
      .es-p30t {
          padding-top: 30px;
      }
      
      .es-p30b {
          padding-bottom: 30px;
      }
      
      .es-p30l {
          padding-left: 30px;
      }
      
      .es-p30r {
          padding-right: 30px;
      }
      
      .es-p35 {
          padding: 35px;
      }
      
      .es-p35t {
          padding-top: 35px;
      }
      
      .es-p35b {
          padding-bottom: 35px;
      }
      
      .es-p35l {
          padding-left: 35px;
      }
      
      .es-p35r {
          padding-right: 35px;
      }
      
      .es-p40 {
          padding: 40px;
      }
      
      .es-p40t {
          padding-top: 40px;
      }
      
      .es-p40b {
          padding-bottom: 40px;
      }
      
      .es-p40l {
          padding-left: 40px;
      }
      
      .es-p40r {
          padding-right: 40px;
      }
      
      .es-menu td {
          border: 0;
      }
      
      .es-menu td a img {
          display: inline-block !important;
      }
      
      /*
      END CONFIG STYLES
      */
      a {
          text-decoration: none;
      }
      
      p,
      ul li,
      ol li {
          font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
          line-height: 150%;
      }
      
      ul li,
      ol li {
          Margin-bottom: 15px;
          margin-left: 0;
      }
      
      .es-menu td a {
          text-decoration: none;
          display: block;
          font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
      }
      
      .es-wrapper {
          width: 100%;
          height: 100%;
          background-repeat: repeat;
          background-position: center top;
      }
      
      .es-wrapper-color,
      .es-wrapper {
          background-color: #ffffff;
      }
      
      .es-header {
          background-color: transparent;
          background-repeat: repeat;
          background-position: center top;
      }
      
      .es-header-body {
          background-color: transparent;
      }
      
      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li {
          color: #333333;
          font-size: 14px;
      }
      
      .es-header-body a {
          color: #f6a1b4;
          font-size: 14px;
      }
      
      .es-content-body {
          background-color: #ffffff;
      }
      
      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li {
          color: #333333;
          font-size: 14px;
      }
      
      .es-content-body a {
          color: #f6a1b4;
          font-size: 14px;
      }
      
      .es-footer {
          background-color: transparent;
          background-repeat: repeat;
          background-position: center top;
      }
      
      .es-footer-body {
          background-color: #666666;
      }
      
      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li {
          color: #ffffff;
          font-size: 14px;
      }
      
      .es-footer-body a {
          color: #f6a1b4;
          font-size: 14px;
      }
      
      .es-infoblock,
      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li {
          line-height: 120%;
          font-size: 12px;
          color: #cccccc;
      }
      
      .es-infoblock a {
          font-size: 12px;
          color: #cccccc;
      }
      
      h1 {
          font-size: 30px;
          font-style: normal;
          font-weight: normal;
          color: #333333;
      }
      
      h2 {
          font-size: 26px;
          font-style: normal;
          font-weight: normal;
          color: #333333;
      }
      
      h3 {
          font-size: 18px;
          font-style: normal;
          font-weight: normal;
          color: #333333;
      }
      
      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
          font-size: 30px;
      }
      
      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
          font-size: 26px;
      }
      
      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
          font-size: 18px;
      }
      
      a.es-button,
      button.es-button {
          display: inline-block;
          background: #f8f3ef;
          border-radius: 3px;
          font-size: 17px;
          font-family: roboto, 'helvetica neue', helvetica, arial, sans-serif;
          font-weight: normal;
          font-style: normal;
          line-height: 120%;
          color: #64434a;
          text-decoration: none;
          width: auto;
          text-align: center;
          padding: 10px 20px 10px 20px;
          mso-padding-alt: 0;
          mso-border-alt: 10px solid #f8f3ef;
      }
      
      .es-button-border {
          border-style: solid solid solid solid;
          border-color: transparent transparent transparent transparent;
          background: #f8f3ef;
          border-width: 0px 0px 0px 0px;
          display: inline-block;
          border-radius: 3px;
          width: auto;
      }
      
      /*
      RESPONSIVE STYLES
      Please do not delete and edit CSS styles below.
       
      If you don't need responsive layout, please delete this section.
      */
      @media only screen and (max-width: 600px) {
      
          p,
          ul li,
          ol li,
          a {
              line-height: 150% !important;
          }
      
          h1,
          h2,
          h3,
          h1 a,
          h2 a,
          h3 a {
              line-height: 120% !important;
          }
      
          h1 {
              font-size: 30px !important;
              text-align: center;
          }
      
          h2 {
              font-size: 26px !important;
              text-align: center;
          }
      
          h3 {
              font-size: 20px !important;
              text-align: center;
          }
      
          .es-header-body h1 a,
          .es-content-body h1 a,
          .es-footer-body h1 a {
              font-size: 30px !important;
          }
      
          .es-header-body h2 a,
          .es-content-body h2 a,
          .es-footer-body h2 a {
              font-size: 26px !important;
          }
      
          .es-header-body h3 a,
          .es-content-body h3 a,
          .es-footer-body h3 a {
              font-size: 20px !important;
          }
      
          .es-menu td a {
              font-size: 14px !important;
          }
      
          .es-header-body p,
          .es-header-body ul li,
          .es-header-body ol li,
          .es-header-body a {
              font-size: 14px !important;
          }
      
          .es-content-body p,
          .es-content-body ul li,
          .es-content-body ol li,
          .es-content-body a {
              font-size: 16px !important;
          }
      
          .es-footer-body p,
          .es-footer-body ul li,
          .es-footer-body ol li,
          .es-footer-body a {
              font-size: 14px !important;
          }
      
          .es-infoblock p,
          .es-infoblock ul li,
          .es-infoblock ol li,
          .es-infoblock a {
              font-size: 12px !important;
          }
      
          *[class="gmail-fix"] {
              display: none !important;
          }
      
          .es-m-txt-c,
          .es-m-txt-c h1,
          .es-m-txt-c h2,
          .es-m-txt-c h3 {
              text-align: center !important;
          }
      
          .es-m-txt-r,
          .es-m-txt-r h1,
          .es-m-txt-r h2,
          .es-m-txt-r h3 {
              text-align: right !important;
          }
      
          .es-m-txt-l,
          .es-m-txt-l h1,
          .es-m-txt-l h2,
          .es-m-txt-l h3 {
              text-align: left !important;
          }
      
          .es-m-txt-r img,
          .es-m-txt-c img,
          .es-m-txt-l img {
              display: inline !important;
          }
      
          .es-button-border {
              display: inline-block !important;
          }
      
          a.es-button,
          button.es-button {
              font-size: 20px !important;
              display: inline-block !important;
          }
      
          .es-btn-fw {
              border-width: 10px 0px !important;
              text-align: center !important;
          }
      
          .es-adaptive table,
          .es-btn-fw,
          .es-btn-fw-brdr,
          .es-left,
          .es-right {
              width: 100% !important;
          }
      
          .es-content table,
          .es-header table,
          .es-footer table,
          .es-content,
          .es-footer,
          .es-header {
              width: 100% !important;
              max-width: 600px !important;
          }
      
          .es-adapt-td {
              display: block !important;
              width: 100% !important;
          }
      
          .adapt-img {
              width: 100% !important;
              height: auto !important;
          }
      
          .es-m-p0 {
              padding: 0px !important;
          }
      
          .es-m-p0r {
              padding-right: 0px !important;
          }
      
          .es-m-p0l {
              padding-left: 0px !important;
          }
      
          .es-m-p0t {
              padding-top: 0px !important;
          }
      
          .es-m-p0b {
              padding-bottom: 0 !important;
          }
      
          .es-m-p20b {
              padding-bottom: 20px !important;
          }
      
          .es-mobile-hidden,
          .es-hidden {
              display: none !important;
          }
      
          tr.es-desk-hidden,
          td.es-desk-hidden,
          table.es-desk-hidden {
              width: auto !important;
              overflow: visible !important;
              float: none !important;
              max-height: inherit !important;
              line-height: inherit !important;
          }
      
          tr.es-desk-hidden {
              display: table-row !important;
          }
      
          table.es-desk-hidden {
              display: table !important;
          }
      
          td.es-desk-menu-hidden {
              display: table-cell !important;
          }
      
          .es-menu td {
              width: 1% !important;
          }
      
          table.es-table-not-adapt,
          .esd-block-html table {
              width: auto !important;
          }
      
          table.es-social {
              display: inline-block !important;
          }
      
          table.es-social td {
              display: inline-block !important;
          }
      
          .es-desk-hidden {
              display: table-row !important;
              width: auto !important;
              overflow: visible !important;
              max-height: inherit !important;
          }
      }
      
      /*
      END RESPONSIVE STYLES
      */
          </style>
      </head>
      
      <body>
          <div dir="ltr" class="es-wrapper-color">
              <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#ffffff"></v:fill>
            </v:background>
          <![endif]-->
              <table class="es-wrapper" style="background-position: center top;" width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                      <tr>
                          <td class="esd-email-paddings" valign="top">
                              <table class="es-header" cellspacing="0" cellpadding="0" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe" esd-custom-block-id="15610" align="center">
                                              <table class="es-header-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-image es-p20b" align="center" style="font-size:0"><a href="https://viewstripo.email" target="_blank"><img src="https://eventsbrewssj.netlify.app/assets/logoeventsBrew-DcTLmFXm.png" alt style="display: block;" width="154"></a></td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe" align="center">
                                              <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                              <table style="border-radius: 3px; border-collapse: separate; background-color: #fcfcfc;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-m-txt-l es-p30t es-p20r es-p20l" align="left">
                                                                                              <h2 style="color: #333333;">Bienvenido!</h2>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-p10t es-p20r es-p20l" bgcolor="#fcfcfc" align="left">
                                                                                              <p>Hola ${username}, este correo es para confirmar tu registro en <strong>&copy;EventsBrew</strong>. 
                                                                                                  Esperamos ahora puedas agregar eventos de tu establecimiento y generar mas visitas a este. 
                                                                                                  Procede a hacer el incio de sesión por medio del siguiente link.<br></p>
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td class="esd-structure es-p30t es-p20r es-p20l" style="background-color: #fcfcfc;" esd-custom-block-id="15791" bgcolor="#fcfcfc" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                              <table style="border-color: #efefef; border-style: solid; border-width: 1px; border-radius: 3px; border-collapse: separate; background-color: #ffffff;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-p20t es-p15b" align="center">
                                                                                              <h3 style="color: #333333;">Información para tu inicio de sesión:</h3>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td class="esd-block-text" align="center">
                                                                                              <p style="color: #64434a; font-size: 16px; line-height: 150%;">Correo: ${email}</p>
                                                                                              <p style="color: #64434a; font-size: 16px; line-height: 150%;">Contraseña: xxxxxxx</p>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td class="esd-block-button es-p20t es-p20b es-p10r es-p10l" align="center"><span class="es-button-border" style="background: #f8f3ef none repeat scroll 0% 0%;"><a href="https://eventsbrewssj.netlify.app/login" class="es-button" target="_blank" style="background: #f8f3ef none repeat scroll 0% 0%; mso-border-alt: 10px solid  #f8f3ef">Ir al inicio de sesión</a></span></td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe" align="center">
                                              <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                              <table style="background-color: #fff4f7;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff4f7">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-p20t es-p5b es-p20r es-p20l" align="center">
                                                                                              <h3>Descubre, saborea y disfruta!</h3>
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe" style="background-color: #666666;" esd-custom-block-id="15624" bgcolor="#666666" align="center">
                                              <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                              <table style="background-color: #fff4f7; border-radius: 3px; border-collapse: separate;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff4f7">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-spacer es-p5t es-p5b es-p20r es-p20l" bgcolor="#fff4f7" align="center" style="font-size:0">
                                                                                              <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                  <tbody>
                                                                                                      <tr>
                                                                                                          <td style="border-bottom: 1px solid #fff4f7; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                      </tr>
                                                                                                  </tbody>
                                                                                              </table>
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              <table cellpadding="0" cellspacing="0" class="es-footer" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe" style="background-color: #666666;" esd-custom-block-id="15625" bgcolor="#666666" align="center">
                                              <table class="es-footer-body" style="background-color: #666666;" width="600" cellspacing="0" cellpadding="0" bgcolor="#666666" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td esdev-links-color="#999999" class="esd-block-text" align="center">
                                                                                              <p style="color: #ffffff;">Si llegas a tener algun error o inconveniente con tu inicio de sesión</p>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td align="center" class="esd-block-text es-p5b">
                                                                                              <p style="color: #ffffff;">Puedes contactarte a <strong>eventsbrews@gmail.com</strong> para solución previa</p>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td esdev-links-color="#999999" class="esd-block-text es-p5b" align="center">
                                                                                              <p style="color: #ffffff;">Colombia Armenia-Quíndio 2024</p>
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                              
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      
      </html>`,
    });
    res.json({ Status: "Success Register" });
  } catch (error) {
    console.error("Error in register:", error);
    return res.json({ Error: "Registration error in server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Obtener usuario por email
    const sql = "SELECT * FROM users WHERE email = ?";
    const [data] = await pool.query(sql, [email]);

    if (data.length === 0) {
      return res.json({ Error: "No email exists" });
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(
      password.toString(),
      data[0].password
    );

    if (passwordMatch) {
      const user = {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        password: data[0].password,
      };

      jwt.sign(user, TOKEN_SECRET, (err, token) => {
        if (err) {
          res.status(400).send({ msg: "Error" });
        } else {
          res.send({ msg: "success login user", user, token: token });
        }
      });
    } else {
      return res.json({ Error: "Password not matched" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.json({ Error: "Login error in server" });
  }
};


export const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log("Token en los headers cuando se verifica", authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized 2" });
    }

    try {
      const id = decoded.id;
      const userQuery = "SELECT * FROM users WHERE id = ?";
      const [usertData] = await pool.query(userQuery, [id]);

      if (userQuery.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = usertData[0];
      req.user = user;
      res.json({message: "ok admin", user})
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

////////////////////////////////////////

export const verifyTokens = async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];
  
    console.log("Token en los headers cuando se verifica de Google", authorizationHeader);
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Unauthorized 1" });
    }
  
    const token = authorizationHeader.split(" ")[1];
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      req.user = payload; // Guardar la información del usuario en el request para su uso posterior
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Unauthorized 2" });
    }
  };

////////////////////////////////////////

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = (req, res) => {
  console.log(req.username);
  res.send("Profilee");
};
