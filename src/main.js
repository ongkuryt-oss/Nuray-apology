import confetti from 'canvas-confetti';

// ==========================================================================
// CUTE SOUND EFFECTS (Web Audio API Synthesizer - No external audio required)
// ==========================================================================
class CuteSoundFX {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('nuray_story_muted') === 'true';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('nuray_story_muted', this.isMuted ? 'true' : 'false');
    return this.isMuted;
  }

  playPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  playSqueak() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  playChimeMelody() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          this.init();
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const now = this.audioCtx.currentTime;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.4);
        } catch {}
      }, idx * 110);
    });
  }

  playWeddingFanfare() {
    if (this.isMuted) return;
    const melody = [587.33, 783.99, 880.00, 987.77, 1174.66]; // D5, G5, A5, B5, D6
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          this.init();
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const now = this.audioCtx.currentTime;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.6);
        } catch {}
      }, idx * 140);
    });
  }
}

const cuteSound = new CuteSoundFX();

// ==========================================================================
// STORY PRESENTATION CONTROLLER
// ==========================================================================
class CuteStoryApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.highestUnlocked = parseInt(localStorage.getItem('nuray_highest_step') || '1', 10);

    this.storyTrack = document.getElementById('storyTrack');
    this.stepPills = document.querySelectorAll('.step-pill');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');

    this.initEvents();
    this.initScreen1Chat();
    this.initScreen2Choice();
    this.initScreen3BurritoGame();
    this.initScreen4ApologyLetter();
    this.initScreen5ProposalAndCanvas();
    this.initScreen6Certificate();

    this.goToScreen(1, false);
    this.updateSoundBtn();
  }

  initEvents() {
    // Sound Button
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const muted = cuteSound.toggle();
        this.updateSoundBtn();
        if (!muted) cuteSound.playPop();
      });
    }

    // Tracker pills
    this.stepPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const step = parseInt(pill.dataset.step, 10);
        if (step <= this.highestUnlocked) {
          this.goToScreen(step);
          cuteSound.playPop();
        }
      });
    });

    // Audio resume on first touch
    window.addEventListener('pointerdown', () => {
      cuteSound.init();
    }, { once: true });
  }

  updateSoundBtn() {
    if (!this.soundIcon) return;
    this.soundIcon.innerHTML = cuteSound.isMuted 
      ? '<i class="fa-solid fa-volume-xmark"></i>' 
      : '<i class="fa-solid fa-volume-high"></i>';
  }

  goToScreen(step, playSound = true) {
    if (step < 1 || step > this.totalSteps) return;
    this.currentStep = step;

    if (step > this.highestUnlocked) {
      this.highestUnlocked = step;
      localStorage.setItem('nuray_highest_step', this.highestUnlocked.toString());
    }

    // Slide transformation
    const offset = (step - 1) * 100;
    if (this.storyTrack) {
      this.storyTrack.style.transform = `translateX(-${offset}vw)`;
    }

    // Update progress pill bar
    this.stepPills.forEach(pill => {
      const s = parseInt(pill.dataset.step, 10);
      pill.classList.remove('active');
      if (s === step) pill.classList.add('active');
    });

    if (playSound) {
      cuteSound.playPop();
    }

    // Per-screen callbacks
    if (step === 5) {
      this.resizeCanvas();
    } else if (step === 6) {
      this.renderCertificate();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }

  // ------------------------------------------------------------------------
  // SCREEN 1: CHAT INTERFACE (Auto-coming sequence & interactive options)
  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------
  // SCREEN 1: INSTAGRAM CHAT INTERFACE (Ongkur apologizing, Nuray user is dry)
  // ------------------------------------------------------------------------
  initScreen1Chat() {
    const btnExplain = document.getElementById('btnExplain');
    const chatStream = document.getElementById('chatStream');
    const chatHeaderStatus = document.getElementById('chatHeaderStatus');
    const typingDots = document.getElementById('typingDotsContainer');
    const typingNameBadge = document.getElementById('typingNameBadge');
    const replySection = document.getElementById('chatReplySection');
    const replyOptionsContainer = document.getElementById('chatReplyOptions');
    const btnRestartChat = document.getElementById('btnRestartChat');

    this.chatTimers = [];

    const clearChatTimers = () => {
      this.chatTimers.forEach(t => clearTimeout(t));
      this.chatTimers = [];
    };

    const scrollChatToBottom = () => {
      if (chatStream) {
        chatStream.scrollTo({
          top: chatStream.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Add Ongkur's pink bubble (from Ongkur to Nuray)
    const addOngkurMessage = (text, hasReaction = false, seenText = '') => {
      if (!chatStream) return;
      const bubble = document.createElement('div');
      bubble.className = 'pink-msg-bubble';
      bubble.textContent = text;

      if (hasReaction) {
        const heartReact = document.createElement('span');
        heartReact.className = 'ig-heart-react';
        heartReact.textContent = '🖤';
        bubble.appendChild(heartReact);
      }

      chatStream.appendChild(bubble);

      if (seenText) {
        const seen = document.createElement('div');
        seen.className = 'ig-seen-text';
        seen.textContent = seenText;
        chatStream.appendChild(seen);
      }

      cuteSound.playPop();
      scrollChatToBottom();
    };

    // Add Nuray's dark charcoal bubble (Nuray being dry)
    const addNurayDryMessage = (text) => {
      if (!chatStream) return;
      const row = document.createElement('div');
      row.className = 'black-msg-bubble-row';

      const avatar = document.createElement('span');
      avatar.className = 'row-mini-avatar';
      avatar.textContent = '💜';

      const bubble = document.createElement('div');
      bubble.className = 'black-msg-bubble';
      bubble.textContent = text;

      row.appendChild(avatar);
      row.appendChild(bubble);
      chatStream.appendChild(row);

      cuteSound.playSqueak();
      scrollChatToBottom();
    };

    const showTyping = (name = "Ongkur") => {
      if (!typingDots) return;
      if (typingNameBadge) typingNameBadge.textContent = `${name} is typing...`;
      if (chatHeaderStatus) chatHeaderStatus.textContent = `${name} is typing...`;
      typingDots.classList.remove('hidden');
      scrollChatToBottom();
    };

    const hideTyping = () => {
      if (!typingDots) return;
      typingDots.classList.add('hidden');
      if (chatHeaderStatus) chatHeaderStatus.textContent = "Active now";
    };

    const runChatSequence = () => {
      clearChatTimers();
      if (chatStream) chatStream.innerHTML = '';
      if (replySection) replySection.classList.add('hidden');
      hideTyping();

      // 1. Ongkur: "won't you text me honey"
      this.chatTimers.push(setTimeout(() => showTyping("Ongkur"), 200));
      this.chatTimers.push(setTimeout(() => {
        hideTyping();
        addOngkurMessage("won't you text me honey");
      }, 900));

      // 2. Nuray (dry): "I'll sleep"
      this.chatTimers.push(setTimeout(() => {
        addNurayDryMessage("I'll sleep");
      }, 1900));

      // 3. Nuray (dry): "Goodnight"
      this.chatTimers.push(setTimeout(() => {
        addNurayDryMessage("Goodnight");
      }, 2600));

      // 4. Ongkur: "but i am waiting for you"
      this.chatTimers.push(setTimeout(() => showTyping("Ongkur"), 3200));
      this.chatTimers.push(setTimeout(() => {
        hideTyping();
        addOngkurMessage("but i am waiting for you 😿");
      }, 4100));

      // 5. Ongkur: "did you already go"
      this.chatTimers.push(setTimeout(() => {
        addOngkurMessage("did you already go");
      }, 5000));

      // 6. Nuray (dry): "Yep"
      this.chatTimers.push(setTimeout(() => {
        addNurayDryMessage("Yep");
      }, 6000));

      // 7. Nuray (dry): "I am going"
      this.chatTimers.push(setTimeout(() => {
        addNurayDryMessage("I am going");
      }, 6800));

      // 8. Nuray (dry): "Goodnight"
      this.chatTimers.push(setTimeout(() => {
        addNurayDryMessage("Goodnight");
      }, 7600));

      // 9. Ongkur: "i love you" (with black heart reaction)
      this.chatTimers.push(setTimeout(() => showTyping("Ongkur"), 8400));
      this.chatTimers.push(setTimeout(() => {
        hideTyping();
        addOngkurMessage("i love you", true, "Seen 31m ago");
      }, 9400));

      // 10. Ongkur: "say it back"
      this.chatTimers.push(setTimeout(() => {
        addOngkurMessage("say it back");
      }, 10500));

      // 11. Ongkur: "pliss"
      this.chatTimers.push(setTimeout(() => {
        addOngkurMessage("pliss 🥺");
        showNurayDryReplyOptions();
      }, 11500));
    };

    const showNurayDryReplyOptions = () => {
      if (!replySection || !replyOptionsContainer) return;

      const dryOptions = [
        "I told you I'm going to sleep. Goodnight. 😴",
        "Hmph... you know I'm still mad at you! 😤",
        "k. You better have a good explanation! 😒"
      ];

      replyOptionsContainer.innerHTML = '';
      dryOptions.forEach(text => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ig-choice-pill';
        btn.innerHTML = `<span>${text}</span><span>➤</span>`;
        btn.addEventListener('click', () => {
          handleNurayChoice(text);
        });
        replyOptionsContainer.appendChild(btn);
      });

      replySection.classList.remove('hidden');
      scrollChatToBottom();
    };

    const handleNurayChoice = (chosenDryText) => {
      if (replySection) replySection.classList.add('hidden');
      addNurayDryMessage(chosenDryText);

      // Ongkur types desperately in response!
      this.chatTimers.push(setTimeout(() => {
        showTyping("Ongkur");
      }, 700));

      this.chatTimers.push(setTimeout(() => {
        hideTyping();
        addOngkurMessage("Wait! Please don't sleep mad at me! 😭 Give your chubby cat 1 minute to explain! Tap below! 🥺💌");
        if (btnExplain) {
          btnExplain.classList.add('pulse-glow');
        }
      }, 2200));
    };

    if (btnExplain) {
      btnExplain.addEventListener('click', () => {
        cuteSound.playPop();
        this.goToScreen(2);
      });
    }

    if (btnRestartChat) {
      btnRestartChat.addEventListener('click', () => {
        cuteSound.playPop();
        runChatSequence();
      });
    }

    // Run the chat sequence
    runChatSequence();
  }

  // ------------------------------------------------------------------------
  // SCREEN 2: VISUAL NOVEL CHOICES
  // ------------------------------------------------------------------------
  initScreen2Choice() {
    const optionCards = document.querySelectorAll('.cute-option-card');
    const speakerPrompt = document.getElementById('vnSpeakerPrompt');
    const choiceFeedback = document.getElementById('choiceFeedback');
    const feedbackReactionText = document.getElementById('feedbackReactionText');
    const choiceCountdown = document.getElementById('choiceCountdown');
    const choiceGrid = document.getElementById('choiceGrid');
    const btnAdvanceToBurrito = document.getElementById('btnAdvanceToBurrito');
    const btnTryAnotherPunishment = document.getElementById('btnTryAnotherPunishment');

    const responses = {
      dance: "*(Ongkur wiggles his chubby tummy frantically, trips over his own tail, and sings an apology ballad in off-pitch meows)* 🐱🕺 MEOWWW~ Did that earn even 1% of your royal forgiveness, my Queen? 🐾",
      wallet: "*(Instantly drops to both paws, thrusting his wallet and golden credit card toward you)* 💳 Take it all! Unlimited salmon sushi, strawberry boba with extra brown sugar, and anything in your wishlist! Your happiness is priceless! 🍣🧋✨",
      always_right: "*(Dropping to tiny knees with big teary cartoon kitten eyes)* 🥺📜 It is hereby written in stone: Rule #1: Nuray is ALWAYS right. Rule #2: If Nuray is ever mistaken, immediately refer back to Rule #1! You win forever! 🤍",
      butler: "*(Salutes respectfully with tiny orange paw)* 👑🐾 Yes, Chef! Heated blankets set to 24°C, snacks peeled and ready, 24/7 foot rubs on standby, and zero backtalk guaranteed for life! At your service, Darling 😈!"
    };

    let countdownTimer = null;

    const clearAutoAdvance = () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    };

    if (btnAdvanceToBurrito) {
      btnAdvanceToBurrito.addEventListener('click', () => {
        clearAutoAdvance();
        cuteSound.playPop();
        this.goToScreen(3);
      });
    }

    if (btnTryAnotherPunishment) {
      btnTryAnotherPunishment.addEventListener('click', () => {
        clearAutoAdvance();
        cuteSound.playPop();
        if (choiceFeedback) choiceFeedback.classList.add('hidden');
        if (choiceGrid) {
          choiceGrid.style.pointerEvents = 'auto';
          choiceGrid.style.opacity = '1';
        }
        if (speakerPrompt) {
          speakerPrompt.textContent = "What other punishment should Ongkur endure, my Queen? 😈";
        }
      });
    }

    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        clearAutoAdvance();
        const choice = card.dataset.choice;
        const reply = responses[choice] || "I love you so much, Darling!";

        cuteSound.playSqueak();

        // Wiggle the video frame slightly
        const videoFrame = document.querySelector('#slide2 .cute-media-frame');
        if (videoFrame) {
          videoFrame.classList.remove('wiggle');
          void videoFrame.offsetWidth;
          videoFrame.classList.add('wiggle');
        }

        if (speakerPrompt) speakerPrompt.textContent = "Ongkur's desperate response:";
        if (feedbackReactionText) feedbackReactionText.textContent = reply;
        if (choiceFeedback) choiceFeedback.classList.remove('hidden');

        if (choiceGrid) {
          choiceGrid.style.pointerEvents = 'none';
          choiceGrid.style.opacity = '0.5';
        }

        let seconds = 4;
        if (choiceCountdown) choiceCountdown.textContent = `Auto-proceeding in ${seconds}s... 💕`;

        countdownTimer = setInterval(() => {
          seconds -= 1;
          if (seconds > 0) {
            if (choiceCountdown) choiceCountdown.textContent = `Auto-proceeding in ${seconds}s... 💕`;
          } else {
            clearAutoAdvance();
            this.goToScreen(3);
            setTimeout(() => {
              if (choiceGrid) {
                choiceGrid.style.pointerEvents = 'auto';
                choiceGrid.style.opacity = '1';
              }
              if (choiceFeedback) choiceFeedback.classList.add('hidden');
              if (speakerPrompt) {
                speakerPrompt.textContent = `"🚨 EMERGENCY SUMMONS! 🚨 Your Royal Highness Nuray... my chubby orange paws are trembling 🥺 What severe punishment must your servant endure to earn back one royal smile?"`;
              }
            }, 800);
          }
        }, 1000);
      });
    });
  }

  // ------------------------------------------------------------------------
  // SCREEN 3: TAP-TO-FORGIVE BURRITO GAME (ULTRA-FUN & INTERACTIVE)
  // ------------------------------------------------------------------------
  initScreen3BurritoGame() {
    this.loveTaps = 0;
    this.targetTaps = 10;
    this.isBurritoWon = false;

    const tapContainer = document.getElementById('tapGameContainer');
    const loveCounter = document.getElementById('loveCounterDisplay');
    const loveFillBar = document.getElementById('loveFillBar');
    const burritoFrame = document.getElementById('burritoFrame');
    const burritoSuccess = document.getElementById('burritoSuccessAlert');
    const tapPromptBadge = document.getElementById('tapPromptBadge');
    const burritoMoodQuote = document.getElementById('burritoMoodQuote');
    const burritoTempLabel = document.getElementById('burritoTempLabel');

    const btnTreatSalmon = document.getElementById('btnTreatSalmon');
    const btnTreatBoba = document.getElementById('btnTreatBoba');
    const btnTreatScratch = document.getElementById('btnTreatScratch');

    const heartIcons = ['💖', '💕', '💗', '💓', '✨', '🐾', '🤍', '🌸', '🍣', '🧋'];

    const cutePerks = [
      "+1 Forehead Kiss! 💋",
      "+1 Chubby Belly Squish! 🐾",
      "+1 Brown Sugar Boba! 🧋",
      "+1 Fresh Salmon Sushi! 🍣",
      "+1 Warm Blanket Tuck! 🛌",
      "+1 Gentle Head Pat! 🤍",
      "+1 Strawberry Shortcake! 🍰",
      "+1 Infinite Devotion! 💖",
      "+1 Sweet Nose Boop! 👃",
      "+1 Purr-fect Cuddle! 🧸"
    ];

    const moodQuotes = [
      "😾 Hmph! Do not disturb. Nuray is asleep and mad!",
      "😾 Hey! Who gave you permission to poke the burrito?! Stop it!",
      "😾 Stop squishing me! I'm still 100% mad at you!",
      "🐱 Mmh... okay that squish was kind of cozy... but STILL MAD!",
      "🐱 Don't look at me with those big orange eyes...",
      "🥺 Wait... did I smell sushi and strawberry boba?!",
      "🥺 Is Ongkur really sorry? Let me think...",
      "😻 *purrrrrr*... Okay, my grumpy blanket shell is cracking...",
      "😻 Almost thawed... you're lucky you're cute!",
      "🥰 ONE MORE SQUISH TO UNWRAP MY SMILE!",
      "🎉✨ BURRITO 100% UNWRAPPED & SMILING! 💕"
    ];

    const updateMoodAndTemp = (taps) => {
      // Update mood quote
      const quoteIndex = Math.min(taps, moodQuotes.length - 1);
      if (burritoMoodQuote) {
        burritoMoodQuote.textContent = `"${moodQuotes[quoteIndex]}"`;
      }

      // Update temperature label
      if (burritoTempLabel) {
        if (taps <= 2) {
          burritoTempLabel.textContent = "❄️ Mood: Ice Cold Pout (-10°C)";
          burritoTempLabel.style.color = "#3b82f6";
        } else if (taps <= 5) {
          burritoTempLabel.textContent = "🌤️ Mood: Wiggling Warmth (18°C)";
          burritoTempLabel.style.color = "#f59e0b";
        } else if (taps <= 8) {
          burritoTempLabel.textContent = "🌸 Mood: Cozy & Blushing (37°C)";
          burritoTempLabel.style.color = "#ec4899";
        } else {
          burritoTempLabel.textContent = "💖 Mood: Pure Melted Love (100°C)";
          burritoTempLabel.style.color = "#ef4444";
        }
      }
    };

    const handleTap = (e, customPerkText = null) => {
      if (this.isBurritoWon) return;

      this.loveTaps++;
      cuteSound.playSqueak();

      // Coordinates
      const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

      // 1. Spawn floating heart / emoji
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

      const dx = (Math.random() - 0.5) * 140;
      const rot = (Math.random() - 0.5) * 60;
      heart.style.setProperty('--dx', `${dx}px`);
      heart.style.setProperty('--rot', `${rot}deg`);
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);

      // 2. Spawn floating cute perk badge
      const perkBadge = document.createElement('div');
      perkBadge.className = 'floating-perk';
      perkBadge.textContent = customPerkText || cutePerks[Math.floor(Math.random() * cutePerks.length)];
      perkBadge.style.left = `${x}px`;
      perkBadge.style.top = `${y - 10}px`;
      perkBadge.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);

      document.body.appendChild(perkBadge);
      setTimeout(() => perkBadge.remove(), 1100);

      // 3. Burrito squish physics
      if (burritoFrame) {
        burritoFrame.classList.remove('squish');
        void burritoFrame.offsetWidth;
        burritoFrame.classList.add('squish');
      }

      // 4. Update meter & quotes
      const pct = Math.min(100, Math.round((this.loveTaps / this.targetTaps) * 100));
      if (loveFillBar) loveFillBar.style.width = `${pct}%`;
      if (loveCounter) loveCounter.textContent = `${this.loveTaps} / ${this.targetTaps} ❤️`;

      updateMoodAndTemp(this.loveTaps);

      // 5. Completion event
      if (this.loveTaps >= this.targetTaps) {
        this.isBurritoWon = true;
        cuteSound.playChimeMelody();

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);

        if (tapPromptBadge) tapPromptBadge.classList.add('hidden');
        if (burritoSuccess) burritoSuccess.classList.remove('hidden');

        setTimeout(() => {
          this.goToScreen(4);
        }, 1800);
      }
    };

    // Tap on container / burrito
    if (tapContainer) {
      tapContainer.addEventListener('pointerdown', (e) => {
        // Only if target is not one of the treat buttons
        if (e.target.closest('.cute-treat-btn')) return;
        handleTap(e);
      });
    }

    // Treat buttons
    if (btnTreatSalmon) {
      btnTreatSalmon.addEventListener('click', (e) => {
        e.stopPropagation();
        handleTap(e, "+1 Fresh Salmon Sushi! 🍣");
      });
    }

    if (btnTreatBoba) {
      btnTreatBoba.addEventListener('click', (e) => {
        e.stopPropagation();
        handleTap(e, "+1 Brown Sugar Boba! 🧋");
      });
    }

    if (btnTreatScratch) {
      btnTreatScratch.addEventListener('click', (e) => {
        e.stopPropagation();
        handleTap(e, "+1 Sweet Chin Scratch! 🐾😻");
      });
    }

    // Set initial mood
    updateMoodAndTemp(0);
  }

  // ------------------------------------------------------------------------
  // SCREEN 4: FINAL APOLOGY LETTER
  // ------------------------------------------------------------------------
  initScreen4ApologyLetter() {
    const btnForgive = document.getElementById('btnForgive');
    if (btnForgive) {
      btnForgive.addEventListener('click', () => {
        cuteSound.playPop();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 }
        });
        this.goToScreen(5);
      });
    }
  }

  // ------------------------------------------------------------------------
  // SCREEN 5: PROPOSAL & CANVAS SIGNATURE
  // ------------------------------------------------------------------------
  initScreen5ProposalAndCanvas() {
    const btnPutRing = document.getElementById('btnPutRing');
    const ringStatusMsg = document.getElementById('ringStatusMsg');
    const ringEmojiIcon = document.getElementById('ringEmojiIcon');

    if (btnPutRing) {
      btnPutRing.addEventListener('click', () => {
        cuteSound.playChimeMelody();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 }
        });

        if (ringEmojiIcon) ringEmojiIcon.textContent = '💖💍✨';
        if (ringStatusMsg) {
          ringStatusMsg.textContent = "The ring fits her soft paw perfectly! She smiled! ✨";
        }
        btnPutRing.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btnPutRing.innerHTML = "<span>✨ Ring Placed with Love! ✨</span>";
      });
    }

    // Canvas drawing
    const canvas = document.getElementById('signatureCanvas');
    const canvasHint = document.getElementById('canvasHintText');
    const btnClearSig = document.getElementById('btnClearSig');
    const btnSubmitWedding = document.getElementById('btnSubmitWedding');

    if (!canvas) return;

    this.sigCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.hasDrawn = false;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => {
      this.isDrawing = true;
      this.hasDrawn = true;
      if (canvasHint) canvasHint.style.opacity = '0';
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    const endDraw = () => {
      if (this.isDrawing) {
        this.ctx.closePath();
        this.isDrawing = false;
      }
    };

    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    window.addEventListener('pointerup', endDraw);
    window.addEventListener('pointercancel', endDraw);

    // Clear Button
    if (btnClearSig) {
      btnClearSig.addEventListener('click', () => {
        cuteSound.playPop();
        this.clearCanvas();
      });
    }

    // Submit 'I Do' Button
    if (btnSubmitWedding) {
      btnSubmitWedding.addEventListener('click', () => {
        cuteSound.playWeddingFanfare();

        // If user didn't draw, generate a charming cursive heart signature
        if (!this.hasDrawn) {
          this.drawDefaultHeartSignature();
        }

        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem('nuray_saved_signature', dataUrl);

        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.55 }
        });

        setTimeout(() => {
          this.goToScreen(6);
        }, 400);
      });
    }
  }

  resizeCanvas() {
    if (!this.sigCanvas || !this.ctx) return;
    const rect = this.sigCanvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    this.sigCanvas.width = rect.width * dpr;
    this.sigCanvas.height = 140 * dpr;

    this.ctx.scale(dpr, dpr);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 3.5;
    this.ctx.strokeStyle = '#b81944'; // Romantic berry wine color
  }

  clearCanvas() {
    if (!this.sigCanvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.sigCanvas.width, this.sigCanvas.height);
    this.hasDrawn = false;
    const hint = document.getElementById('canvasHintText');
    if (hint) hint.style.opacity = '1';
  }

  drawDefaultHeartSignature() {
    if (!this.ctx || !this.sigCanvas) return;
    const rect = this.sigCanvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = 70;

    this.ctx.font = '36px "Dancing Script", cursive';
    this.ctx.fillStyle = '#b81944';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Nuray ♡', cx, cy);
    this.hasDrawn = true;
  }

  // ------------------------------------------------------------------------
  // SCREEN 6: DIGITAL VIRTUAL MARRIAGE CERTIFICATE
  // ------------------------------------------------------------------------
  initScreen6Certificate() {
    const btnClaimDate = document.getElementById('btnClaimDate');
    const btnSaveCert = document.getElementById('btnSaveCert');
    const btnReplay = document.getElementById('btnReplay');
    const dateClaimModal = document.getElementById('dateClaimModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnRealMessenger = document.getElementById('btnRealMessenger');

    if (btnClaimDate && dateClaimModal) {
      btnClaimDate.addEventListener('click', () => {
        cuteSound.playWeddingFanfare();
        dateClaimModal.classList.remove('hidden');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.5 }
        });
      });
    }

    const closeModal = () => {
      if (dateClaimModal) dateClaimModal.classList.add('hidden');
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

    // Custom date claim handler (runs placeholder JS function for database or Messenger link)
    if (btnRealMessenger) {
      btnRealMessenger.addEventListener('click', (e) => {
        this.handleClaimRealDate(e);
      });
    }

    // Save/Print certificate
    if (btnSaveCert) {
      btnSaveCert.addEventListener('click', () => {
        cuteSound.playPop();
        window.print();
      });
    }

    // Replay story
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        cuteSound.playPop();
        this.loveTaps = 0;
        this.isBurritoWon = false;
        const fill = document.getElementById('loveFillBar');
        const count = document.getElementById('loveCounterDisplay');
        const alert = document.getElementById('burritoSuccessAlert');
        const badge = document.getElementById('tapPromptBadge');
        if (fill) fill.style.width = '0%';
        if (count) count.textContent = '0 / 10 ❤️';
        if (alert) alert.classList.add('hidden');
        if (badge) badge.classList.remove('hidden');
        this.clearCanvas();
        this.goToScreen(1);
      });
    }
  }

  handleClaimRealDate(e) {
    // Links to Instagram Direct for @tanjiro_ka.ma.do
    console.log("💌 Real Life Date Claim Activated for Nuray & Ongkur on Instagram (@tanjiro_ka.ma.do)!");
    try {
      localStorage.setItem('nuray_date_vow_claimed', new Date().toISOString());
    } catch {}
    cuteSound.playWeddingFanfare();
  }

  renderCertificate() {
    const dateDisplay = document.getElementById('certDateDisplay');
    if (dateDisplay) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    const savedSig = localStorage.getItem('nuray_saved_signature');
    const injectedSig = document.getElementById('injectedSignature');
    const fallbackSig = document.getElementById('sigFallbackText');

    if (savedSig && injectedSig) {
      injectedSig.src = savedSig;
      injectedSig.classList.remove('hidden');
      if (fallbackSig) fallbackSig.classList.add('hidden');
    } else {
      if (injectedSig) injectedSig.classList.add('hidden');
      if (fallbackSig) fallbackSig.classList.remove('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.storyApp = new CuteStoryApp();
});
