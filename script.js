// ES6 JavaScript cho trang web chúc mừng 20/10 với Music Player

class LoveWebsite {
  constructor() {
    this.loveCounter = 0;
    this.isAnimating = false;
    this.currentTrack = 0;
    this.isPlaying = false;
    this.audio = null;
    this.tracks = [
      { src: "music/song1.mp3", name: "Bài hát 1", duration: "3:45" },
      { src: "music/song2.mp3", name: "Bài hát 2", duration: "4:12" },
      { src: "music/song3.mp3", name: "Bài hát 3", duration: "3:28" },
      { src: "music/song4.mp3", name: "Bài hát 4", duration: "4:05" },
      { src: "music/song5.mp3", name: "Bài hát 5", duration: "3:52" },
    ];
    this.init();
  }

  init() {
    this.bindEvents();
    this.startBackgroundAnimation();
    this.addWelcomeEffect();
    this.initMusicPlayer();
  }

  initMusicPlayer() {
    this.audio = new Audio();
    this.audio.addEventListener("loadedmetadata", () => this.updateTrackInfo());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.nextTrack());
    this.audio.addEventListener("error", () => this.handleAudioError());

    this.loadTrack(0);

    // Tự động phát nhạc khi trang web load xong
    setTimeout(() => {
      this.autoPlayMusic();
    }, 2000); // Delay 2 giây để trang web load hoàn toàn
  }

  autoPlayMusic() {
    // Kiểm tra xem trình duyệt có cho phép autoplay không
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        document.getElementById("playPauseBtn").textContent = "⏸️";
        console.log("Nhạc đã tự động phát!");
      })
      .catch((error) => {
        console.log("Không thể tự động phát nhạc:", error);
        // Hiển thị thông báo cho user click để phát nhạc
        this.showAutoPlayMessage();
      });
  }

  showAutoPlayMessage() {
    const trackName = document.getElementById("trackName");
    const originalText = trackName.textContent;
    trackName.textContent = "Click ▶️ để phát nhạc";
    trackName.style.color = "#ef4444";
    trackName.style.fontStyle = "italic";

    // Reset về text gốc sau 5 giây
    setTimeout(() => {
      trackName.textContent = originalText;
      trackName.style.color = "#1e3a8a";
      trackName.style.fontStyle = "normal";
    }, 5000);
  }

  bindEvents() {
    const loveButton = document.getElementById("loveButton");
    const flowers = document.querySelectorAll(".flower");

    // Event listener cho nút tình yêu
    loveButton.addEventListener("click", () => this.handleLoveClick());

    // Event listeners cho hoa
    flowers.forEach((flower, index) => {
      flower.addEventListener("click", () =>
        this.handleFlowerClick(flower, index)
      );
    });

    // Music player events
    const playPauseBtn = document.getElementById("playPauseBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const volumeSlider = document.getElementById("volumeSlider");
    const playlistItems = document.querySelectorAll(".playlist-item");

    playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    prevBtn.addEventListener("click", () => this.previousTrack());
    nextBtn.addEventListener("click", () => this.nextTrack());
    volumeSlider.addEventListener("input", (e) =>
      this.setVolume(e.target.value)
    );

    playlistItems.forEach((item, index) => {
      item.addEventListener("click", () => this.loadTrack(index));
    });

    // Hiệu ứng hover cho các element
    this.addHoverEffects();
  }

  loadTrack(index) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentTrack = index;
      this.audio.src = this.tracks[index].src;
      this.updatePlaylistUI();
      this.updateTrackName();
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseTrack();
    } else {
      this.playTrack();
    }
  }

  playTrack() {
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        document.getElementById("playPauseBtn").textContent = "⏸️";
      })
      .catch((error) => {
        console.log("Không thể phát nhạc:", error);
        this.showMusicError();
      });
  }

  pauseTrack() {
    this.audio.pause();
    this.isPlaying = false;
    document.getElementById("playPauseBtn").textContent = "▶️";
  }

  previousTrack() {
    const prevIndex =
      this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
    this.loadTrack(prevIndex);
    if (this.isPlaying) {
      this.playTrack();
    }
  }

  nextTrack() {
    const nextIndex =
      this.currentTrack < this.tracks.length - 1 ? this.currentTrack + 1 : 0;
    this.loadTrack(nextIndex);
    if (this.isPlaying) {
      this.playTrack();
    }
  }

  setVolume(value) {
    this.audio.volume = value / 100;
  }

  updateTrackInfo() {
    const totalTime = this.formatTime(this.audio.duration);
    document.getElementById("totalTime").textContent = totalTime;
  }

  updateProgress() {
    if (this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      document.getElementById("progressFill").style.width = progress + "%";
      document.getElementById("currentTime").textContent = this.formatTime(
        this.audio.currentTime
      );
    }
  }

  updateTrackName() {
    document.getElementById("trackName").textContent =
      this.tracks[this.currentTrack].name;
  }

  updatePlaylistUI() {
    document.querySelectorAll(".playlist-item").forEach((item, index) => {
      item.classList.toggle("active", index === this.currentTrack);
    });
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  handleAudioError() {
    console.log(
      "Lỗi tải nhạc. Vui lòng kiểm tra file nhạc trong folder music/"
    );
    this.showMusicError();
  }

  showMusicError() {
    document.getElementById("trackName").textContent =
      "Không thể phát nhạc - Kiểm tra file nhạc";
    document.getElementById("playPauseBtn").textContent = "▶️";
    this.isPlaying = false;
  }

  handleLoveClick() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.loveCounter++;

    // Cập nhật counter
    this.updateLoveCounter();

    // Tạo hiệu ứng trái tim bay
    this.createFlyingHearts();

    // Hiệu ứng nút bấm
    this.animateButton();

    // Reset animation flag sau 1 giây
    setTimeout(() => {
      this.isAnimating = false;
    }, 1000);
  }

  handleFlowerClick(flower, index) {
    // Hiệu ứng xoay và phóng to
    flower.style.transform = "scale(1.5) rotate(360deg)";
    flower.style.transition = "all 0.6s ease";

    // Tạo hiệu ứng cánh hoa bay
    this.createFlyingPetals(flower);

    // Reset sau animation
    setTimeout(() => {
      flower.style.transform = "scale(1) rotate(0deg)";
    }, 600);
  }

  updateLoveCounter() {
    const counterElement = document.getElementById("loveCounter");
    counterElement.style.transform = "scale(1.2)";
    counterElement.style.color = "#ef4444";

    // Animation số đếm
    this.animateCounter(counterElement, this.loveCounter);

    setTimeout(() => {
      counterElement.style.transform = "scale(1)";
      counterElement.style.color = "#3b82f6";
    }, 300);
  }

  animateCounter(element, targetValue) {
    const startValue = parseInt(element.textContent) || 0;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * progress
      );
      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  createFlyingHearts() {
    const container = document.querySelector(".container");
    const heartEmojis = ["💖", "💕", "💗", "💝", "💘", "❤️"];

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.textContent =
          heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.position = "absolute";
        heart.style.fontSize = "2rem";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.top = "50%";
        heart.style.zIndex = "1000";
        heart.style.pointerEvents = "none";
        heart.style.animation = "flyUp 2s ease-out forwards";

        container.appendChild(heart);

        // Xóa element sau animation
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 2000);
      }, i * 100);
    }
  }

  createFlyingPetals(flower) {
    const petals = ["🌸", "🌺", "🌻", "🌷"];
    const container = document.querySelector(".container");

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const petal = document.createElement("div");
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.position = "absolute";
        petal.style.fontSize = "1.5rem";
        petal.style.left = flower.offsetLeft + "px";
        petal.style.top = flower.offsetTop + "px";
        petal.style.zIndex = "1000";
        petal.style.pointerEvents = "none";
        petal.style.animation = "flyAway 1.5s ease-out forwards";

        container.appendChild(petal);

        setTimeout(() => {
          if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
          }
        }, 1500);
      }, i * 200);
    }
  }

  animateButton() {
    const button = document.getElementById("loveButton");
    const buttonText = button.querySelector(".button-text");

    // Hiệu ứng nhấp nháy
    button.style.animation = "pulse 0.3s ease-in-out";
    buttonText.textContent = "Đã gửi tình yêu! 💕";

    setTimeout(() => {
      button.style.animation = "";
      buttonText.textContent = "Click để gửi tình yêu 💕";
    }, 1000);
  }

  addHoverEffects() {
    const messageCard = document.querySelector(".message-card");
    const title = document.querySelector(".title");

    // Hiệu ứng hover cho card
    messageCard.addEventListener("mouseenter", () => {
      messageCard.style.transform = "translateY(-5px)";
      messageCard.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.15)";
    });

    messageCard.addEventListener("mouseleave", () => {
      messageCard.style.transform = "translateY(0)";
      messageCard.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
    });

    // Hiệu ứng hover cho title
    title.addEventListener("mouseenter", () => {
      title.style.transform = "scale(1.05)";
      title.style.textShadow = "3px 3px 6px rgba(0, 0, 0, 0.2)";
    });

    title.addEventListener("mouseleave", () => {
      title.style.transform = "scale(1)";
      title.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.1)";
    });
  }

  startBackgroundAnimation() {
    // Tạo hiệu ứng background động
    const hearts = document.querySelectorAll(".heart");

    hearts.forEach((heart, index) => {
      // Random delay cho mỗi trái tim
      const randomDelay = Math.random() * 2;
      heart.style.animationDelay = randomDelay + "s";

      // Random position
      const randomTop = Math.random() * 100;
      const randomLeft = Math.random() * 100;
      heart.style.top = randomTop + "%";
      heart.style.left = randomLeft + "%";
    });
  }

  addWelcomeEffect() {
    // Hiệu ứng chào mừng khi load trang
    const elements = document.querySelectorAll(".main-content > *");

    elements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";

      setTimeout(() => {
        element.style.transition = "all 0.8s ease-out";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }
}

// CSS Animations được thêm động
const addDynamicCSS = () => {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes flyUp {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(0.5);
            }
        }
        
        @keyframes flyAway {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(${
                  Math.random() * 200 - 100
                }px, -100px) rotate(360deg);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .main-content > * {
            transition: all 0.3s ease;
        }
        
        .message-card {
            transition: all 0.3s ease;
        }
        
        .title {
            transition: all 0.3s ease;
        }
    `;
  document.head.appendChild(style);
};

// Khởi tạo ứng dụng khi DOM đã load
document.addEventListener("DOMContentLoaded", () => {
  addDynamicCSS();

  // Thêm hiệu ứng loading
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 1s ease-in-out";
    document.body.style.opacity = "1";

    // Khởi tạo website sau khi loading xong
    new LoveWebsite();
  }, 100);
});

// Thêm hiệu ứng scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".background-animation");
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Thêm hiệu ứng resize
window.addEventListener("resize", () => {
  // Responsive adjustments
  const flowers = document.querySelectorAll(".flower");
  if (window.innerWidth < 768) {
    flowers.forEach((flower) => {
      flower.style.fontSize = "1.5rem";
    });
  } else {
    flowers.forEach((flower) => {
      flower.style.fontSize = "2rem";
    });
  }
});
