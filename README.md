# Translator

Translator is a Discord bot coded with Javascript, where it can use DeepL API to translate messages.  
It's my first attempt making a bot like this, it may or may not be good work.  
This repo is MIT licensed, so feel free to give advice if you ever find this repo somehow.

## Installation

To install the project:

1. Click the green **Code** button at the top of the repository page.
2. Select **Download ZIP** and extract the files to your computer.
3. Open a terminal in the extracted folder.
4. Run `pnpm install` to install the required dependencies.
5. Add your Discord bot token and DeepL API key to the configuration file (see below for details).
6. Start the bot with `pnpm start`.

Your bot should now be running and ready to use!

## Installing pnpm

You can install `pnpm` globally in different ways depending on your system:

**With PowerShell (Windows):**

```bash
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

**On POSIX systems (Linux/macOS):**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -

# If curl is not installed, you can use wget:
wget -qO- https://get.pnpm.io/install.sh | sh -
```

Alternatively, you can use npm:

```bash
npm install -g pnpm
```

You can get the documentation on their website: [pnpm](https://pnpm.io/)

## Example `.env` file

Create a file named `private.env` in the `private` folder with the following content:

```env
DISCORD_TOKEN=your_discord_bot_token
BOT_ID=your_bot_id
DEEPL_API_KEY=your_deepl_api_key
OWNER_ID=123456789012345678
```

## Getting a DeepL API Key

To use the translation features, you need a DeepL API key:

1. Go to [DeepL's website](https://www.deepl.com/pro#developer).
2. Create an account if you don't have one.
3. Select the **DeepL API Free** plan.
4. After signing up, visit [https://www.deepl.com/en/your-account/keys](https://www.deepl.com/en/your-account/keys) to find your API key.
5. Copy your API key and add it to the `private.env` file located in the `private` folder of this project.

This will allow the bot to access DeepL's translation services.

## Getting a Discord Bot Token

To run the bot, you need a Discord bot token:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and give your bot a name.
3. In the application settings, go to the **Bot** tab and click **Add Bot**.
4. Under the **Bot** section, click **Reset Token** or **Copy** to get your bot token.
5. Add this token to the `private.env` file in the `private` folder.

**Important:** Never share your bot token publicly.

## Features

- Error handlers: The bot will send you a message when an error has occurred.  
  Make sure to put your Discord ID in the `private.env` file to enable this feature. Otherwise, it will just skip it.

## Usage

The bot currently works by reacting to messages with flag emojis. Each supported flag will trigger a translation to the corresponding language using DeepL.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
