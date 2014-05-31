'use strict';

moment.lang('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "un an",
        yy : "%d ans"
    },
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

moment.lang('fr');

var config = angular.module('config', [])    
    .constant('envConfiguration',{
        'default':'test',
        dev:{
            appName:"Afrikik.com Dev",
            host:"http://ec2-54-234-169-178.compute-1.amazonaws.com",
            port:"\:2014",
            api_base_version:"api/v1",
            localStorageKeyPrefix:'dev-afrikik-local',
            localStorageUserKey:'dev-afrikik-local-user',
            clientKey:"Afrikik2014",
            clientSecret:"F00tb@llIsK1ng1NAfriAY3s"
        },
        test:{
            appName:"Afrikik.com",
            host:"http://localapi.afrikik.com",
            port:"\:2014",
            api_base_version:"api/v1",
            localStorageKeyPrefix:'prod-afrikik-local',
            localStorageUserKey:'prod-afrikik-local-user',
            clientKey:"Afrikik2014",
            clientSecret:"F00tb@llIsK1ng1NAfriAY3s"
        },
        prod:{
            appName:"Afrikik.com",
            host:"http://www.afrikik.com",
            port:"",
            api_base_version:"api/v1",
            localStorageKeyPrefix:'prod-nouchi-local',
            localStorageUserKey:'prod-nouchi-local-user',
            clientKey:"",
            clientSecret:""
        },
        standalone:{
            appName:"Afrikik.com",
            host:"",
            port:"",
            api_base_version:"",
            localStorageKeyPrefix:'prod-nouchi-local',
            localStorageUserKey:'prod-nouchi-local-user',
            clientKey:"",
            clientSecret:""
        }
} );
