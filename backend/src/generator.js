const RETRO_COLORS = {
  cyber: ['#00ff00', '#00ffff', '#ff00ff', '#000000', '#0000ff'],
  gamer: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'],
  glitter: ['#ff69b4', '#ffd700', '#ff1493', '#da70d6', '#ffb6c1'],
  space: ['#000033', '#4169e1', '#ffffff', '#ffd700', '#00ffff'],
  default: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000']
}

const RETRO_GIFS = {
  cyber: ['🤖', '💻', '🔌', '⚡', '🌐'],
  gamer: ['🎮', '🕹️', '👾', '🎯', '🏆'],
  glitter: ['✨', '💎', '🌟', '⭐', '💫'],
  space: ['🚀', '🌙', '⭐', '🪐', '👽'],
  default: ['🔥', '💥', '⚡', '🌈', '✨']
}

const BACKGROUNDS = {
  cyber: 'linear-gradient(45deg, #000000 25%, #001a00 25%, #001a00 50%, #000000 50%, #000000 75%, #001a00 75%, #001a00)',
  gamer: 'repeating-linear-gradient(45deg, #000000, #000000 10px, #1a0000 10px, #1a0000 20px)',
  glitter: 'radial-gradient(circle, #ffe6f0 0%, #ffb6d9 50%, #ff69b4 100%)',
  space: 'radial-gradient(ellipse at center, #000033 0%, #000000 100%)',
  default: 'repeating-linear-gradient(90deg, #ff00ff, #ff00ff 20px, #00ffff 20px, #00ffff 40px)'
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMarquee(text, colors) {
  const color = getRandomElement(colors)
  return `<marquee behavior="scroll" direction="left" style="font-size: 24px; color: ${color}; font-weight: bold; text-shadow: 2px 2px #000000;">${text}</marquee>`
}

function generateBlinkText(text, colors) {
  const color = getRandomElement(colors)
  return `<span style="animation: blink 1s infinite; color: ${color}; font-size: 20px; font-weight: bold;">${text}</span>`
}

export function generatePage(description, theme = '', remix = false) {
  const selectedTheme = theme || 'default'
  const colors = RETRO_COLORS[selectedTheme] || RETRO_COLORS.default
  const emojis = RETRO_GIFS[selectedTheme] || RETRO_GIFS.default
  const background = BACKGROUNDS[selectedTheme] || BACKGROUNDS.default
  
  const randomSeed = remix ? Math.random() : 0.5
  const primaryColor = colors[Math.floor(randomSeed * colors.length)]
  const secondaryColor = colors[Math.floor((randomSeed * 2) % colors.length)]
  const accentColor = colors[Math.floor((randomSeed * 3) % colors.length)]

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${description.substring(0, 50)}</title>
  <style>
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes rainbow {
      0% { color: #ff0000; }
      16% { color: #ff7f00; }
      33% { color: #ffff00; }
      50% { color: #00ff00; }
      66% { color: #0000ff; }
      83% { color: #8b00ff; }
      100% { color: #ff0000; }
    }

    body {
      background: ${background};
      background-size: 20px 20px;
      font-family: "Comic Sans MS", cursive;
      color: ${primaryColor};
      margin: 0;
      padding: 20px;
      text-align: center;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 5px ridge ${accentColor};
      padding: 20px;
      box-shadow: 0 0 30px ${primaryColor};
    }

    h1 {
      font-size: 48px;
      color: ${primaryColor};
      text-shadow: 3px 3px ${secondaryColor}, 6px 6px #000000;
      animation: rainbow 3s infinite;
      font-family: "Impact", sans-serif;
      letter-spacing: 3px;
    }

    .divider {
      height: 5px;
      background: linear-gradient(to right, ${colors.join(', ')});
      margin: 20px 0;
      border: 2px solid ${accentColor};
    }

    .content {
      background: rgba(255, 255, 255, 0.1);
      border: 3px dashed ${secondaryColor};
      padding: 30px;
      margin: 20px 0;
      font-size: 18px;
      line-height: 1.8;
    }

    .emoji-spin {
      display: inline-block;
      font-size: 60px;
      animation: spin 3s linear infinite;
      margin: 20px;
    }

    .button {
      background: linear-gradient(to bottom, ${primaryColor}, ${secondaryColor});
      color: #ffffff;
      border: 4px outset ${accentColor};
      padding: 15px 30px;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      text-shadow: 2px 2px #000000;
      margin: 10px;
      display: inline-block;
      text-decoration: none;
    }

    .button:hover {
      background: linear-gradient(to bottom, ${secondaryColor}, ${primaryColor});
      border-style: inset;
    }

    table {
      width: 100%;
      border: 3px solid ${accentColor};
      margin: 20px 0;
    }

    td {
      border: 2px solid ${secondaryColor};
      padding: 15px;
      background: rgba(0, 0, 0, 0.5);
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: ${accentColor};
    }
  </style>
</head>
<body>
  <div class="container">
    ${generateMarquee('✨ WELCOME TO MY AWESOME PAGE ✨', colors)}
    
    <h1>${description}</h1>
    
    <div class="divider"></div>
    
    <div class="emoji-spin">${getRandomElement(emojis)}</div>
    
    <div class="content">
      <p>${generateBlinkText('★ UNDER CONSTRUCTION ★', colors)}</p>
      <p>Welcome to my totally rad webpage! This site is dedicated to ${description}.</p>
      <p>Thanks for visiting! Don't forget to sign my guestbook!</p>
    </div>

    <table>
      <tr>
        <td>
          <strong style="color: ${primaryColor};">Cool Links:</strong><br>
          <a href="#" class="button">Link 1</a>
          <a href="#" class="button">Link 2</a>
        </td>
        <td>
          <strong style="color: ${secondaryColor};">Stats:</strong><br>
          Visitors: ${Math.floor(Math.random() * 9999) + 1}<br>
          Last Updated: ${new Date().toLocaleDateString()}
        </td>
      </tr>
    </table>

    ${generateMarquee(`${getRandomElement(emojis)} Thanks for visiting! ${getRandomElement(emojis)}`, colors)}

    <div class="footer">
      <p>Best viewed in Netscape Navigator 4.0 or higher</p>
      <p>© ${new Date().getFullYear()} - Made with GeoCities Generator</p>
    </div>
  </div>
</body>
</html>`

  return html
}
