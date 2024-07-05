import nodemailer from "nodemailer";
import validator from "validator";
const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
    host: config.MAILHOST,
    port: config.MAILPORT,
    auth: {
        user: config.MAILUSER,
        pass: config.MAILPASSWORD,
    },
});

export default defineEventHandler(async (event, response) => {
    try {
        const body = await readBody(event);

        await isValid(body);

        const config = useRuntimeConfig();

        const mail = await transporter.sendMail({
            form: `"${body.name} <${body.email}>`,
            to: config.CONTACTMAIL,
            subject: body.subject,
            text: body.message,
            html: body.message,
        });

        console.log("Message sent: %s", mail.MessageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mail));
        //return Promise.resolve;

        return "Sent!";
    } catch (error) {
        console.error(error);
        sendError(event, createError({ status: 400, statusMessage: error }));
    }
});

async function isValid(body) {
    const errors = [];

    if (validator.isEmpty(body.email || ""))
        errors.push({
            field: "email",
            error: "Field is required.",
        });

    if (errors.length > 0) {
        return Promise.reject(errors);
    } else {
        return Promise.resolve({});
    }
}
