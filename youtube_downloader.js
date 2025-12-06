// ==UserScript==
// @name         YouTube Downloader
// @namespace    http://tampermonkey.net/
// @version      2025-12-05
// @description  Send YouTube URL to local yt-dlp with audio/video options
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
        #ytCustomDownloadContainer {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-right: 16px;
        }
        #ytCustomDownloadSelect {
          font-size: 14px;
          background-color: #282828;
          color: white;
          border: none;
          cursor: pointer;
          min-width: 140px;
          height: 40px;
          font-family: "Roboto", "Arial", sans-serif;
          font-weight: 500;
          margin: 8px, 8px, 8px, 8px;
          padding-left: 20px;
          cursor: pointer;
          border-radius: 20px;
        }
        #ytCustomDownloadSelect:hover {
          border-color: #888;
        }
        #ytCustomDownloadBtn {
          background-color: #282828;
          color: white;
          height: 40px;
          font-family: "Roboto", "Arial", sans-serif;
          font-size: 14px;
          font-weight: 500;
          margin: 8px, 8px, 8px, 8px;
          padding: 10px 20px 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 20px;
        }
        #ytCustomDownloadBtn:hover {
          background-color: #2f6fe0;
        }
        #ytCustomDownloadBtn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
    `);

  // Save user's last choice
  const LAST_CHOICE_KEY = 'ytDownloadLastChoice';

  function getYtDlpCommand(url, formatChoice) {
    const baseCmd = "yt-dlp";

    switch (formatChoice) {
      case 'video':
        // Best video quality with best audio, merged
        return `${baseCmd} -f "bestvideo+bestaudio" --merge-output-format mp4 "${url}"`;

      case 'audio':
        // Best audio quality only
        return `${baseCmd} -x --audio-format mp3 --audio-quality 0 "${url}"`;

      default:
        return `${baseCmd} "${url}"`;
    }
  }

  function getFormatDisplayName(choice) {
    return choice === 'video' ? 'Video (high quality)' : 'Audio only (MP3)';
  }

  function waitForButtons() {
    const rightButtons = document.querySelector('#buttons');

    if (!rightButtons) {
      requestAnimationFrame(waitForButtons);
      return;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'ytCustomDownloadContainer';

    // Create dropdown
    const select = document.createElement('select');
    select.id = 'ytCustomDownloadSelect';

    // Create options
    const options = [
      { value: 'video', text: 'Video (high quality)' },
      { value: 'audio', text: 'Audio only (MP3)' }
    ];

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      select.appendChild(option);
    });

    // Load last choice or default to video
    const lastChoice = GM_getValue(LAST_CHOICE_KEY, 'video');
    select.value = lastChoice;

    // Create download button
    const btn = document.createElement('button');
    btn.id = 'ytCustomDownloadBtn';
    btn.textContent = "Download";

    // Add event listener
    btn.addEventListener('click', async () => {
      const url = window.location.href;
      const cleanUrl = url.replace(/&.*/, '');
      const formatChoice = select.value;
      const formatName = getFormatDisplayName(formatChoice);

      // Show confirmation dialog
      const confirmed = confirm(`Download as ${formatName}?\n\nVideo: ${document.title}`);

      if (!confirmed) {
        return; // User clicked "Cancel"
      }

      // Save user's choice
      GM_setValue(LAST_CHOICE_KEY, formatChoice);

      const cmd = getYtDlpCommand(cleanUrl, formatChoice);

      // Disable button while processing
      btn.disabled = true;
      btn.textContent = "Sending...";

      try {
        await fetch("http://localhost:9999/run?cmd=" + encodeURIComponent(cmd));
        console.log("Sent to yt-dlp:", cmd);
        // No visual feedback - just logs to console
      } catch (err) {
        console.error("Failed to send:", err);
        // No visual feedback - just logs to console
      } finally {
        // Re-enable button
        btn.disabled = false;
        btn.textContent = "Download";
      }
    });

    // Add elements to container
    container.appendChild(select);
    container.appendChild(btn);

    // Insert before the buttons container
    rightButtons.parentNode.insertBefore(container, rightButtons);

    console.log("Download button injected");
  }

  waitForButtons();
})();
