class Utils {

    static dateFormat(date) { //método estático no qual não é preciso instanciar um objeto

        let day = date.getDate();
        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        let month = date.getMonth() + 1;
        if (day < 10) {

            day = '0' + day;

        }
        if (month< 10) {

            month = '0' + month;

        }
        if (minutes < 10) {

            minutes = '0' + minutes;

        }
        if (hours < 10) {

            hours = '0' + hours;

        }
        return day + '/' + month + '/' + date.getFullYear() + ' '+ hours + ':' + minutes;

    }

}