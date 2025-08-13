// use the mobiscroll API and set global Mobiscroll options 
// used AI to fix the loop applied when getting data from MobiScroll

mobiscroll.setOptions({
    theme: 'ios',
    themeVariant: 'light'

});

var countryInst = mobiscroll.select('#demo-country-picker', 
    {
        display: 'anchored',
        filter: true,
        itemHeight: 40,
        renderItem: function (item) {
            return (
                '<div class="md-country-picker-item">' +
               '<img class="md-country-picker-flag" src="https://img.mobiscroll.com/demos/flags/' + 
                item.data.value + 
                '.png" />' + 
                '</div>'
            );
        }
    }
);

mobiscroll.getJson('https://trial.mobiscroll.com/content/countries.json', function (resp) {
    var countries = [];
    for (var i = 0; i < resp.length; ++i) {
        var country = resp[i];
        countries.push({ text: country.text, value: country.value });
    }
    countryInst.setOptions({ data: countries });

});


