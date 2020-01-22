//// Fistashki Google Sheet addons GAS-based


// Fistashki Yandex Metrika Connector for Google Sheets Apps
// Version 0.1 
function MetrikaStats(aUrl, dateFrom, dateTo) {
    if (aUrl == undefined || aUrl == null || aUrl == "") {
        throw "No parameter specified. Write any ID as parameter."
    }

    // Метод определён прямо в тексте запроса ниже, документация https://yandex.ru/dev/metrika/doc/api2/api_v1/presets/presets-docpage/
    // todo Выбор кастомных dimensions 
    var url_prefix = "https://api-metrika.yandex.net/stat/v1/data?preset=traffic&limit=10&pretty=true";
    var date_level = "&date1=" + encodeURIComponent(dateFrom) + "&date2=" + encodeURIComponent(dateTo) + "&ids="
    var url = url_prefix + date_level + encodeURIComponent(aUrl)

    // Передаём методы в хедере запроса, токен тестовый
    // todo Возможность нативной OAuth авторизации для получения токена 
    var options = {
        "headers": {
            "Authorization": "OAuth AgAAAAAWFdfaAAYWTG8FMryvAUZGh9GVwpemqfA",
            'method': 'post'
        }
    }
    var response = UrlFetchApp.fetch(url, options);

    if (response.getResponseCode() != 200)
        throw "Unexpected response code from YandexMetrika.";

    var responseText = response.getContentText();

    // Возвращает данные в виде https://yandex.ru/dev/metrika/doc/api2/api_v1/data-docpage/#data__response
    if (responseText == null || responseText == "")
        throw "Empty response from YandexMetrika.";

    var results = 0

    try {
        // Здесь берём только строчку totals, чтобы выводить
        // todo сделать выгрузку не только totals (и данные переводить в двухмерный массив для выдачи в Google Sheets)
        var returnedData = JSON.parse(responseText, false);
        results = returnedData.totals;
    } catch (e) {
        throw "Unreadable response from Metrika: " + e;
    }

    return [results];
}