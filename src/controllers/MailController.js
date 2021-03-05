const { getAuth } = require("../auth/googleAuth");
const { google } = require('googleapis');
const SentMail = require('../models/sentEmail');
const mimemessage = require('mimemessage');
const fs = require('fs');


async function makeBody(to, file) {
    const fileBase64 = fs.readFileSync(file.path).toString('base64');

    let msg, alternateEntity, htmlEntity, plainEntity, pngEntity;

    // Build the top-level multipart MIME message.
    msg = mimemessage.factory({
        contentType: 'multipart/mixed',
        body: []
    });
    msg.header('To', to);
    msg.header('Subject', 'Attachment!');

    // Build the multipart/alternate MIME entity containing both the HTML and plain text entities.
    alternateEntity = mimemessage.factory({
        contentType: 'multipart/alternate',
        body: []
    });

    // // Build the HTML MIME entity.
    // // !! Uncomment the PUSH of htmlEntity !!
    // htmlEntity = mimemessage.factory({
    //     contentType: 'text/html;charset=utf-8',
    //     body: '<p>This is the <strong>HTML</strong> version of the message.</p>'
    // });

    // Build the plain text MIME entity.
    plainEntity = mimemessage.factory({
        body: 'I believe this is satisfying.'
    });

    // Build the PNG MIME entity.
    pngEntity = mimemessage.factory({
        contentType: file.mimetype,
        contentTransferEncoding: 'base64',
        body: fileBase64
    });
    pngEntity.header('Content-Disposition', `attachment; filename="${file.filename}"`);

    // Add both the HTML and plain text entities to the multipart/alternate entity.
    // alternateEntity.body.push(htmlEntity);
    alternateEntity.body.push(plainEntity);

    // Add the multipart/alternate entity to the top-level MIME message.
    msg.body.push(alternateEntity);

    // Add the PNG entity to the top-level MIME message.
    msg.body.push(pngEntity);

    var encodedMail = new Buffer.from(msg.toString()).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

async function sendMessage(to, file, auth) {
    const gmail = google.gmail('v1');
    const raw = await makeBody(to, file);

    let sending; // Awaiting result from try / catch
    let registering; // Awaiting result from registerSentEmail

    try {
        sending = await gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw
            }
        }, 'stream');

        sending = {
            // status: sending.status,
            ok: true,
            message: sending.statusText,
            submission_id: sending.data.id
        }
    } catch (e) {
        console.error('Error sending email in Try/Catch ("let sending"): ', e);
        sending = { ok: false, message: e.message, status: e.response.status }
        return sending;
    }

    if (sending.submission_id) {
        registering = await registerSentEmail({ to, submission_id: sending.submission_id, filename: file.filename }, auth)

        if (registering.ok) {
            return sending;
        } else {
            console.error('Eror registering email ("let registering"): ',registering);
            return registering
        }
    }

}

async function registerSentEmail(mailInfo, auth) {
    const gmail = google.gmail('v1');

    let profile; // Awaiting result from try / catch
    let err; // Awaiting result from try / catch

    try {
        profile = await gmail.users.getProfile({
            auth: auth,
            userId: 'me'
        })
    } catch (e) {
        console.error(e)
        err = "Can't get user profile from Google. Message was sent, but not registered to DB"

        return { ok: false, message: err }
    }

    if (!err) {
        let err;
        try {
            await SentMail.create({
                email_to: mailInfo.to,
                submission_id: mailInfo.submission_id,
                email_from: profile.data.emailAddress,
                file_name: mailInfo.filename
            })
            return { ok: true }
        } catch (error) {
            err = 'error on writing to DB. Message was sent, but not registered to DB'
            console.log('Writing to DB', error)
            return { ok: false, message: err }
        }

    }
}

function delUploadedFile(file) {
    fs.unlinkSync(file.path);
}

async function handleSendEmail(req, res) {
    console.log(req.body)
    const { to, file } = req.body;

    const auth = getAuth();

    const result = await sendMessage(to, file, auth);

    delUploadedFile(file); //For security reasons & to save storage

    res.status(result.ok ? 200 : 500)
    return res.json({ ...result })
}

module.exports = { handleSendEmail };