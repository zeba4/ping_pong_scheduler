# Ping Pong Tournament Website


## Table of Contents
1. [Firebase](#firebase)
2. [Creating a tournament](#)

# Firebase

1. Login to Gmail
    ```
    Username: comicsanscdk@gmail.com
	Password: CDK Global
    ```
2. Go to your Firebase console
3. Add a new project
4. Copy **Add Firebase to your web app** code into your program
5. Go to the database tab
6. Go to the rules tab
7. Set the rules to 
    ```javascript
    {
      "rules": {
        ".read": true ,
        ".write": true
      }
    }
    ```