const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequest = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [
            ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
        ];

        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(
                    "New Friend Request Pending For you! " + email,
                    `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #0073e6;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 22px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
            line-height: 1.5;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 12px;
            text-align: center;
            background: #0073e6;
            color: white;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            New Friend Request Pending!
        </div>
        <div class="content">
            <p>Dear ${email},</p>
            <p>You have multiple friend requests pending. Don't miss the chance to connect!</p>
            <p>Please log in to the <strong>Devtinders</strong> portal to accept or reject them.</p>
            <a href="https://devtinders.co.in" class="button">Review Requests</a>
            <p>If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
            &copy; 2025 DevTinders | All Rights Reserved
        </div>
    </div>
</body>
</html>
`,
                    email,
                );
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
});
