# Security Setup Instructions

## Admin Password Configuration

The admin password is now securely stored server-side using PHP password hashing.

### To Set Your Own Admin Password:

1. Open a terminal and run this command (replace `YourNewPassword` with your desired password):
   ```bash
   php -r "echo password_hash('YourNewPassword', PASSWORD_DEFAULT);"
   ```

2. Copy the output hash (it will look something like: `$2y$10$...`)

3. Open `auth.php` and find line 7:
   ```php
   $PASSWORD_HASH = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
   ```

4. Replace the hash with your newly generated hash

5. Save the file

### Current Default Password

⚠️ **IMPORTANT**: The default password is currently set to `password`

**YOU MUST CHANGE THIS IMMEDIATELY** by following the steps above!

---

## YouTube API Key

The YouTube API key is now stored server-side in `youtube-api.php`.

### Security Notes:

- The API key is never exposed to client-side JavaScript
- All YouTube API requests are proxied through the server
- This prevents unauthorized use of your API key

### To Change the YouTube API Key:

1. Open `youtube-api.php`
2. Find line 7:
   ```php
   define('YOUTUBE_API_KEY', 'AIzaSyAtNIp9P7AsGDUu6dwDJfhS5MsrNjoxQnQ');
   ```
3. Replace the key with your new key
4. Save the file

---

## Additional Security Recommendations

1. **Restrict file permissions** on PHP files containing sensitive data:
   ```bash
   chmod 600 auth.php youtube-api.php
   ```

2. **Use HTTPS**: Ensure your site uses HTTPS to encrypt passwords in transit

3. **Regular password changes**: Change admin password periodically

4. **Monitor API usage**: Check your YouTube API quota regularly in Google Cloud Console
