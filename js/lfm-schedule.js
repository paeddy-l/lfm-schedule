$(document).ready(function() {
  // Konfiguration des Sendeplans
  const config = {
    // Name der laut.fm Station
    station_name: "",

    // Option zum Anzeigen der Bilder (true / false)
    displayImages: true,

    // URL inkl. Unterordner, wo die Bilder zu suchen sind
    imagesUrl: "",

    // Wenn true und displayImages auch true ist, wird der
    // benötigte Dateinamen der Bilder angezeigt (true / false)
    showImageName: false,

    // Das Standardbild, wenn das eigentliche Bild nicht gefunden wird.
    // Die gesamte URL ist "imagesUrl + defaultImage"
    defaultImage: "",

    // Die angezeigten Wochentage
    daysOfWeek: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
  };

  // Definiere das Array für die Wochentage global
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  // Grundstruktur in HTML erstellen
  $('#lfm_schedule_selfhost').html(`
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
  `);

  // Tabs und deren Inhalte erstellen
  const tabContainer = $('.tab');
  const tabContentContainer = $('.tabcontent-container');

  config.daysOfWeek.forEach((day, index) => {
    tabContainer.append(`<button class="tablinks" data-day="${index}">${day}</button>`);
    tabContentContainer.append('<div class="tabcontent"><div class="api_lfm_schedule">Loading...</div></div>');
  });

  // Anzeige der Tabs bei Klick
  const tablinks = $(".tablinks");
  const tabcontent = $(".tabcontent");

  tablinks.on('click', function() {
    openDAY($(this).data('day'));
  });

  // Funktion zum Wechseln zwischen den Tabs
  function openDAY(day) {
    tabcontent.hide().eq(day).show();
    tablinks.removeClass('active').eq(day).addClass('active');
  }

  // Erste Aktivierung des aktuellen Tages
  openDAY((new Date().getDay() || 7) - 1);

  // AJAX-Aufruf zum Abrufen des Sendeplans
  function updateData() {
    const nextUpdate = 3600000 - new Date().getTime() % 3600000;
    setTimeout(updateData, nextUpdate);

    $.ajax({
      type: "GET",
      url: `https://api.laut.fm/station/${config.station_name}/schedule`,
      dataType: "json",
      timeout: 10000
    })
    .done(renderSchedule)
    .fail(handleError);
  }

  // Fehlerbehandlung
  function handleError(xhr, status, error) {
    $('.lfm_schedule').html("Fehler beim Laden der laut.fm - API");
    console.warn(`Error (API): ${xhr.status} ${error} - ${xhr.responseText}`);
  }

  // Rendering des Sendeplans
  function renderSchedule(schedule) {
    const currentDay = (new Date().getDay() || 7) - 1;
    const currentHour = new Date().getHours();
    openDAY(currentDay);

    if (!schedule.length || schedule[0].end_time === null) {
      $('#lfm_schedule').html('<div class="lfm_schedule_no_entry">Der Sendeplan kann aktuell nicht angezeigt werden</div>');
      return;
    }

    const daysBuffer = {mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []};
    const noEntry = '<div class="no_entry">Leider keine Sendung</div>';

    schedule.forEach((entry, index) => {
      const startTime = `${entry.hour.toString().padStart(2, '0')}:00`;
      const isOnAir = (currentDay === days.indexOf(entry.day) && currentHour >= entry.hour) &&
                      (index + 1 === schedule.length || schedule[index + 1].hour > currentHour || schedule[index + 1].day !== entry.day);
      const imgHtml = config.displayImages ? getImageHtml(entry.id) : '';
      const entryHtml = generateScheduleEntry(entry, startTime, imgHtml, isOnAir);
      daysBuffer[entry.day].push(entryHtml);
    });

    Object.keys(daysBuffer).forEach((day, index) => {
      tabcontent.eq(index).html(daysBuffer[day].length ? daysBuffer[day].join('') : noEntry);
    });
  }

  // HTML für den Sendeplan-Eintrag
  function generateScheduleEntry(entry, startTime, plImg, isOnAir) {
    return `
      <table class="${isOnAir ? "lfm_api_schedule_table_playlist_now" : "lfm_api_schedule_table"}">
        <tr>
          <td rowspan="2" class="lfm_api_schedule_time lfm_schedule_td">
            ${isOnAir ? '<span class="onair_symbol">ON AIR</span><br>' : ''}
            <span class="${isOnAir ? "onair_time" : ""}">${startTime} Uhr</span>
          </td>
          ${plImg}
          <td rowspan="1" class="lfm_api_schedule_playlist_name lfm_schedule_td">
            <b>${entry.name}</b>
          </td>
          ${entry.description ? `<td rowspan="1" class="lfm_api_schedule_playlist_description lfm_schedule_td">${entry.description}</td>` : ''}
        </tr>
      </table>
    `;
  }

  // Bild HTML für den Sendeplan
  function getImageHtml(id) {
    const imgSrc = `${config.imagesUrl}${id}.png`;
    const imgAlt = `${id}.png`;
    const fallbackSrc = `${config.imagesUrl}${config.defaultImage}`;
    return `
      <td class="lfm_api_schedule_td_img lfm_schedule_td" rowspan="2">
        <img class="lfm_api_schedule_img" src="${imgSrc}" alt="${imgAlt}" onerror="this.src='${fallbackSrc}'">
      </td>
    `;
  }

  // Initiales Laden der Daten
  updateData();
});
