const os = require('os');
const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDISHOST || 'redis',
  port: process.env.REDISPORT || 6379,
  password: process.env.REDISPASSWORD
});

app.get('/', function(req, res) {
    redisClient.get('numVisits', function(err, numVisits) {
        numVisitsToDisplay = parseInt(numVisits) + 1;
        if (isNaN(numVisitsToDisplay)) {
            numVisitsToDisplay = 1;
        }

       
        res.send(`
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: #f4f7f6;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .card {
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }
                    h1 { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
                    .info { margin: 15px 0; font-size: 16px; color: #555; }
                    .highlight { font-weight: bold; color: #3498db; }
                    .counter { font-size: 48px; font-weight: bold; color: #2ecc71; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🐳 Container Metrics</h1>
                    <div class="info">Hostname: <span class="highlight">${os.hostname()}</span></div>
                    <div class="counter">${numVisitsToDisplay}</div>
                    <div class="info" style="color: #888;">Total Visits Scaled</div>
                </div>
            </body>
            </html>
        `);

        numVisits++;
        redisClient.set('numVisits', numVisits);
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', function() {
    console.log(`Web application is listening on port ${PORT}`);
  });
}

module.exports = app;
