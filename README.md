# logAnalytics

Log analytics write in node:

-Set in env/local.js:
    in winston:
        -The level of log trace, if set to debug everything will be traced.
        -The name of the log file to write the logs to.
    in postgres:
        -the URL and the table where analytics will query for data analytics
    in analytics:
        -the crond scheduled for analytics to execute:
            -'*/1 * * * *' each minute
            -'* */1 * * *' each hour
        -the starthost for analytics: a list of hostnames received connections from a starthost during the last hour
        -the endhost for analytics: a list of hostnames connected to a given endhost during the last hour

Install dependencies with:
    - npm i
Start app with:
    - node start
-Wait cron time to get analytics in log file.




NOTE: To log into the console or in file, change the desired transport class in modules/logger.js    
NOTE: For testing purposes cron is set to EVERY MINUTES        