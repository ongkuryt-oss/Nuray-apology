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

      const avatar = document.createElement('img');
      avatar.className = 'row-mini-avatar';
      avatar.src = '/resources/insta_pfp_nurayberry.png';
      avatar.alt = 'nurayberry';

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
  // ------------------------------------------------------------------------
  // SCREEN 6: DIGITAL VIRTUAL MARRIAGE CERTIFICATE & A4 DOWNLOAD
  // ------------------------------------------------------------------------
  initScreen6Certificate() {
    const btnClaimDate = document.getElementById('btnClaimDate');
    const btnSaveCert = document.getElementById('btnSaveCert');
    const btnPreviewCert = document.getElementById('btnPreviewCert');
    const btnPrintCert = document.getElementById('btnPrintCert');
    const btnReplay = document.getElementById('btnReplay');
    const dateClaimModal = document.getElementById('dateClaimModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnRealMessenger = document.getElementById('btnRealMessenger');

    // A4 Preview Modal elements
    const certPreviewModal = document.getElementById('certPreviewModal');
    const certModalCloseBtn = document.getElementById('certModalCloseBtn');
    const btnCloseCertModal = document.getElementById('btnCloseCertModal');
    const btnDownloadFromModal = document.getElementById('btnDownloadFromModal');
    const btnPrintFromModal = document.getElementById('btnPrintFromModal');

    this.cachedCertDataUrl = null;
    this.isGeneratingCert = false;

    // Date voucher modal
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

    // Custom date claim handler
    if (btnRealMessenger) {
      btnRealMessenger.addEventListener('click', (e) => {
        this.handleClaimRealDate(e);
      });
    }

    // MAIN REQUIREMENT: Click Save Certificate -> Download A4 Size Certificate Image
    if (btnSaveCert) {
      btnSaveCert.addEventListener('click', () => {
        this.downloadA4Certificate();
      });
    }

    // Preview A4 Modal
    if (btnPreviewCert) {
      btnPreviewCert.addEventListener('click', () => {
        this.openCertPreviewModal();
      });
    }

    // Print Buttons
    const handlePrint = () => {
      cuteSound.playPop();
      window.print();
    };
    if (btnPrintCert) btnPrintCert.addEventListener('click', handlePrint);
    if (btnPrintFromModal) btnPrintFromModal.addEventListener('click', handlePrint);

    // Close A4 Modal
    const closeCertModal = () => {
      if (certPreviewModal) certPreviewModal.classList.add('hidden');
    };
    if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertModal);
    if (btnCloseCertModal) btnCloseCertModal.addEventListener('click', closeCertModal);

    // Download from Modal
    if (btnDownloadFromModal) {
      btnDownloadFromModal.addEventListener('click', () => {
        this.downloadA4Certificate();
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

  showToast(message, icon = '📜') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'cute-toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // Generate ultra high-definition standard A4 Certificate (2480 x 1754 px at 300 DPI)
  async generateA4CertificateCanvas() {
    // Wait for web fonts to load for pristine typography
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {}
    }

    // A4 Landscape dimensions in pixels (standard 300 DPI: 2480 x 1754)
    const width = 2480;
    const height = 1754;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Helper: safely load image
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    // Load assets in parallel
    const [brideImg, groomImg] = await Promise.all([
      loadImage('/resources/insta_pfp_nurayberry.png'),
      loadImage('/resources/insta_pfp_ongkur.jpg')
    ]);

    // Load saved signature image if exists
    let sigImg = null;
    const savedSigData = localStorage.getItem('nuray_saved_signature');
    if (savedSigData) {
      sigImg = await loadImage(savedSigData);
    } else if (this.sigCanvas && this.hasDrawn) {
      sigImg = await loadImage(this.sigCanvas.toDataURL('image/png'));
    }

    // 1. BACKGROUND: Luxury ivory cream parchment with subtle radiant vignette
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, '#fffefb');
    bgGrad.addColorStop(0.65, '#fef8ee');
    bgGrad.addColorStop(1, '#f9edd7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative watermark paws in background
    ctx.save();
    ctx.font = '80px sans-serif';
    ctx.fillStyle = 'rgba(224, 179, 78, 0.05)';
    ctx.textAlign = 'center';
    const watermarkCoords = [
      [360, 380], [2120, 380], [360, 1400], [2120, 1400],
      [1240, 480], [800, 1200], [1680, 1200]
    ];
    watermarkCoords.forEach(([wx, wy]) => {
      ctx.fillText('🐾', wx, wy);
    });
    ctx.restore();

    // 2. ORNATE TRIPLE ROYAL GOLD BORDERS
    // Outer Thick Gold Frame
    ctx.save();
    ctx.strokeStyle = '#d49520';
    ctx.lineWidth = 14;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Middle Thin Gold Pin-Stripe
    ctx.strokeStyle = '#f5c042';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(68, 68, width - 136, height - 136);

    // Inner Dashed Vintage Line
    ctx.strokeStyle = '#c48312';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(84, 84, width - 168, height - 168);
    ctx.setLineDash([]);
    ctx.restore();

    // Four Ornate Gold Corner Medallions & Paw Prints
    const corners = [
      { x: 120, y: 120 },
      { x: width - 120, y: 120 },
      { x: 120, y: height - 120 },
      { x: width - 120, y: height - 120 }
    ];
    corners.forEach(pt => {
      ctx.save();
      ctx.font = '54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐾', pt.x, pt.y);
      ctx.restore();
    });

    // 3. ROYAL CERTIFICATE HEADER
    // Top Crowns & Sparkles
    ctx.save();
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑   ✨   👑', width / 2, 160);

    // Top Category Badge
    ctx.font = '700 24px "Nunito", "Quicksand", sans-serif';
    ctx.fillStyle = '#b87a0e';
    ctx.letterSpacing = '2px';
    ctx.fillText('OFFICIAL FELINE LOVE REGISTRY • VOWS OF ETERNAL DEVOTION', width / 2, 220);

    // Main Title: CERTIFICATE OF ETERNAL FORGIVENESS
    ctx.shadowColor = 'rgba(184, 122, 14, 0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.font = '900 68px "Nunito", "Quicksand", sans-serif';
    ctx.fillStyle = '#4a2818';
    ctx.fillText('Certificate of Eternal Forgiveness', width / 2, 295);

    // Subtitle: & Virtual Marriage
    ctx.shadowColor = 'rgba(255, 91, 121, 0.25)';
    ctx.shadowBlur = 10;
    ctx.font = '700 86px "Dancing Script", cursive';
    ctx.fillStyle = '#b81944';
    ctx.fillText('& Virtual Marriage', width / 2, 385);
    ctx.restore();

    // Decorative Pink Ribbon Divider
    ctx.save();
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff9ebb';
    ctx.fillText('🎀   ~ • ~ • ~ • ~ • ~ • ~ • ~   🎀', width / 2, 445);
    ctx.restore();

    // Proclamation Text
    ctx.save();
    ctx.font = 'italic 500 32px "Quicksand", "Nunito", sans-serif';
    ctx.fillStyle = '#6e4f5d';
    ctx.textAlign = 'center';
    ctx.fillText('Be it known to all kingdoms, cuddly cats, and pretty flowers that:', width / 2, 510);
    ctx.restore();

    // 4. COUPLE HIGHLIGHT CARDS (Bride, Love Union, Groom)
    const centerY = 710;
    const avatarRadius = 105;

    // A. Bride Block (Nuray @nurayberry)
    const brideX = 680;
    ctx.save();
    // Avatar Shadow & Border
    ctx.shadowColor = 'rgba(255, 158, 187, 0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.arc(brideX, centerY - 40, avatarRadius + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeef3';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ff9ebb';
    ctx.stroke();
    ctx.restore();

    // Draw Bride Avatar (clipped circular)
    ctx.save();
    ctx.beginPath();
    ctx.arc(brideX, centerY - 40, avatarRadius, 0, Math.PI * 2);
    ctx.clip();
    if (brideImg) {
      ctx.drawImage(brideImg, brideX - avatarRadius, (centerY - 40) - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    } else {
      ctx.fillStyle = '#ffe4ec';
      ctx.fillRect(brideX - avatarRadius, (centerY - 40) - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.font = '90px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👰', brideX, centerY - 40);
    }
    ctx.restore();

    // Bride Name
    ctx.save();
    ctx.font = '700 72px "Dancing Script", cursive';
    ctx.fillStyle = '#b81944';
    ctx.textAlign = 'center';
    ctx.fillText('Nuray', brideX, centerY + 125);

    // Bride Role Pill Badge (Pure title without IG username)
    const bBadgeW = 210;
    const bBadgeH = 46;
    const bBadgeX = brideX - bBadgeW / 2;
    const bBadgeY = centerY + 145;
    ctx.fillStyle = '#ffe6ee';
    ctx.strokeStyle = '#ffb8cc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(bBadgeX, bBadgeY, bBadgeW, bBadgeH, 23);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 24px "Nunito", sans-serif';
    ctx.fillStyle = '#b81944';
    ctx.textBaseline = 'middle';
    ctx.fillText('👰 THE BRIDE', brideX, bBadgeY + bBadgeH / 2);
    ctx.restore();

    // B. Middle Love Union
    const midX = width / 2;
    ctx.save();
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💍 💞 💍', midX, centerY - 25);

    ctx.font = '900 28px "Nunito", sans-serif';
    ctx.fillStyle = '#d49520';
    ctx.letterSpacing = '3px';
    ctx.fillText('UNITED FOREVER', midX, centerY + 45);

    ctx.font = 'italic 600 24px "Quicksand", sans-serif';
    ctx.fillStyle = '#b87a0e';
    ctx.fillText('In Pure Eternal Love', midX, centerY + 85);
    ctx.restore();

    // C. Groom Block (Ongkur)
    const groomX = width - 680;
    ctx.save();
    // Avatar Shadow & Border
    ctx.shadowColor = 'rgba(255, 170, 91, 0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.arc(groomX, centerY - 40, avatarRadius + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff4eb';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ffaa5b';
    ctx.stroke();
    ctx.restore();

    // Draw Groom Avatar (clipped circular)
    ctx.save();
    ctx.beginPath();
    ctx.arc(groomX, centerY - 40, avatarRadius, 0, Math.PI * 2);
    ctx.clip();
    if (groomImg) {
      ctx.drawImage(groomImg, groomX - avatarRadius, (centerY - 40) - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    } else {
      ctx.fillStyle = '#fff0e5';
      ctx.fillRect(groomX - avatarRadius, (centerY - 40) - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.font = '90px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤵', groomX, centerY - 40);
    }
    ctx.restore();

    // Groom Name
    ctx.save();
    ctx.font = '700 72px "Dancing Script", cursive';
    ctx.fillStyle = '#d65910';
    ctx.textAlign = 'center';
    ctx.fillText('Ongkur', groomX, centerY + 125);

    // Groom Role Pill Badge (Pure title without IG username)
    const gBadgeW = 220;
    const gBadgeH = 46;
    const gBadgeX = groomX - gBadgeW / 2;
    const gBadgeY = centerY + 145;
    ctx.fillStyle = '#fff1e5';
    ctx.strokeStyle = '#ffcfad';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(gBadgeX, gBadgeY, gBadgeW, gBadgeH, 23);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 24px "Nunito", sans-serif';
    ctx.fillStyle = '#d65910';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤵 THE GROOM', groomX, gBadgeY + gBadgeH / 2);
    ctx.restore();

    // 5. SACRED COVENANT PARCHMENT SCROLL BOX
    const covW = 1680;
    const covH = 200;
    const covX = (width - covW) / 2;
    const covY = 960;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 91, 121, 0.12)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#fff6f8';
    ctx.strokeStyle = '#ffd1dc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(covX, covY, covW, covH, 26);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Inner dashed accent border
    ctx.save();
    ctx.strokeStyle = '#ff9ebb';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.roundRect(covX + 10, covY + 10, covW - 20, covH - 20, 18);
    ctx.stroke();
    ctx.restore();

    // Covenant Text
    ctx.save();
    ctx.font = '600 32px "Nunito", "Quicksand", sans-serif';
    ctx.fillStyle = '#4d2b38';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ongkur is officially forgiven forever. In return, Ongkur vows to provide', width / 2, covY + 65);
    ctx.fillText('lifetime cuddling rights, unlimited forehead kisses, delicious treats on demand,', width / 2, covY + 110);
    ctx.fillText('and shared cozy blankets with Nuray forever and ever!', width / 2, covY + 155);
    ctx.restore();

    // 6. BOTTOM ROW: DATE OF VOWS, ROYAL GOLD WAX SEAL, AND DIGITAL SIGNATURE
    const footerY = 1260;

    // A. Left: Date of Vows
    const dateX = 560;
    ctx.save();
    ctx.font = '800 24px "Nunito", sans-serif';
    ctx.fillStyle = '#946d1b';
    ctx.textAlign = 'center';
    ctx.fillText('DATE OF VOWS', dateX, footerY);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date().toLocaleDateString('en-US', dateOptions);

    ctx.font = '700 46px "Dancing Script", cursive';
    ctx.fillStyle = '#3a2012';
    ctx.fillText(dateString, dateX, footerY + 65);

    // Gold line
    ctx.strokeStyle = '#f2ca6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dateX - 190, footerY + 95);
    ctx.lineTo(dateX + 190, footerY + 95);
    ctx.stroke();

    ctx.font = 'italic 500 22px "Quicksand", sans-serif';
    ctx.fillStyle = '#9c808d';
    ctx.fillText('Under the Whisker Stars ✨', dateX, footerY + 130);
    ctx.restore();

    // B. Center: 3D Royal Gold Seal
    const sealX = width / 2;
    const sealY = footerY + 55;
    const sealRadius = 90;

    ctx.save();
    // Seal Ribbon streamers
    ctx.fillStyle = '#b81944';
    ctx.beginPath();
    ctx.moveTo(sealX - 25, sealY + 60);
    ctx.lineTo(sealX - 55, sealY + 175);
    ctx.lineTo(sealX - 25, sealY + 155);
    ctx.lineTo(sealX + 5, sealY + 175);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#991136';
    ctx.beginPath();
    ctx.moveTo(sealX + 5, sealY + 60);
    ctx.lineTo(sealX + 55, sealY + 175);
    ctx.lineTo(sealX + 25, sealY + 155);
    ctx.lineTo(sealX - 5, sealY + 175);
    ctx.closePath();
    ctx.fill();

    // Wax Seal Body
    ctx.shadowColor = 'rgba(184, 134, 20, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    const sealGrad = ctx.createRadialGradient(sealX - 20, sealY - 20, 15, sealX, sealY, sealRadius);
    sealGrad.addColorStop(0, '#fff0a8');
    sealGrad.addColorStop(0.5, '#e5b33b');
    sealGrad.addColorStop(0.85, '#b88614');
    sealGrad.addColorStop(1, '#855e09');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Seal Ring & Engravings
    ctx.save();
    ctx.strokeStyle = '#6b4d02';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 16px "Nunito", sans-serif';
    ctx.fillStyle = '#4a3400';
    ctx.fillText('★  ★  ★', sealX, sealY - 45);

    ctx.font = '40px sans-serif';
    ctx.fillText('💍🐾', sealX, sealY - 8);

    ctx.font = '900 19px "Nunito", sans-serif';
    ctx.fillStyle = '#3d2800';
    ctx.fillText('100% FORGIVEN', sealX, sealY + 34);

    ctx.font = '800 13px "Nunito", sans-serif';
    ctx.fillStyle = '#5c4008';
    ctx.fillText('ETERNAL COVENANT', sealX, sealY + 54);
    ctx.restore();

    // C. Right: Bride's Signature
    const sigX = width - 560;
    ctx.save();
    ctx.font = '800 24px "Nunito", sans-serif';
    ctx.fillStyle = '#946d1b';
    ctx.textAlign = 'center';
    ctx.fillText("NURAY'S SIGNATURE", sigX, footerY);

    // Draw the bride's digital signature
    if (sigImg) {
      // Calculate aspect-preserving box
      const maxW = 280;
      const maxH = 80;
      const aspect = sigImg.width / sigImg.height;
      let drawW = maxW;
      let drawH = drawW / aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * aspect;
      }
      ctx.drawImage(sigImg, sigX - drawW / 2, (footerY + 50) - drawH / 2, drawW, drawH);
    } else {
      ctx.font = '700 52px "Dancing Script", cursive';
      ctx.fillStyle = '#b81944';
      ctx.fillText('Nuray ♡', sigX, footerY + 60);
    }

    // Gold line
    ctx.strokeStyle = '#f2ca6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sigX - 190, footerY + 95);
    ctx.lineTo(sigX + 190, footerY + 95);
    ctx.stroke();

    ctx.font = 'italic 500 22px "Quicksand", sans-serif';
    ctx.fillStyle = '#9c808d';
    ctx.fillText('Duly Signed & Sealed by the Bride 💕', sigX, footerY + 130);
    ctx.restore();

    // 7. BOTTOM VERIFICATION FOOTER
    ctx.save();
    ctx.font = '600 20px "Nunito", sans-serif';
    ctx.fillStyle = '#a8929e';
    ctx.textAlign = 'center';
    ctx.fillText('Certified by the Celestial Whisker Council • Certificate ID: NURAY-ONGKUR-2026 • special-for-nuray.netlify.app', width / 2, height - 90);
    ctx.restore();

    return canvas;
  }

  async downloadA4Certificate() {
    if (this.isGeneratingCert) return;
    this.isGeneratingCert = true;

    cuteSound.playPop();
    this.showToast('Rendering high-res A4 certificate image... ✨', '🎨');

    try {
      const canvas = await this.generateA4CertificateCanvas();
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to generate image blob');
        }

        const url = URL.createObjectURL(blob);
        this.cachedCertDataUrl = url;

        // Create trigger anchor
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Nuray_and_Ongkur_Marriage_Certificate_A4.png';
        downloadLink.href = url;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        // Celebration
        cuteSound.playWeddingFanfare();
        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.6 }
        });

        this.showToast('A4 Certificate downloaded successfully! 📜💖', '✅');
        this.isGeneratingCert = false;

        // Also update preview img if modal is open
        const previewImg = document.getElementById('certPreviewImg');
        if (previewImg) {
          previewImg.src = url;
          previewImg.classList.remove('hidden');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error generating A4 certificate:', err);
      this.showToast('Error generating certificate. Retrying with print...', '⚠️');
      this.isGeneratingCert = false;
      window.print();
    }
  }

  async openCertPreviewModal() {
    const modal = document.getElementById('certPreviewModal');
    const previewImg = document.getElementById('certPreviewImg');
    const spinner = document.getElementById('certLoadingSpinner');

    if (!modal) return;
    modal.classList.remove('hidden');
    cuteSound.playPop();

    if (this.cachedCertDataUrl && previewImg) {
      previewImg.src = this.cachedCertDataUrl;
      previewImg.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      return;
    }

    if (spinner) spinner.classList.remove('hidden');
    if (previewImg) previewImg.classList.add('hidden');

    try {
      const canvas = await this.generateA4CertificateCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      this.cachedCertDataUrl = dataUrl;

      if (previewImg) {
        previewImg.src = dataUrl;
        previewImg.classList.remove('hidden');
      }
      if (spinner) spinner.classList.add('hidden');
    } catch (err) {
      console.error('Preview render error:', err);
      if (spinner) spinner.textContent = 'Preview rendering failed.';
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
