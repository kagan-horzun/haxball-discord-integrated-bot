# HAXBALL DISCORD INTEGRATED ADVANCED BOT

- There is only a **Turkish** version for now. If you want to contribute by translating the project into your own language, contact me.
- If you want to translate the project yourself, I recommend using DeepL (https://www.deepl.com).

🎉 **About**  
- Version: `1.18`
  
- Need help? You can come to our Discord server.
- Our Discord Server: `https://discord.gg/brTyQyPAzB`

🎉 **Project Purpose**  
This project is designed to assist **people with no coding knowledge** who want to **create and manage a HaxBall room with many different options**. Additionally, with **Discord integration**, users can **intervene in room management via Discord**, controlling the room with various commands.

---

## 🚀 **Key Features**

- **Advanced Statistics System**
- **Discord Integration** (Room management via Discord)
- **Team and Player Chat**
- **Goal Notification with Shot Speed**
- **Automatic Game Recording**
- **Admin and Ban System**
- **Admin Call System via Discord**
- **Rank System**
- **And more!**

---

## ⚙️ **Setup and Usage**

1. Clone this repository (or download it):
    ```bash
    git clone https://github.com/kgn-h/haxball-discord-integrated-bot.git
    ```

2. Install node.js from here: https://nodejs.org/en

3. Install the necessary dependencies:
    ```bash
    npm install haxball.js
    npm install node-localstorage
    npm install discord.js
    npm install fs
    npm install path
    ```

4. Make the configuration as in the content of the main.js file.

5. Start the bot:
    ```bash
    node main.js
    ```

**I recommend using "Visual Studio Code" as a code editor. You can download it here: https://code.visualstudio.com/**

---

## 📝 **Discord Commands**

- **COMMANDS IN TURKISH** (English version is not avaible for now)

- **`/mesajgönder`**  
  - Sends a message to the room.  
  - **Usage:**  
    `/mesajgönder mesaj: [Message Content]`

- **`/oyuncular`**  
  - Lists the players in the room.  
  - **Usage:**  
    `/oyuncular`

- **`/oyuncuyuat`**  
  - Kicks or bans a player from the room.  
  - **Usage:**  
    `/oyuncuyuat id: [Player ID] ban: [yes/no] sebep: [Reason]`

- **`/odalinki`**  
  - Retrieves the room's entry link.  
  - **Usage:**  
    `/odalinki`

- **`/odanickim`**  
  - Matches your HaxBall nickname with your Discord account.  
  - **Usage:**  
    `/odanickim nick: [Your HaxBall Nickname]`

- **`/odanickimne`**  
  - Displays your matched HaxBall nickname.  
  - **Usage:**  
    `/odanickimne`

- **`/rank`**  
  - Displays your current rank and statistics.  
  - **Usage:**  
    `/rank`

- **`/temizle`**  
  - Deletes a specified number of messages.  
  - **Usage:**  
    `/temizle sayı: [Number of Messages to Delete]`

---

## 🏆 **Rank System**

**Ranking System:**

- **0 - 500 Points** → **Rookie**
- **501 - 1000 Points** → **Beginner**
- **1001 - 2000 Points** → **Intermediate**
- **2001 - 5000 Points** → **Pro**
- **5001+ Points** → **HP**
- **Unranked** → **Unranked**

---

🎉 **Also thanks to @Wazarr94 for the infrastructure** (https://github.com/Wazarr94)

---
