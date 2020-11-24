# UniDrive
UniDrive provides a way to access, organize, and manage several Google Drive accounts in one place.

For a more detailed step-by-step walkthrough, check out the `Delivery Documentation` PDF located in the root folder.

## Pre-requisites
Node.js, and Node Package Manager (NPM) are required.

## ⚙ Google Drive API Setup
Setup your application and retrieve a **Google Drive API key** and **Client ID** at https://console.developers.google.com/

## 🔧 Setting up your config file
The config file is needed to be able to run the applicaiton locally. At this point, you should have a **Google Drive API key** and **Client ID**.

Create a `config.js` file in the `src` folder.

Format the file as so. Replace the placeholder text with the necessary information. Do not remove the quotes.
```
export const config = {
    web: {
        api_key: "Paste API Key Here",
        client_id: "Paste Client ID Here",
     }
}
```

## ▶ Running the applicaiton
If you have not already, install all the dependencies by typing in `npm install`

Then, type `npm start` to run the app in the development mode.

Open http://localhost:3000 to view the application in your browser.

## 🌟 Credits
Team UniDrive
- Braeden Collins
- Sebastian Escobar
- Robert Giuffreda
- Jamie Hannukainen
- May Vy Le
- Jeffrey Tram

## 📜 License
UniDrive is under the GNU General Public License v2.0
