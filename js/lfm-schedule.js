$(document).ready(function() {
  // Name der laut.fm Station
  const station_name = "";

  // Option zum Anzeigen der Bilder (true / false)
  const images = true;

  // URL inkl. Unterordner, wo die Bilder zu suchen sind
  const images_url = "";

  // Wenn true und images auch true ist, wird der
  // benötigte Dateinamen der Bilder angezeigt (true / false)
  const show_img_name = false;

  // Das Standardbild, wenn das eigentliche Bild nicht gefunden wird.
  const img_default = ""; // Die gesamte URL ist "images_url + img_default"

  // Die angezeigten Wochentage
  const daysOfWeek = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  //////////////////////////
  // ENDE DER AENDERUNGEN //
  /////////////////////////

  // DOM-Referenz
  const scheduleContainer = document.getElementById('lfm_schedule_selfhost');

  // Grundstruktur in HTML erstellen
  scheduleContainer.innerHTML = `
    <div id="lfm_schedule" class="lfm_schedule">
      <div class="tab"></div>
      <table class="lfm_api_schedule_table_head">
        <tr>
          <td rowspan="2" class="lfm_api_schedule_head_time lfm_schedule_td">Uhrzeit</td>
          <td rowspan="2" class="lfm_api_schedule_head_img lfm_schedule_td"></td>
          <td rowspan="1" class="lfm_api_schedule_head_title lfm_schedule_td">Sendung</td>
          <td rowspan="1" class="lfm_api_schedule_playlist_head_description lfm_schedule_td">Beschreibung</td>
        </tr>
      </table>
      <div class="tabcontent-container"></div>
    </div>
  `;

  const tabContainer = document.querySelector('.tab');
  const tabContentContainer = document.querySelector('.tabcontent-container');

  if (!images) {
    $('.lfm_api_schedule_head_img').hide();
  }

  // Dynamisch Tabs erstellen
  daysOfWeek.forEach((day, index) => {
    // Tab Button
    const tabButton = document.createElement('button');
    tabButton.className = 'tablinks';
    tabButton.textContent = day;
    tabButton.setAttribute('data-day', index);
    tabButton.addEventListener('click', function() {
      openDAY(index);
    });

    tabContainer.appendChild(tabButton);

    // Tab Content
    const tabContent = document.createElement('div');
    tabContent.className = 'tabcontent';
    tabContent.innerHTML = `<div class="api_lfm_schedule">Loading...</div>`;

    tabContentContainer.appendChild(tabContent);
  });

  // Alle Tab-Buttons und Tab-Inhalte sammeln
  var tablinks = Array.from(document.getElementsByClassName("tablinks"));
  var tabcontent = Array.from(document.getElementsByClassName("tabcontent"));

  // Funktion zum Wechseln zwischen den Tabs
  function openDAY(day) {
    // Entfernt die "active" Klasse von allen Tabs und Tab-Inhalten
    tabcontent.forEach(content => {
      content.classList.remove("active");
      content.style.display = "none";
    });

    tablinks.forEach(link => {
      link.classList.remove("active");
    });

    // Fügt "active" zur aktiven Tab und Tab-Inhalt hinzu
    tabcontent[day].classList.add("active");
    tabcontent[day].style.display = "block";
    tablinks[day].classList.add("active");
  }

  // Erste Aktivierung der Tabs
  openDAY(0);

  // Funktion zum Abrufen und Verarbeiten des Sendeplans
  var updateData = function() {
    var nextUpdate = 3600000 - new Date().getTime() % 3600000;
    setTimeout(updateData, nextUpdate);

    $.ajax({
      type: "GET",
      url: "https://api.laut.fm/station/" + station_name + "/schedule",
      dataType: "json",
      timeout: 10000
    }).done(function(schedule) {
      // Hole den aktuellen Wochentag
      var get_day = (new Date().getDay() || 7) - 1;
      openDAY(get_day); // Standardmäßig den aktuellen Tag öffnen

      if (schedule[0].end_time === null) {
        document.getElementsByClassName('lfm_schedule')[0].style.display = 'inline-block';
        document.getElementById('lfm_schedule').innerHTML = '<div class="lfm_schedule_no_entry">Der Sendeplan kann aktuell nicht angezeigt werden</div>';
      } else {
        document.getElementsByClassName('lfm_schedule')[0].style.display = 'inline-block';
        var no_entry = '<div class="no_entry">Leider keine Sendung</div>';
        var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        var days_buffer = {mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []};
        var groupLength = schedule.length;

        schedule.forEach((schedule_entry, index) => {
          var start_time = schedule_entry.hour.toString().padStart(2, '0') + ':00';
          var end_time = schedule_entry.end_time ? schedule_entry.end_time.toString().padStart(2, '0') + ':00' : "";
          var entryindex = index + 1 === groupLength ? "theend" : (index + 1);

          // Wenn Bilder angezeigt werden sollen und Debug aktiviert ist
          var pl_img = "";
          if (images) {
            if (show_img_name) {
              pl_img = `<td class="lfm_api_schedule_td_img lfm_schedule_td" rowspan="2"><img class="lfm_api_schedule_img" src="${images_url}${schedule_entry.id}.png" onerror="this.onerror=null;this.src='${images_url}${schedule_entry.id}.png';" alt="${schedule_entry.id}.png"></td>`;
            } else {
              pl_img = `<td class="lfm_api_schedule_td_img lfm_schedule_td" rowspan="2"><img class="lfm_api_schedule_img" src="${images_url}${schedule_entry.id}.png" onerror="this.onerror=null;this.src='${images_url}${img_default}';" alt="Kein Bild"></td>`;
            }
          }

          // Bereitstellung des Sendeplans für den entsprechenden Tag
          if (schedule_entry.day === days[get_day] && schedule_entry.hour <= new Date().getHours()) {
            if (entryindex === "theend" || schedule[entryindex].day !== days[get_day] || schedule[entryindex].hour > new Date().getHours()) {
              days_buffer[schedule_entry.day].push(`<table class="lfm_api_schedule_table_playlist_now"><tr><td rowspan="2" class="lfm_api_schedule_time lfm_schedule_td"><span class="onair_symbol">ON AIR</span><br><span class="onair_time">${start_time} Uhr</span></td>${pl_img}<td rowspan="1" class="lfm_api_schedule_playlist_name lfm_schedule_td"><b>${schedule_entry.name}</b></td><td rowspan="1" class="lfm_api_schedule_playlist_description lfm_schedule_td">${schedule_entry.description}</td></tr></table>`);
            } else {
              days_buffer[schedule_entry.day].push(`<table class="lfm_api_schedule_table"><tr><td rowspan="2" class="lfm_api_schedule_time lfm_schedule_td">${start_time} Uhr</td>${pl_img}<td rowspan="1" class="lfm_api_schedule_playlist_name lfm_schedule_td"><b>${schedule_entry.name}</b></td><td rowspan="1" class="lfm_api_schedule_playlist_description lfm_schedule_td">${schedule_entry.description}</td></tr></table>`);
            }
          } else {
            days_buffer[schedule_entry.day].push(`<table class="lfm_api_schedule_table"><tr><td rowspan="2" class="lfm_api_schedule_time lfm_schedule_td">${start_time} Uhr</td>${pl_img}<td rowspan="1" class="lfm_api_schedule_playlist_name lfm_schedule_td"><b>${schedule_entry.name}</b></td><td rowspan="1" class="lfm_api_schedule_playlist_description lfm_schedule_td">${schedule_entry.description}</td></tr></table>`);
          }
        });

        // Daten in die entsprechenden Tabs einfügen
        tabcontent.forEach((tab, index) => {
          tab.innerHTML = days_buffer[days[index]].length >= 1 ? days_buffer[days[index]].join('') : no_entry;
        });
      }
    }).fail(function(xhr, status, error) {
      $('.lfm_schedule').html("Fehler beim Laden der laut.fm - API");
      console.warn('Warning (API): Schedule reports: ' + xhr.status + ' ' + error);
    });
  };

  // Initiales Laden der Daten
  updateData();
});
