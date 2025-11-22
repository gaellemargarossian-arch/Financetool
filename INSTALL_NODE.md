# Installing Node.js for Budget App

## Quick Setup (Choose One Method)

### Method 1: Direct Download (Easiest - No Terminal Required)

1. **Visit Node.js website**: https://nodejs.org/
2. **Download the LTS version** (Long Term Support) - this is the recommended version
3. **Run the installer** (.pkg file)
4. **Follow the installation wizard**
5. **Restart your terminal** or open a new terminal window
6. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```
7. **Install project dependencies**:
   ```bash
   cd /Users/gaellemarguarossian/Documents/Public/Budget
   npm install
   ```

### Method 2: Using Homebrew (Recommended for Developers)

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - This will ask for your password (sudo access)
   - Follow the on-screen instructions

2. **After Homebrew installation**, you may need to add it to your PATH:
   ```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```

3. **Install Node.js**:
   ```bash
   brew install node
   ```

4. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

5. **Install project dependencies**:
   ```bash
   cd /Users/gaellemarguarossian/Documents/Public/Budget
   npm install
   ```

### Method 3: Using nvm (Node Version Manager)

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Restart terminal** or reload your shell:
   ```bash
   source ~/.zshrc
   ```

3. **Install Node.js LTS**:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

4. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

5. **Install project dependencies**:
   ```bash
   cd /Users/gaellemarguarossian/Documents/Public/Budget
   npm install
   ```

## After Installing Node.js

Once Node.js is installed, you can proceed with:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase** (see SETUP.md)

3. **Add OpenAI API key** (see SETUP.md)

4. **Run the app**:
   ```bash
   npm start
   ```

## Troubleshooting

### "command not found: node" or "command not found: npm"
- Make sure you've restarted your terminal after installation
- Try opening a new terminal window
- Verify installation: `which node` and `which npm`

### Permission Errors
- If you get permission errors, you may need to use `sudo` (not recommended for npm install)
- Better solution: Fix npm permissions: `mkdir ~/.npm-global && npm config set prefix '~/.npm-global'`

### Version Issues
- Make sure you have Node.js v16 or higher
- Check version: `node --version`

## Recommended: Method 1 (Direct Download)

For the quickest setup, use **Method 1** - just download and install from nodejs.org. It's the simplest and doesn't require any terminal commands for installation.

