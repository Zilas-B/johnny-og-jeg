/* ================================================================
   CASH-RADIO.JS — sticky bottom music player behavior
   Each page sets window.CASH_PLAYLIST = [{n, title, year, yt, sp, wk}]
   ================================================================ */
(function () {
  function init() {
    var pl = window.CASH_PLAYLIST || [];
    if (!pl.length) return;

    var radio = document.getElementById('cash-radio');
    if (!radio) return;

    var tracksWrap = radio.querySelector('.tracks');
    var titleEl    = radio.querySelector('.nowplay .title');
    var metaEl     = radio.querySelector('.nowplay .meta');
    var bar        = radio.querySelector('.progress .bar');
    var playBtn    = radio.querySelector('.ctl-btn.play');
    var prevBtn    = radio.querySelector('.ctl-btn.prev');
    var nextBtn    = radio.querySelector('.ctl-btn.next');
    var ytLink     = radio.querySelector('.listen-on .yt');
    var spLink     = radio.querySelector('.listen-on .sp');
    var wkLink     = radio.querySelector('.listen-on .wk');
    var tab        = radio.querySelector('.radio-tab');

    var current = 0;
    var playing = false;
    var progressTimer = null;
    var progressPct = 0;

    function render() {
      tracksWrap.innerHTML = '';
      pl.forEach(function (t, i) {
        var d = document.createElement('div');
        d.className = 'trk' + (i === current ? ' active' : '');
        d.innerHTML =
          '<div class="n">' + (t.n || ('No. ' + (i + 1).toString().padStart(2, '0'))) + '</div>' +
          '<div class="t">' + t.title + '</div>' +
          '<div class="y">' + (t.year || '') + (t.album ? ' · ' + t.album : '') + '</div>';
        d.addEventListener('click', function () {
          if (i === current) { togglePlay(); }
          else { selectTrack(i, true); }
        });
        tracksWrap.appendChild(d);
      });
    }

    function selectTrack(i, autoplay) {
      current = ((i % pl.length) + pl.length) % pl.length;
      var t = pl[current];
      titleEl.textContent = t.title;
      metaEl.innerHTML =
        '<span>' + (t.year || '') + '</span>' +
        (t.album ? '<span class="star">✶</span><span>' + t.album + '</span>' : '') +
        '<span class="star">✶</span><span>Johnny Cash</span>';
      var q = encodeURIComponent('Johnny Cash ' + t.title);
      ytLink.href = t.yt || ('https://www.youtube.com/results?search_query=' + q);
      spLink.href = t.sp || ('https://open.spotify.com/search/' + q);
      wkLink.href = t.wk || ('https://en.wikipedia.org/wiki/Special:Search?search=' + q);
      progressPct = 0;
      bar.style.width = '0%';
      render();
      if (autoplay) { setPlaying(true); }
    }

    function setPlaying(p) {
      playing = p;
      radio.classList.toggle('playing', playing);
      playBtn.innerHTML = playing ? '❚❚' : '▶';
      if (playing) {
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(function () {
          progressPct += 0.35;
          if (progressPct >= 100) {
            progressPct = 0;
            selectTrack(current + 1, true);
            return;
          }
          bar.style.width = progressPct + '%';
        }, 240);
      } else {
        if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
      }
    }

    function togglePlay() { setPlaying(!playing); }

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', function () { selectTrack(current - 1, playing); });
    nextBtn.addEventListener('click', function () { selectTrack(current + 1, playing); });

    if (tab) {
      tab.addEventListener('click', function () {
        radio.classList.toggle('collapsed');
      });
    }

    selectTrack(0, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
