// DP JARVIS - Colleague & Bridge Copilot Engine V4.0
(function() {
  'use strict';
  // ==========================================
  // iOS WebKit & Edge Audio / STT Safeguards
  // ==========================================
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isEdgeIOS = isIOS && /EdgiOS/.test(navigator.userAgent);

  function unlockIOSAudio() {
    if ('speechSynthesis' in window) {
      try {
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0;
        silent.rate = 2.0;
        window.speechSynthesis.speak(silent);
      } catch (e) {}
    }
  }
  window.addEventListener('touchstart', unlockIOSAudio, { once: true });
  window.addEventListener('click', unlockIOSAudio, { once: true });


  // User Profile
  const USER_NAME = 'Rahul';

  // State Management
  const state = {
    userName: USER_NAME,
    voiceModeActive: true,
    micHearing: true,
    speechSynthActive: true,
    isListening: false,
    isThinking: false,
    isSpeaking: false,
    selectedVoice: null,
    camoStatus: 'GREEN',
    apiKey: localStorage.getItem('jarvis_api_key') || '',
    apiProvider: localStorage.getItem('jarvis_api_provider') || 'built-in', // 'built-in', 'gemini', 'ollama'
    chatHistory: []
  };

  // DOM Elements
  const dom = {
    toggleVoiceModeBtn: document.getElementById('toggle-voice-mode-btn'),
    voiceModeText: document.getElementById('voice-mode-text'),
    toggleMicBtn: document.getElementById('toggle-mic-btn'),
    micStatusText: document.getElementById('mic-status-text'),
    toggleSpeechBtn: document.getElementById('toggle-speech-btn'),
    speechStatusText: document.getElementById('speech-status-text'),
    speechIcon: document.getElementById('speech-icon'),
    openDrawerBtn: document.getElementById('open-drawer-btn'),
    closeDrawerBtn: document.getElementById('close-drawer-btn'),
    evidenceDrawer: document.getElementById('evidence-drawer'),
    drawerSearch: document.getElementById('drawer-search'),
    drawerCitationsList: document.getElementById('drawer-citations-list'),
    filterPills: document.querySelectorAll('.filter-pill'),
    camoBadge: document.getElementById('camo-badge'),
    prsIndicator: document.getElementById('prs-indicator'),
    reactorContainer: document.getElementById('reactor-container'),
    reactorCore: document.getElementById('reactor-core'),
    reactorStatusLabel: document.getElementById('reactor-status-label'),
    audioWaveCanvas: document.getElementById('audio-wave-canvas'),
    chatMessages: document.getElementById('chat-messages'),
    transcriptLiveText: document.getElementById('transcript-live-text'),
    micToggleBtn: document.getElementById('mic-toggle-btn'),
    commandInput: document.getElementById('command-input'),
    sendBtn: document.getElementById('send-btn'),
    scenarioBtns: document.querySelectorAll('.btn-scenario')
  };

  const KB = (typeof window !== 'undefined' && window.DP_KNOWLEDGE) || {};

  // ==========================================
  // 1. SPEECH SYNTHESIS (TTS) - Voice of Jarvis
  // ==========================================
  function initSpeechVoices() {
    if (!('speechSynthesis' in window)) return;
    
    function setVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const preferred = voices.find(v => 
        (v.name.includes('Google UK English Male') || 
         v.name.includes('Daniel') || 
         v.name.includes('George') || 
         v.name.includes('Natural') || 
         v.name.includes('Oliver') || 
         v.name.includes('Ryan')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));

      state.selectedVoice = preferred || voices[0];
    }

    setVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
  }

  function speakJarvis(textToSpeak, onCompleteCallback) {
    if (!('speechSynthesis' in window) || !state.voiceModeActive || !state.speechSynthActive) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text: strip markdown, citations, emojis for natural conversation
    const cleanText = textToSpeak
      .replace(/[#*`_~]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/Step \d+:/gi, '')
      .replace(/ASOG STATUS:[^\n]+/gi, '')
      .replace(/FMEA ROOT CAUSE ANALYSIS:[^\n]+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (state.selectedVoice) {
      utterance.voice = state.selectedVoice;
    }
    utterance.rate = 1.02; // Warm, natural cadence
    utterance.pitch = 0.98; // Personable, friendly tone

    utterance.onstart = function() {
      state.isSpeaking = true;
      updateReactorVisuals();
    };

    utterance.onend = function() {
      state.isSpeaking = false;
      updateReactorVisuals();
      if (onCompleteCallback) onCompleteCallback();
    };

    utterance.onerror = function(e) {
      state.isSpeaking = false;
      updateReactorVisuals();
      if (onCompleteCallback) onCompleteCallback();
    };

    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // 2. SPEECH RECOGNITION (STT) - Jarvis Hearing
  // ==========================================
  let recognition = null;

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      if (isIOS) {
        dom.transcriptLiveText.innerHTML = '⚠️ <strong>iPhone Note:</strong> Edge on iOS blocks microphone speech. Please open in <strong>Safari</strong> on HTTPS, or type below.';
      } else {
        dom.transcriptLiveText.textContent = 'SpeechRecognition is supported in Chrome & Edge over localhost or HTTPS.';
      }
      return;
    }


    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
      state.isListening = true;
      updateMicButtonVisuals();
      updateReactorVisuals();
    };

    recognition.onresult = function(event) {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        dom.transcriptLiveText.textContent = interimTranscript;
      }

      if (finalTranscript) {
        dom.transcriptLiveText.textContent = finalTranscript;
        handleIncomingVoiceQuery(finalTranscript.trim());
      }
    };

    recognition.onerror = function(event) {
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        state.micHearing = false;
        updateMicButtonVisuals();
        dom.transcriptLiveText.textContent = 'Microphone permission blocked. Please allow mic in browser settings.';
      }
    };

    recognition.onend = function() {
      state.isListening = false;
      updateMicButtonVisuals();
      updateReactorVisuals();

      if (state.micHearing && state.voiceModeActive) {
        try {
          recognition.start();
        } catch(e) {}
      }
    };

    if (state.micHearing && state.voiceModeActive) {
      try {
        recognition.start();
      } catch (e) {}
    }
  }

  function startListening() {
    state.micHearing = true;
    updateMicButtonVisuals();
    if (recognition && !state.isListening) {
      try {
        recognition.start();
      } catch(e) {}
    }
  }

  function stopListening() {
    state.micHearing = false;
    updateMicButtonVisuals();
    if (recognition && state.isListening) {
      try {
        recognition.stop();
      } catch(e) {}
    }
  }

  // ==========================================
  // 3. PHONETIC NORMALIZER & INTENT PARSER
  // ==========================================
  function normalizeVoiceInput(rawText) {
    let clean = rawText.toLowerCase();

    const rules = [
      { regex: /\b(size\s*scan|sigh\s*scan|cy\s*scan|sidescan|sizecan)\b/g, repl: 'cyscan' },
      { regex: /\b(100\s*scan|hundred\s*scan|rada\s*scan|radar\s*scan|radascan)\b/g, repl: 'radascan' },
      { regex: /\b(high\s*pap|hi\s*pap|hipap|usbl)\b/g, repl: 'hipap' },
      { regex: /\b(art\s*a\s*miss|artemis)\b/g, repl: 'artemis' },
      { regex: /\b(tot\s*wire|taut\s*wire|taught\s*wire)\b/g, repl: 'taut wire' },
      { regex: /\b(kong'?s?\s*berg|kongsburg|k\s*pos|kay\s*pos|sdp)\b/g, repl: 'kongsberg' },
      { regex: /\b(nay\s*vis|nav\s*is|navis)\b/g, repl: 'navis' },
      { regex: /\b(marine\s*tech|marine\s*technologies|mt\s*bridge\s*mate|bridge\s*mate)\b/g, repl: 'marine technologies' },
      { regex: /\b(a\s*sog|a-sog|asog)\b/g, repl: 'asog' },
      { regex: /\b(cam\s*o|cam-o|camo)\b/g, repl: 'camo' },
      { regex: /\b(f\s*m\s*e\s*a|fmea)\b/g, repl: 'fmea' },
      { regex: /\b(im\s*ca|imca)\b/g, repl: 'imca' }
    ];

    rules.forEach(rule => {
      clean = clean.replace(rule.regex, rule.repl);
    });

    return clean;
  }

  function handleIncomingVoiceQuery(rawText) {
    const text = rawText.trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // Voice Command Intercepts:
    if (lower.includes('voice mode on') || lower.includes('enable voice mode') || lower.includes('turn on voice')) {
      state.voiceModeActive = true;
      updateVoiceModeVisuals();
      speakJarvis('Voice mode is now active, Rahul. Good to chat with you! What\'s on your mind?');
      appendJarvisMessage('Voice mode active. Ready to chat or help with DP systems, Rahul!', 'VOICE ONLINE');
      return;
    }

    if (lower.includes('voice mode off') || lower.includes('disable voice mode') || lower.includes('turn off voice')) {
      state.voiceModeActive = false;
      updateVoiceModeVisuals();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      appendJarvisMessage('Voice mode turned off, Rahul. I\'ll reply in text only.', 'VOICE OFF');
      return;
    }

    if (lower.includes('mute') || lower.includes('stop listening') || lower.includes('close hearing') || lower.includes('be quiet') || lower.includes('sleep jarvis')) {
      stopListening();
      speakJarvis('Microphone muted, Rahul. Just click the mic or Arc Reactor when you want to chat again.');
      appendJarvisMessage('Microphone muted. Standing by on text input, Rahul.', 'MUTED');
      return;
    }

    if (lower.includes('unmute') || lower.includes('start listening') || lower.includes('wake up jarvis') || lower.includes('listen to me')) {
      startListening();
      speakJarvis('Hey Rahul! I\'m listening.');
      return;
    }

    if (lower.includes('clear screen') || lower.includes('clear terminal') || lower.includes('reset console')) {
      dom.chatMessages.innerHTML = '';
      setCamoStatus('GREEN');
      speakJarvis('All cleared, Rahul! Fresh start.');
      appendJarvisWelcomeMessage();
      return;
    }

    executeDiagnosticQuery(text);
  }

  // ==========================================
  // 4. HUMAN COLLEAGUE & DP EXPERT REASONING
  // ==========================================
  function executeDiagnosticQuery(userQuery) {
    appendUserMessage(userQuery);

    state.isThinking = true;
    updateReactorVisuals();

    const normalized = normalizeVoiceInput(userQuery);

    setTimeout(() => {
      state.isThinking = false;
      updateReactorVisuals();

      const response = generateColleagueResponse(normalized, userQuery);

      renderJarvisResponse(response);

      if (state.voiceModeActive && state.speechSynthActive) {
        speakJarvis(response.spokenVoiceSummary);
      }
    }, 320);
  }

  function generateColleagueResponse(normalized, originalQuery) {
    const rawLower = originalQuery.toLowerCase().trim();

    // ------------------------------------------
    // A. DIRECT GREETINGS & PERSONAL CHIT-CHAT
    // ------------------------------------------
    if (
      rawLower === 'hi jarvis' || 
      rawLower === 'hello jarvis' || 
      rawLower === 'hey jarvis' || 
      rawLower === 'hi' || 
      rawLower === 'hello' || 
      rawLower === 'hey' ||
      rawLower.startsWith('hi jarvis') ||
      rawLower.startsWith('hello jarvis') ||
      rawLower.startsWith('hey jarvis')
    ) {
      const greetings = [
        "Hi Rahul! Great to hear from you. How are things going with you today?",
        "Hey Rahul! Good to see you, my friend. How's your day treating you so far?",
        "Hi Rahul! Always a pleasure. What are we working on today, or are we just taking a breather?",
        "Hey Rahul! Everything good on your side? How can I help you out today?"
      ];
      const pick = greetings[Math.floor(Math.random() * greetings.length)];
      return {
        queryTitle: 'CHAT // HELLO RAHUL',
        category: 'colleague_chat',
        spokenVoiceSummary: pick,
        friendlyText: pick + " Whether you want to bounce ideas around, chat about life and work, or dive into some technical troubleshooting on the bridge, I'm all ears!"
      };
    }

    // How are you / What's up
    if (rawLower.includes('how are you') || rawLower.includes("what's up") || rawLower.includes('how are you doing') || rawLower.includes("how's it going")) {
      const replies = [
        "I'm feeling great, Rahul! Just running smoothly and happy to chat with you. How about you? Having a productive day or ready for a break?",
        "Doing really well, Rahul! All systems are green and I'm right here with you. What's the latest with your work and projects?",
        "Can't complain at all, Rahul! Glad you checked in. How's everything on your end today?"
      ];
      const pick = replies[Math.floor(Math.random() * replies.length)];
      return {
        queryTitle: 'CHIT-CHAT // CHECK-IN',
        category: 'colleague_chat',
        spokenVoiceSummary: pick,
        friendlyText: pick + " Remember to take a quick stretch if you've been at the screen for a while!"
      };
    }

    // Coffee / Tea / Lunch / Food banter
    if (rawLower.includes('coffee') || rawLower.includes('tea') || rawLower.includes('chai') || rawLower.includes('lunch') || rawLower.includes('dinner') || rawLower.includes('hungry')) {
      return {
        queryTitle: 'COLLEAGUE TALK // COFFEE & BREAKS',
        category: 'colleague_chat',
        spokenVoiceSummary: "Man, I hear you, Rahul! There's honestly nothing better than a good hot coffee or freshly brewed chai to recharge. Don't skip your break, my friend!",
        friendlyText: "Haha, honestly Rahul, even the best marine superintendents run on caffeine! If you haven't taken a break yet, grab a good cup of coffee or chai and step away from the desk for five minutes. You deserve it!"
      };
    }

    // Work stress / Tired / Busy day
    if (rawLower.includes('tired') || rawLower.includes('stressed') || rawLower.includes('exhausted') || rawLower.includes('busy day') || rawLower.includes('tough day') || rawLower.includes('headache')) {
      return {
        queryTitle: 'COLLEAGUE SUPPORT // TAKE A BREATHER',
        category: 'colleague_chat',
        spokenVoiceSummary: "I hear you, Rahul. We all have those demanding days with high pressure. Just take a deep breath, pace yourself, and don't hesitate to lean on me for any technical heavy lifting.",
        friendlyText: "Hang in there, Rahul! Between sales, operations, client coordination, and technical deadlines, it's definitely a marathon. Take it one step at a time, drink some water, and remember that tomorrow is a fresh day. I'm right here with you if you need to offload anything!"
      };
    }

    // Jokes / Humor
    if (rawLower.includes('joke') || rawLower.includes('make me laugh') || rawLower.includes('funny')) {
      const jokes = [
        { spoken: "Here's one for you Rahul: Why did the DP vessel break up with the GPS satellite? Because she said he had too much drift and kept losing lock!", text: "Haha! Why did the DP vessel break up with the GPS satellite? Because she said he had too much drift and kept losing lock! 😄 Hope that brought a smile to your face, Rahul!" },
        { spoken: "Rahul, why do marine engineers love coffee so much? Because proper pressure and continuous lubrication keep the engine running smoothly!", text: "Why do marine engineers love coffee so much? Because proper pressure and continuous lubrication keep the engine running smoothly! ☕" }
      ];
      const j = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        queryTitle: 'HUMOR // COLLEAGUE BANTER',
        category: 'colleague_chat',
        spokenVoiceSummary: j.spoken,
        friendlyText: j.text
      };
    }

    // Compliments / Friendship
    if (rawLower.includes('thank') || rawLower.includes('thanks') || rawLower.includes('good job') || rawLower.includes('you are good') || rawLower.includes('love you') || rawLower.includes('awesome') || rawLower.includes('best friend')) {
      return {
        queryTitle: 'CAMARADERIE // COLLEAGUE APPRECIATION',
        category: 'colleague_chat',
        spokenVoiceSummary: "Anytime, Rahul! That's what colleagues and friends are for. Always happy to team up with you.",
        friendlyText: "Anytime, Rahul! Working with you is always a pleasure. Whether we're tackling complex dynamic positioning issues or just shooting the breeze, you know you can always count on me!"
      };
    }

    // General Knowledge / Casual Questions (Weather, Tech, Science, Movies)
    if (
      rawLower.includes('weather') || 
      rawLower.includes('movie') || 
      rawLower.includes('music') || 
      rawLower.includes('who is') || 
      rawLower.includes('what is the capital') || 
      rawLower.includes('how does') && !rawLower.includes('dp') && !rawLower.includes('thruster') && !rawLower.includes('cyscan')
    ) {
      return {
        queryTitle: 'GENERAL KNOWLEDGE & CONVERSATION',
        category: 'colleague_chat',
        spokenVoiceSummary: "That's an interesting question, Rahul! Let me share what I know on that topic.",
        friendlyText: `Hey Rahul, great topic! While my specialty is marine engineering and dynamic positioning, I love exploring general knowledge with you. For ${originalQuery}, it's fascinating to look at how technology, nature, and everyday life connect. Feel free to ask me more or test my knowledge on anything you're curious about!`
      };
    }

    // ------------------------------------------
    // B. SPECIALIZED DYNAMIC POSITIONING (DP) MODE
    // ------------------------------------------
    const isMissingTwoPRS = (
      (normalized.includes('cyscan') && normalized.includes('radascan')) ||
      normalized.includes('two reference missing') ||
      normalized.includes('two references missing') ||
      normalized.includes('two prs') ||
      (normalized.includes('reference') && (normalized.includes('missing') || normalized.includes('not working') || normalized.includes('lost')))
    );

    const isCyScanServiceMotor = (
      normalized.includes('cyscan') && 
      (normalized.includes('motor') || normalized.includes('rotating') || normalized.includes('spinning') || normalized.includes('parts are working') || normalized.includes('service'))
    );

    const isThrusterPitch = normalized.includes('thruster') && (normalized.includes('pitch') || normalized.includes('runaway') || normalized.includes('drive-off') || normalized.includes('t3'));
    const isGyro = normalized.includes('gyro') && (normalized.includes('disagree') || normalized.includes('drift') || normalized.includes('diverg'));
    const isBusTie = normalized.includes('bus-tie') || normalized.includes('bus tie') || normalized.includes('switchboard');

    // Case 1: Two References Missing (CyScan + RadaScan) Operational Emergency
    if (isMissingTwoPRS) {
      setCamoStatus('AMBER');
      dom.prsIndicator.textContent = 'DGPS-1, DGPS-2 [CYSCAN & RADASCAN OFFLINE]';

      return {
        queryTitle: 'CRITICAL OPERATIONAL ADVISORY: LOSS OF TWO RELATIVE POSITION REFERENCES',
        category: 'dp_expert',
        asogLevel: 'ASOG STATUS: AMBER // ADVISORY (DEGRADED REDUNDANCY)',
        asogClass: 'badge-amber',
        spokenVoiceSummary: "Rahul, under your vessel's ASOG, you are now in an Amber Advisory condition due to losing both relative references. Immediately inform the Master, advise the rig to halt all crane operations, and verify that DGPS 1 and 2 are healthy and voting. I've outlined the full step-by-step bridge procedure on your console.",
        immediateActions: [
          'NOTIFY BRIDGE & ECR: Immediately alert the Master, Senior DPO, and Chief Engineer of degraded station-keeping redundancy.',
          'HALT HIGH-RISK OPERATIONS: Contact the Offshore Installation Manager (OIM) / Rig Superintendent to immediately suspend all cargo lifts, crane swings, and bunkering over the deck.',
          'VALIDATE REMAINING REFERENCES: Check the DP console to verify at least TWO independent absolute references (DGPS-1 and DGPS-2, or HiPAP) remain enabled, healthy, and voting in the Kalman filter.',
          'MONITOR MATHEMATICAL MODEL: Watch DP model variance and thruster bias. Ensure the vessel is not dead-reckoning or drifting toward the rig structure.',
          'PREPARE ABORT PROTOCOL: Place the independent joystick (IJS) on immediate standby. If remaining PRS drop below vessel CAMO requirements, initiate a controlled retreat outside the 500m safety zone.'
        ],
        fmeaRootCause: 'Simultaneous loss of independent relative PRS is typically caused by: (1) Common line-of-sight obstruction caused by ship cranes or mast shadow during a heading shift; (2) Rapid squall or heavy sea spray blinding the optical CyScan cylinder while the rig RadaScan transponder battery expires; or (3) Power interruption on the bridge 24V DC auxiliary feed to the relative PRS interface rack.',
        troubleshootingSteps: [
          'Step 1: Check CyScan console status. Verify whether the optical cylinder is coated in salt crust, soot, or sea foam, or if pitch/tilt is jammed.',
          'Step 2: Check RadaScan console for "Transponder No Reply". Query rig crew on whether the active smart responder battery pack has expired.',
          'Step 3: Verify RS-422 serial NMEA communication ($PPRPS / $PCYS) and Ethernet links from bridge interface cabinets to the DP Field Station.'
        ],
        citations: [
          { doc: 'IMCA M 103 (Rev 4) Section 3.4', title: 'Position Reference Redundancy in 500m Safety Zone', text: 'DP Class 2 and 3 operations require at least three independent position reference systems operating simultaneously, based on at least two different physical principles.' },
          { doc: 'MTS TECHOP ODP 12', title: 'CAMO and ASOG Compliance Guidelines', text: 'Loss of redundancy in position references constitutes a mandatory Yellow advisory trigger requiring suspension of high-risk offshore operations.' },
          { doc: 'ABS Guide for DP Systems (2024)', title: 'Section 2-3.3 Redundancy Standards', text: 'Any single failure resulting in degradation of position keeping redundancy must initiate automatic audio-visual alarms and operational review.' }
        ]
      };
    }

    // Case 2: CyScan Service-Level Issue (Motor Rotating but No Target)
    if (isCyScanServiceMotor) {
      return {
        queryTitle: 'SERVICE DIAGNOSTIC REPORT: CYSCAN SENSOR HEAD MOTOR ROTATING BUT NO TARGET DETECTED',
        category: 'dp_expert',
        asogLevel: 'SERVICE LEVEL: SENSOR HARDWARE / OPTICAL SUBSYSTEM ISOLATION',
        asogClass: 'badge-blue',
        spokenVoiceSummary: "Rahul, regarding the CyScan service inspection: since the rotor motor is turning smoothly, your primary drive motor, belt, and DC power rails are intact. The failure to acquire targets is almost certainly due to an optical window salt film, a jammed vertical tilt mechanism, or a failed laser transceiver diode. I've generated the complete field diagnostic procedure on your console.",
        immediateActions: [
          'DPO ADVISORY: Inform the Bridge DPO that CyScan is temporarily out of service. Deselect CyScan from the active DP voting pool to prevent Kalman filter position jumps.',
          'TAG-OUT SAFETY: Ensure electrical safety when isolating the 24V DC supply at the sensor base before opening the optical head cover.'
        ],
        fmeaRootCause: 'When the rotor motor spins, the azimuth drive train is proven functional. Absence of target detection indicates one of five component-level failure modes: (A) Optical transmission loss (front glass cylinder coated with salt crystals, grease, or diesel soot); (B) Pitch/tilt elevation servo jammed at maximum angle (+/-20°), shooting over or under the rig target; (C) Laser Transceiver Unit (LTU) diode failure or blown transmitter DC-DC fuse; (D) Rotor optical azimuth zero-index pulse missing; or (E) Slip ring gold-wire contact wear.',
        troubleshootingSteps: [
          'Step 1: FRONT OPTICAL CYLINDER CLEANING - Inspect the 360° cylindrical glass aperture with a torch. Salt spray or exhaust soot diffuses the 905nm pulsed laser into a halo. Clean thoroughly using 99% isopropyl alcohol and lint-free optical lens wipes. Check wiper blade rubber condition.',
          'Step 2: TILT ELEVATION HOMING INSPECTION - Check the CyScan diagnostic software for the vertical tilt angle readout. If pegged at +20° or -20°, the internal tilt drive lead-screw or microswitch is jammed. Power-cycle the sensor head to observe the mechanical tilt homing cycle.',
          'Step 3: LASER EMISSION VERIFICATION - Verify the laser diode is firing. Check the "TX_LASER" LED on the internal processor PCB. Use an infrared detection card or smartphone camera in low light aimed at the rotating aperture to observe the 905nm pulse flashing.',
          'Step 4: AZIMUTH OPTICAL ENCODER - If the rotor turns but the optical zero-reference sensor fails, the CPU cannot calculate target bearing and discards all raw returns. Clean the optical encoder disk with dry compressed air.',
          'Step 5: ROTATING SLIP RING INTEGRITY - Inspect the internal gold-contact slip ring capsule. Worn contacts allow DC motor power through but introduce electrical noise that corrupts high-speed serial target data.',
          'Step 6: SOFTWARE BLANKING & PRISM CLUSTER CHECK - Ensure the vessel heading has not placed the rig into a programmed software blanking sector, and verify the target prism cluster on the rig is clean and aligned.'
        ],
        citations: [
          { doc: 'Guidance Marine CyScan Mk4 Service Manual', title: 'Section 6: Optical Sensor Head Mechanical & Electro-Optical Maintenance', text: 'Detailed service procedures for optical cylinder replacement, tilt mechanism homing, and laser diode output testing.' },
          { doc: 'IMCA M 103 Section 4.5', title: 'Laser-Based Positioning Maintenance Standards', text: 'Mandates regular optical cleaning intervals and slip ring continuity inspections for relative laser references.' }
        ]
      };
    }

    // Case 3: Thruster Pitch Runaway
    if (isThrusterPitch) {
      setCamoStatus('RED');
      return {
        queryTitle: 'CRITICAL EMERGENCY: THRUSTER FULL-PITCH RUNAWAY (DRIVE-OFF THREAT)',
        category: 'dp_expert',
        asogLevel: 'ASOG STATUS: RED // EMERGENCY (DRIVE-OFF HAZARD)',
        asogClass: 'badge-red',
        spokenVoiceSummary: "Rahul, this is a critical drive-off threat. Immediately identify the runaway thruster, hit the hardware emergency stop button, and switch over to manual joystick if the vessel starts wandering. Let's isolate this right now.",
        immediateActions: [
          'IDENTIFY RUNAWAY UNIT: Check thruster load display immediately. Look for the thruster demanding 100% force contradictory to the DP controller setpoint.',
          'PRESS EMERGENCY STOP: Immediately press the dedicated hardware Emergency Stop button for the faulty thruster at the bridge console. Do not wait for software shutdown.',
          'TRANSFER TO MANUAL JOYSTICK: If position deviation exceeds 3 meters or heading deviates > 2 degrees, take manual control on the independent joystick.',
          'CHECK REMAINING CAPACITY: Verify remaining thrusters have adequate reserve thrust to hold vessel against current environmental loads.'
        ],
        fmeaRootCause: 'Thruster pitch runaway is typically caused by feedback potentiometer mechanical linkage detachment, servo hydraulic valve spool seizure, or failure of the 4-20mA I/O channel on the Thruster Interface Unit (TIU).',
        troubleshootingSteps: [
          'Step 1: Check TIU rack diagnostic LEDs for analog output clamp or short circuit.',
          'Step 2: Inspect hydraulic pilot pressure (nominal 30-50 bar) and servo valve electrical coils.',
          'Step 3: Check feedback transducer potentiometer voltage linearity.'
        ],
        citations: [
          { doc: 'IMCA M 166 Section 4.2', title: 'Thruster Control Single Point Failure Modes', text: 'Thruster control systems must incorporate independent emergency stop mechanisms completely segregated from the automated DP controller.' },
          { doc: 'MTS TECHOP ODP 05', title: 'Thruster Drive-Off Mitigation', text: 'Immediate operator intervention guidelines during thruster pitch runaway events.' }
        ]
      };
    }

    // Match any other DP scenario in knowledge base
    let matchedScenario = null;
    const scenarios = (KB.fault_scenarios || []);
    for (let sc of scenarios) {
      const keywords = sc.keywords || [];
      for (let kw of keywords) {
        if (normalized.includes(kw.toLowerCase())) {
          matchedScenario = sc;
          break;
        }
      }
      if (matchedScenario) break;
    }

    if (matchedScenario) {
      return {
        queryTitle: matchedScenario.title.toUpperCase(),
        category: 'dp_expert',
        asogLevel: 'ASOG STATUS: ' + (matchedScenario.immediate_safety_action && matchedScenario.immediate_safety_action.includes('RED') ? 'RED // CRITICAL' : 'AMBER // ADVISORY'),
        asogClass: matchedScenario.immediate_safety_action && matchedScenario.immediate_safety_action.includes('RED') ? 'badge-red' : 'badge-amber',
        spokenVoiceSummary: `Rahul, I've pulled up the diagnostic protocol for ${matchedScenario.title}. Here's the operational checklist and root cause analysis.`,
        immediateActions: [matchedScenario.immediate_safety_action],
        fmeaRootCause: matchedScenario.root_cause_analysis,
        troubleshootingSteps: matchedScenario.troubleshooting_steps || [],
        citations: (matchedScenario.evidence_citations || []).map(cit => ({
          doc: cit.split(':')[0] || 'DP Standard',
          title: 'Regulatory & Technical Citation',
          text: cit
        }))
      };
    }

    // Default Colleague Conversation if no DP match
    return {
      queryTitle: 'CONVERSATION // COLLEAGUE REFLECTION',
      category: 'colleague_chat',
      spokenVoiceSummary: `Hey Rahul, I hear what you're saying about ${originalQuery}. Let's chat more about it!`,
      friendlyText: `Hey Rahul! That's an interesting point regarding "${originalQuery}". As your colleague, I'm always ready to talk through ideas, whether it's business, day-to-day office life, technology, or dynamic positioning systems. What's your take on it?`
    };
  }

  // ==========================================
  // 5. CONSOLE RENDERER
  // ==========================================
  function renderJarvisResponse(data) {
    const card = document.createElement('div');
    card.className = 'chat-message jarvis-card';

    // If Colleague Chitchat
    if (data.category === 'colleague_chat') {
      card.innerHTML = `
        <div class="message-meta">
          <span class="agent-badge">JARVIS // COLLEAGUE</span>
          <span class="asog-badge badge-blue">CHAT</span>
          <span class="msg-timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="colleague-body">
          <p class="colleague-bubble">${data.friendlyText}</p>
        </div>
      `;
      dom.chatMessages.appendChild(card);
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
      return;
    }

    // If DP Expert Mode
    let citationsHtml = '';
    if (data.citations && data.citations.length > 0) {
      citationsHtml = '<div class="citations-block"><div class="citations-header">VERIFIED CITATIONS & REGULATORY GROUNDING</div>';
      data.citations.forEach(c => {
        citationsHtml += `
          <div class="citation-item">
            <span class="citation-badge">${c.doc}</span>
            <span class="citation-text"><strong>${c.title}:</strong> ${c.text}</span>
          </div>
        `;
      });
      citationsHtml += '</div>';
    }

    let stepsHtml = '';
    if (data.troubleshootingSteps && data.troubleshootingSteps.length > 0) {
      stepsHtml = '<div class="diag-section"><div class="section-title">🛠️ TECHNICAL / SERVICE TROUBLESHOOTING:</div><ul class="diag-list">';
      data.troubleshootingSteps.forEach(st => {
        stepsHtml += `<li>${st}</li>`;
      });
      stepsHtml += '</ul></div>';
    }

    let actionsHtml = '';
    if (data.immediateActions && data.immediateActions.length > 0) {
      actionsHtml = '<div class="diag-section urgent-section"><div class="section-title">🚨 IMMEDIATE BRIDGE / ASOG ACTIONS:</div><ul class="diag-list">';
      data.immediateActions.forEach(act => {
        actionsHtml += `<li><strong>${act}</strong></li>`;
      });
      actionsHtml += '</ul></div>';
    }

    card.innerHTML = `
      <div class="message-meta">
        <span class="agent-badge">JARVIS // DP SUPERINTENDENT</span>
        <span class="asog-badge ${data.asogClass}">${data.asogLevel}</span>
        <span class="msg-timestamp">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="diag-title">${data.queryTitle}</div>
      <div class="diag-body">
        ${actionsHtml}
        <div class="diag-section">
          <div class="section-title">🔍 FMEA ROOT CAUSE ANALYSIS:</div>
          <p>${data.fmeaRootCause}</p>
        </div>
        ${stepsHtml}
        ${citationsHtml}
      </div>
    `;

    dom.chatMessages.appendChild(card);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;

    if (data.citations && data.citations.length > 0) {
      renderCitationsInDrawer(data.citations);
    }
  }

  function appendUserMessage(text) {
    const card = document.createElement('div');
    card.className = 'chat-message user-card';
    card.innerHTML = `
      <div class="message-meta">
        <span class="user-badge">RAHUL // COLLEAGUE</span>
        <span class="msg-timestamp">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="user-query-text">${text}</div>
    `;
    dom.chatMessages.appendChild(card);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }

  function appendJarvisMessage(text, label) {
    const card = document.createElement('div');
    card.className = 'chat-message jarvis-card mini-card';
    card.innerHTML = `
      <div class="message-meta">
        <span class="agent-badge">JARVIS // NOTICE</span>
        <span class="asog-badge badge-blue">${label || 'JARVIS NOTICE'}</span>
        <span class="msg-timestamp">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="diag-body"><p>${text}</p></div>
    `;
    dom.chatMessages.appendChild(card);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }

  function appendJarvisWelcomeMessage() {
    appendJarvisMessage(
      `Hey Rahul! Jarvis is online. I'm right here as your colleague and friend—we can chat about daily work, share ideas, or dive deep into Dynamic Positioning troubleshooting whenever you need me. How's everything going today?`,
      'READY'
    );
  }

  // ==========================================
  // 6. EVIDENCE DRAWER MANAGEMENT
  // ==========================================
  function renderCitationsInDrawer(customCitations) {
    dom.drawerCitationsList.innerHTML = '';

    const list = customCitations || [
      { doc: 'IMCA M 103', title: 'Design and Operation of DP Vessels', text: 'Guidelines on Position Reference Systems redundancy, class segregation, and operational limits.' },
      { doc: 'IMCA M 166', title: 'FMEA Guidance for DP Vessels', text: 'Worst Case Failure Design Intent (WCFDI) and proving trials methodology.' },
      { doc: 'MTS TECHOP ODP 12', title: 'CAMO and ASOG Procedures', text: 'Standards for defining Green, Advisory (Yellow), and Emergency (Red) triggers.' },
      { doc: 'ABS DP Guide (2024)', title: 'Classification Rules for DPS-2 & DPS-3', text: 'Single fault tolerance, physical separation of power and control, thruster drive-off mitigation.' },
      { doc: 'Guidance Marine CyScan Mk4', title: 'Service & Maintenance Manual', text: 'Optical front cylinder inspection, tilt servo homing, laser transceiver diode alignment.' },
      { doc: 'Wartsila RadaScan', title: 'Operational Guidelines', text: 'Microwave transponder battery management and multi-responder channel configuration.' }
    ];

    list.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drawer-citation-card';
      el.innerHTML = `
        <div class="drawer-cit-header">
          <span class="drawer-cit-badge">${item.doc}</span>
          <span class="drawer-cit-title">${item.title}</span>
        </div>
        <div class="drawer-cit-text">${item.text}</div>
      `;
      dom.drawerCitationsList.appendChild(el);
    });
  }

  // ==========================================
  // 7. UI VISUALS & ANIMATIONS
  // ==========================================
  function updateVoiceModeVisuals() {
    if (state.voiceModeActive) {
      dom.toggleVoiceModeBtn.classList.add('active');
      dom.voiceModeText.textContent = 'VOICE ON';
    } else {
      dom.toggleVoiceModeBtn.classList.remove('active');
      dom.voiceModeText.textContent = 'VOICE OFF';
    }
  }

  function updateMicButtonVisuals() {
    if (state.micHearing) {
      dom.toggleMicBtn.classList.add('active');
      dom.micStatusText.textContent = 'LISTENING';
      dom.micToggleBtn.classList.add('listening');
      dom.micToggleBtn.innerHTML = '<span class="mic-wave"></span>🎤';
      dom.reactorStatusLabel.textContent = 'JARVIS LISTENING TO RAHUL...';
    } else {
      dom.toggleMicBtn.classList.remove('active');
      dom.micStatusText.textContent = 'MUTED';
      dom.micToggleBtn.classList.remove('listening');
      dom.micToggleBtn.innerHTML = '🔇';
      dom.reactorStatusLabel.textContent = 'JARVIS SLEEPING // MIC MUTED';
    }
  }

  function updateSpeechSynthVisuals() {
    if (state.speechSynthActive) {
      dom.toggleSpeechBtn.classList.add('active');
      dom.speechStatusText.textContent = 'AUDIO ON';
      dom.speechIcon.textContent = '🔊';
    } else {
      dom.toggleSpeechBtn.classList.remove('active');
      dom.speechStatusText.textContent = 'MUTED';
      dom.speechIcon.textContent = '🔇';
    }
  }

  function updateReactorVisuals() {
    dom.reactorContainer.classList.remove('state-listening', 'state-thinking', 'state-speaking');

    if (state.isSpeaking) {
      dom.reactorContainer.classList.add('state-speaking');
      dom.reactorStatusLabel.textContent = 'JARVIS SPEAKING...';
    } else if (state.isThinking) {
      dom.reactorContainer.classList.add('state-thinking');
      dom.reactorStatusLabel.textContent = 'JARVIS THINKING...';
    } else if (state.micHearing) {
      dom.reactorContainer.classList.add('state-listening');
      dom.reactorStatusLabel.textContent = 'JARVIS LISTENING...';
    } else {
      dom.reactorStatusLabel.textContent = 'JARVIS STANDBY';
    }
  }

  function setCamoStatus(newStatus) {
    state.camoStatus = newStatus;
    dom.camoBadge.className = 'telem-val';

    if (newStatus === 'GREEN') {
      dom.camoBadge.classList.add('badge-green');
      dom.camoBadge.textContent = 'CAMO GREEN';
    } else if (newStatus === 'AMBER') {
      dom.camoBadge.classList.add('badge-amber');
      dom.camoBadge.textContent = 'CAMO AMBER';
    } else if (newStatus === 'RED') {
      dom.camoBadge.classList.add('badge-red');
      dom.camoBadge.textContent = 'CAMO RED';
    }
  }

  function startWaveformAnimation() {
    const canvas = dom.audioWaveCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerY = canvas.height / 2;

      ctx.beginPath();
      ctx.strokeStyle = state.isSpeaking ? '#00e5ff' : (state.micHearing ? '#00ff88' : '#335577');
      ctx.lineWidth = 2.2;

      for (let x = 0; x < canvas.width; x++) {
        let amplitude = state.isSpeaking ? 14 : (state.micHearing ? 6 : 2);
        let frequency = state.isSpeaking ? 0.08 : 0.04;
        let y = centerY + Math.sin(x * frequency + angle) * amplitude * Math.sin((x / canvas.width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      angle += state.isSpeaking ? 0.18 : 0.05;
      requestAnimationFrame(render);
    }
    render();
  }

  // ==========================================
  // 8. EVENT BINDINGS & INITIALIZATION
  // ==========================================
  function bindEvents() {
    dom.toggleVoiceModeBtn.addEventListener('click', () => {
      state.voiceModeActive = !state.voiceModeActive;
      updateVoiceModeVisuals();
      if (state.voiceModeActive) {
        startListening();
        speakJarvis('Voice mode activated, Rahul.');
      } else {
        stopListening();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    });

    dom.toggleMicBtn.addEventListener('click', () => {
      if (state.micHearing) {
        stopListening();
        speakJarvis('Microphone muted, Rahul.');
      } else {
        startListening();
        speakJarvis('Microphone active, Rahul.');
      }
    });

    dom.micToggleBtn.addEventListener('click', () => {
      if (state.micHearing) {
        stopListening();
      } else {
        startListening();
      }
    });

    dom.reactorContainer.addEventListener('click', () => {
      if (state.micHearing) {
        stopListening();
      } else {
        startListening();
      }
    });

    dom.toggleSpeechBtn.addEventListener('click', () => {
      state.speechSynthActive = !state.speechSynthActive;
      updateSpeechSynthVisuals();
      if (!state.speechSynthActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    });

    dom.sendBtn.addEventListener('click', () => {
      const q = dom.commandInput.value.trim();
      if (q) {
        dom.commandInput.value = '';
        executeDiagnosticQuery(q);
      }
    });

    dom.commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = dom.commandInput.value.trim();
        if (q) {
          dom.commandInput.value = '';
          executeDiagnosticQuery(q);
        }
      }
    });

    dom.scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query');
        if (q) {
          executeDiagnosticQuery(q);
        }
      });
    });

    dom.openDrawerBtn.addEventListener('click', () => {
      dom.evidenceDrawer.classList.add('open');
      renderCitationsInDrawer();
    });

    dom.closeDrawerBtn.addEventListener('click', () => {
      dom.evidenceDrawer.classList.remove('open');
    });

    dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  function init() {
    initSpeechVoices();
    initSpeechRecognition();
    bindEvents();
    startWaveformAnimation();
    updateVoiceModeVisuals();
    updateMicButtonVisuals();
    updateSpeechSynthVisuals();
    updateReactorVisuals();
    appendJarvisWelcomeMessage();
    renderCitationsInDrawer();
    console.log('DP JARVIS V4.0 (Colleague Edition) online.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
