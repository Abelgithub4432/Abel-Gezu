// Terminal simulation

// Array of possible commands to display
const possibleCommands = [
  {
    command: "ls -la /security/projects/",
    output: [
      "drwxr-xr-x  2 cyberpro  staff   68B Aug 15 09:23 network-audit/",
      "drwxr-xr-x  2 cyberpro  staff   68B Jul 22 15:17 pentest-reports/",
      "drwxr-xr-x  2 cyberpro  staff   68B Sep 01 11:05 vulnerability-assessment/",
    ],
  },
  {
    command: "nmap -sV --script=vuln 192.168.1.1",
    output: [
      "Starting Nmap 7.92 ( https://nmap.org )",
      "Scanning 192.168.1.1 [1000 ports]",
      "Discovered open port 22/tcp on 192.168.1.1",
      "Discovered open port 80/tcp on 192.168.1.1",
      "Discovered open port 443/tcp on 192.168.1.1",
      "...",
      "Service detection performed.",
    ],
  },
  {
    command: "tail -f /var/log/auth.log",
    output: [
      "Sep 10 08:23:45 server sshd[1234]: Failed password for root from 203.0.113.1 port 43210 ssh2",
      "Sep 10 08:23:47 server sshd[1235]: Failed password for root from 203.0.113.1 port 43211 ssh2",
      "Sep 10 08:23:48 server sshd[1236]: Successful login for admin from 192.168.1.5 port 51234 ssh2",
    ],
  },
  {
    command: 'sudo wireshark -i eth0 -k -f "port 80"',
    output: [
      "Capturing on eth0",
      "TCP packet detected: 192.168.1.5:43210 -> 203.0.113.1:80",
      "HTTP Request: GET /login.php",
      "HTTP Response: 200 OK",
      "...",
    ],
  },
  {
    command: "cat /etc/passwd | grep -i root",
    output: ["root:x:0:0:root:/root:/bin/bash"],
  },
  {
    command: 'sqlmap -u "https://example.com/page.php?id=1" --dbs',
    output: [
      "sqlmap identified the following injection point(s) with a total of 312 HTTP(s) requests:",
      "Parameter: id (GET)",
      "    Type: boolean-based blind",
      "    Title: AND boolean-based blind - WHERE or HAVING clause",
      "    Payload: id=1 AND 5365=5365",
      "the back-end DBMS is MySQL",
      "available databases [5]:",
      "[*] information_schema",
      "[*] mysql",
      "[*] performance_schema",
      "[*] security",
      "[*] test",
    ],
  },
  {
    command: 'python3 secure.py --encrypt "Confidential Message" --key ABC123',
    output: [
      "[+] Encrypting message...",
      "[+] Using AES-256 encryption",
      "[+] Encryption successful",
      "[+] Output: 4f7GhIoPq2xY0Jlz9A3B+1kfd93JhKw2QmVvT6RnS8=",
    ],
  },
  {
    command: "hashcat -m 1000 -a 0 hash.txt wordlist.txt",
    output: [
      "Session..........: hashcat",
      "Status...........: Running",
      "Hash.Name........: NTLM",
      "Hash.Target......: 31d6cfe0d16ae931b73c59d7e0c089c0",
      "Progress.........: 1228800/14344385 (8.57%)",
      "Speed.#1.........:   985.6 MH/s (8.57ms) @ Accel:1024 Loops:1 Thr:64 Vec:1",
    ],
  },
  {
    command: "docker run -d --name security-scan -p 8080:8080 owasp/zap",
    output: [
      "Pulling image owasp/zap...",
      "Creating container...",
      "Starting OWASP ZAP container",
      "Security scanner available at http://localhost:8080",
    ],
  },
  {
    command: "openssl s_client -connect example.com:443 -tls1_2",
    output: [
      "CONNECTED(00000003)",
      "depth=2 O = Digital Signature Trust Co., CN = DST Root CA X3",
      "verify return:1",
      "depth=1 C = US, O = Let's Encrypt, CN = Let's Encrypt Authority X3",
      "verify return:1",
      "depth=0 CN = example.com",
      "verify return:1",
      "---",
      "Certificate chain",
      " 0 s:CN = example.com",
      "   i:C = US, O = Let's Encrypt, CN = Let's Encrypt Authority X3",
    ],
  },
];

let currentCommandIndex = 0;
let terminalLines = [];
let isTyping = false;
let cursorInterval;
let typingTimeout;

// Initialize Terminal
export function initTerminal() {
  const terminal = document.getElementById("terminal");
  const typingText = document.getElementById("typingText");
  const terminalOutput = document.getElementById("terminalOutput");

  // Start the typing sequence
  typeNextCommand();

  // Blinking cursor effect
  cursorInterval = setInterval(() => {
    typingText.classList.toggle("blink");
  }, 500);
}

// Type command character by character
function typeCommand(command, callback) {
  const typingText = document.getElementById("typingText");
  let i = 0;

  // Clear existing content and prepare for typing
  typingText.textContent = "";
  isTyping = true;

  // Type each character with a random delay
  function typeChar() {
    if (i < command.length) {
      typingText.textContent += command.charAt(i);
      i++;

      // Random typing speed for realism
      const randomDelay = Math.floor(Math.random() * 50) + 50;
      setTimeout(typeChar, randomDelay);
    } else {
      isTyping = false;

      if (callback) {
        // Short pause after typing before executing callback
        setTimeout(callback, 500);
      }
    }
  }

  // Start typing
  typeChar();
}

// Display output for a command
function displayOutput(outputLines) {
  const terminalOutput = document.getElementById("terminalOutput");

  // Create a container for this command's output
  const outputContainer = document.createElement("div");

  // Add each line of output
  outputLines.forEach((line) => {
    const outputLine = document.createElement("div");
    outputLine.className = "output";
    outputLine.textContent = line;
    outputContainer.appendChild(outputLine);
  });

  // Add to terminal
  terminalOutput.appendChild(outputContainer);

  // Auto scroll to bottom
  const terminal = document.getElementById("terminal");
  terminal.scrollTop = terminal.scrollHeight;

  // Add this command to our history
  terminalLines.push({
    command: possibleCommands[currentCommandIndex].command,
    output: outputLines,
  });

  // Move to next command
  currentCommandIndex = (currentCommandIndex + 1) % possibleCommands.length;

  // Schedule next command cycle
  typingTimeout = setTimeout(typeNextCommand, 3000);
}

// Type the next command
function typeNextCommand() {
  // Clear any existing timeouts
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // Select the current command
  const commandObj = possibleCommands[currentCommandIndex];

  // Type it character by character
  typeCommand(commandObj.command, () => {
    // After typing finished, show output
    displayOutput(commandObj.output);
  });
}

// Add a custom command (for use from external scripts)
export function addCustomCommand(command, output) {
  possibleCommands.push({ command, output });
}

// Clear terminal
export function clearTerminal() {
  const terminalOutput = document.getElementById("terminalOutput");
  terminalOutput.innerHTML = "";
  terminalLines = [];
}

// Stop terminal animation
export function stopTerminal() {
  if (cursorInterval) {
    clearInterval(cursorInterval);
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  isTyping = false;
}

// Resume terminal animation
export function resumeTerminal() {
  if (!isTyping) {
    typeNextCommand();
  }
}
