const SHEET_NAME = 'Заявки';

const HEADERS = [
  'Дата',
  'Тип заявки',
  'Форма',
  'Имя',
  'Телефон',
  'Город / регион',
  'Статус',
  'Способ связи',
  'Комментарий',
  'Филиалы',
  'Задача',
  'Проблема',
  'Желаемый результат',
  'Согласие',
  'Страница',
  'Первый вход',
  'Источник формы',
  'Referrer',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'UTM content',
  'UTM term',
  'yclid',
  'gclid',
  'fbclid',
  'Язык',
  'Часовой пояс',
  'Экран',
  'User Agent',
  'Raw JSON',
];

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse((event.postData && event.postData.contents) || '{}');
    const sheet = getLeadSheet_();
    ensureHeaders_(sheet);
    sheet.appendRow(buildLeadRow_(payload));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const hasHeaders = currentHeaders.some(Boolean);

  if (!hasHeaders) {
    headerRange.setValues([HEADERS]);
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function buildLeadRow_(payload) {
  const values = payload.values || {};
  const tracking = payload.tracking || {};

  return [
    tracking.submittedAt || new Date().toISOString(),
    payload.kind || '',
    payload.formName || '',
    values.name || '',
    values.phone || '',
    values.city || values.region || '',
    values.status || '',
    values.contactMethod || '',
    values.comment || '',
    values.branches || '',
    values.task || '',
    values.problem || '',
    values.result || '',
    values.consent === true ? 'Да' : '',
    tracking.pageUrl || '',
    tracking.landingPage || '',
    tracking.source || '',
    tracking.referrer || '',
    tracking.utmSource || '',
    tracking.utmMedium || '',
    tracking.utmCampaign || '',
    tracking.utmContent || '',
    tracking.utmTerm || '',
    tracking.yclid || '',
    tracking.gclid || '',
    tracking.fbclid || '',
    tracking.language || '',
    tracking.timezone || '',
    tracking.screenSize || '',
    tracking.userAgent || '',
    JSON.stringify(payload),
  ];
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
